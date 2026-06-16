import fs from "fs";
import xlsx from "xlsx";
import bcrypt from "bcrypt";
import Student from "../models/Student.models.js";
import Branch from "../models/branch.models.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { studentHeaderMap } from "../constants/studentHeaderMap.js";
import { generateStudentPassword } from "../utils/generateStudentPassword.js";

const normalizeHeader = (header) => {
  if (!header) return "";
  return String(header).toLowerCase().replace(/[\s\-_]/g, "");
};

export const importStudents = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "Please upload an Excel or CSV file.");
  }

  const collegeId = req.college._id;
  const placementSeasonYear = req.college.activePlacementSeason;

  let workbook;
  try {
    workbook = xlsx.readFile(req.file.path);
  } catch (error) {
    fs.unlinkSync(req.file.path);
    throw new ApiError(400, "Failed to parse the file. Please ensure it is a valid Excel or CSV file.");
  }

  const sheetName = workbook.SheetNames[0];
  console.log(workbook);
  
  const worksheet = workbook.Sheets[sheetName];
  const rawData = xlsx.utils.sheet_to_json(worksheet, { defval: "" });

  // Delete temp file after reading
  fs.unlinkSync(req.file.path);

  if (!rawData || rawData.length === 0) {
    throw new ApiError(400, "The uploaded file is empty.");
  }

  // Detect mapping
  const rawHeaders = Object.keys(rawData[0]);
  const detectedMapping = {};

  rawHeaders.forEach((rawHeader) => {
    const normalized = normalizeHeader(rawHeader);
    for (const [schemaKey, variations] of Object.entries(studentHeaderMap)) {
      if (variations.includes(normalized)) {
        detectedMapping[rawHeader] = schemaKey;
        break;
      }
    }
  });

  // Check required fields
  const detectedSchemaKeys = Object.values(detectedMapping);
  const missingRequired = [];
  if (!detectedSchemaKeys.includes("fullName")) missingRequired.push("fullName");
  if (!detectedSchemaKeys.includes("rollNo")) missingRequired.push("rollNo");
  if (!detectedSchemaKeys.includes("branch")) missingRequired.push("branch");

  if (missingRequired.length > 0) {
    throw new ApiError(
      400,
      `Could not detect required columns: ${missingRequired.join(", ")}. Please check your headers.`
    );
  }

  // Transform data and collect unique branches
  const uniqueBranches = {};
  const studentsToInsert = [];

  for (const row of rawData) {
    const studentData = {
      college: collegeId,
      placementSeasonYear,
      isProfileCompleted: false,
      placementStatus: "unplaced",
      placementBlocked: false,
      role: "student",
      mustChangePassword: true,
      passingYear: placementSeasonYear, // Default to placementSeasonYear
      semester: 7, // Default semester for final year
    };

    let hasRequiredData = true;

    for (const [rawHeader, schemaKey] of Object.entries(detectedMapping)) {
      const value = row[rawHeader];
      if (schemaKey === "fullName" && !value) hasRequiredData = false;
      if (schemaKey === "rollNo" && !value) hasRequiredData = false;
      if (schemaKey === "branch" && !value) hasRequiredData = false;

      if (schemaKey === "cgpa") {
        studentData[schemaKey] = Number(value) || 0;
      } else {
        studentData[schemaKey] = value;
      }
    }

    if (!hasRequiredData) continue; // Skip empty rows

    // Generate and manually hash password (insertMany bypasses pre-save hook)
    const generatedPassword = generateStudentPassword(studentData.fullName, studentData.rollNo);
    studentData.password = await bcrypt.hash(generatedPassword, 10);

    studentsToInsert.push(studentData);

    // Track unique branches (case-insensitive deduplication for this batch)
    const branchName = String(studentData.branch).trim();
    studentData.branch = branchName;
    const branchKey = branchName.toLowerCase();
    
    if (uniqueBranches[branchKey]) {
      uniqueBranches[branchKey].studentCount++;
    } else {
      uniqueBranches[branchKey] = {
        name: branchName,
        studentCount: 1,
      };
    }
  }

  if (studentsToInsert.length === 0) {
    throw new ApiError(400, "No valid student data found in the file.");
  }

  // Ensure branches exist and build a map of lowercased branch name to exact DB branch name
  const exactBranchNames = {};
  const branchCreationPromises = Object.values(uniqueBranches).map(async (branchInfo) => {
    // Check if branch already exists for this college
    let branchDoc = await Branch.findOne({
      college: collegeId,
      name: { $regex: new RegExp(`^${branchInfo.name}$`, "i") },
    });

    if (!branchDoc) {
      branchDoc = await Branch.create({
        name: branchInfo.name,
        college: collegeId,
      });
    }

    exactBranchNames[branchInfo.name.toLowerCase()] = branchDoc._id;

    return branchDoc;
  });

  await Promise.all(branchCreationPromises);

  // Update students to use the exact branch name from DB and remove invalid emails
  for (const student of studentsToInsert) {
    const lowerBranch = student.branch.toLowerCase();
    if (exactBranchNames[lowerBranch]) {
      student.branch = exactBranchNames[lowerBranch];
    }
    
    // Remove invalid email to prevent global duplicate key errors on sparse index
    // Also handles placeholders like "N/A", "-", or spaces.
    if (!student.email || typeof student.email !== 'string' || !student.email.includes('@')) {
      delete student.email;
    } else {
      student.email = student.email.trim();
    }
  }


  ///////////////////////////
  ///////////////////////////
  // Bulk Insert students
  // Ignore duplicates gracefully if possible, or let it fail if roll numbers overlap
  let successfullyImportedCount = 0;
  try {
    const result = await Student.insertMany(studentsToInsert, { ordered: false });
    successfullyImportedCount = result.length;
  } catch (error) {
    // ordered: false throws if there are duplicates, but inserts the rest.
    if (error.code === 11000) {
      // Some inserted, some failed (duplicate rollNo or email)
      successfullyImportedCount = error.insertedDocs ? error.insertedDocs.length : 0;
      
      if (successfullyImportedCount === 0) {
        throw new ApiError(400, `All ${studentsToInsert.length} students failed to import. This is likely because the Roll Numbers already exist in the database, or they share an exact duplicate placeholder Email (e.g. 'N/A') with another student. Please ensure all Roll Numbers and Emails are unique.`);
      }
    } else {
      throw new ApiError(500, "Error occurred during bulk insert.");
    }
  }

  ////////////////////////RESPONSE FINAL 
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        studentsImported: successfullyImportedCount,
        totalAttempted: studentsToInsert.length,
        branchesDetected: Object.keys(uniqueBranches).length,
      },
      `${successfullyImportedCount} out of ${studentsToInsert.length} students imported successfully. Default password is the first 3 letters of their first name (uppercase) followed by the last 4 digits of their roll number.`
    )
  );
});
