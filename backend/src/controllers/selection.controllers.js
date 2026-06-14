import Application from "../models/application.models.js";
import PlacementDrive from "../models/placementDrive.models.js";
import Student from "../models/Student.models.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { generateMailContent, sendEmail } from "../utils/sendEmail.js";
import fs from "fs";
import Branch from "../models/branch.models.js";
import PlacementRecord from "../models/PlacementRecord.models.js";

export const uploadSelection = asyncHandler(async (req, res) => {
  const collegeId = req.college._id;
  const driveId = req.params.driveId;

  if (!req.file) {
    throw new ApiError(400, "Please upload an Excel or CSV file");
  }

  const drive = await PlacementDrive.findOne({ _id: driveId, college: collegeId });
  if (!drive) {
    fs.unlinkSync(req.file.path);
    throw new ApiError(404, "Drive not found or unauthorized");
  }

  // Verify that the drive is in the selection stage
  if (drive.applicationWorkflowStage !== "selection") {
    fs.unlinkSync(req.file.path);
    throw new ApiError(400, "Selection upload is not available for this drive stage.");
  }

  const xlsx = (await import("xlsx")).default;
  let workbook;
  try {
    workbook = xlsx.readFile(req.file.path);
  } catch (error) {
    fs.unlinkSync(req.file.path);
    throw new ApiError(400, "Failed to parse the file. Please ensure it is a valid Excel or CSV file.");
  }

  const sheetName = workbook.SheetNames[0];
  const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

  // Delete temp file after reading
  fs.unlinkSync(req.file.path);

  if (!sheetData || sheetData.length === 0) {
    throw new ApiError(400, "The uploaded file is empty");
  }

  // Find roll number column using header mapping
  const { studentHeaderMap } = await import("../constants/studentHeaderMap.js");
  const headers = Object.keys(sheetData[0]);
  let rollNoKey = null;

  for (const header of headers) {
    const normalizedHeader = String(header).toLowerCase().replace(/[^a-z0-9]/g, "");
    if (studentHeaderMap.rollNo.includes(normalizedHeader) || ["rollnumber", "rollno"].includes(normalizedHeader)) {
      rollNoKey = header;
      break;
    }
  }

  if (!rollNoKey) {
    throw new ApiError(400, "Could not detect roll number column in the uploaded file");
  }

  // Extract roll numbers and put them in a Set
  const selectedRollNumbers = new Set();
  sheetData.forEach((row) => {
    const rawValue = row[rollNoKey];
    if (rawValue) {
      selectedRollNumbers.add(String(rawValue).trim().toUpperCase());
    }
  });

  if (selectedRollNumbers.size === 0) {
    throw new ApiError(400, "No valid roll numbers found in the file.");
  }

  // Fetch current applications for this drive that are interview_scheduled
  const currentApplications = await Application.find({ 
    drive: driveId, 
    college: collegeId,
    applicationStatus: "interview_scheduled"
  }).populate("student", "rollNo email fullName branch placementSeasonYear");

  const matchedAppIds = [];
  const rejectedAppIds = [];
  const selectedStudentIds = [];
  const studentsToNotify = [];

  currentApplications.forEach(app => {
    if (app.student && app.student.rollNo) {
      const studentRollNo = String(app.student.rollNo).toUpperCase();
      if (selectedRollNumbers.has(studentRollNo)) {
        matchedAppIds.push(app._id);
        selectedStudentIds.push(app.student._id);
        
        // Add full student details needed for PlacementRecord
        app.student.companyName = drive.companyName;
        app.student.package = drive.package;
        
        studentsToNotify.push({
          email: app.student.email,
          fullName: app.student.fullName,
          companyName: drive.companyName,
          role: drive.role,
          studentData: app.student // Pass down student for PlacementRecord
        });
      } else {
        rejectedAppIds.push(app._id);
      }
    }
  });

  const bulkOps = [];

  // Prepare bulk operations for selected applications
  if (matchedAppIds.length > 0) {
    bulkOps.push({
      updateMany: {
        filter: { _id: { $in: matchedAppIds } },
        update: { 
          $set: { 
            applicationStatus: "selected",
            statusUpdatedAt: new Date(),
            statusUpdatedBy: collegeId
          } 
        }
      }
    });
  }

  // Prepare bulk operations for rejected applications
  if (rejectedAppIds.length > 0) {
    bulkOps.push({
      updateMany: {
        filter: { _id: { $in: rejectedAppIds } },
        update: { 
          $set: { 
            applicationStatus: "rejected",
            statusUpdatedAt: new Date(),
            statusUpdatedBy: collegeId
          } 
        }
      }
    });
  }

  // Execute bulk update if there are operations
  if (bulkOps.length > 0) {
    await Application.bulkWrite(bulkOps);
  }

  // Update placementStatus of selected students to "placed"
  if (selectedStudentIds.length > 0) {
    await Student.updateMany(
      { _id: { $in: selectedStudentIds } },
      { $set: { placementStatus: "placed" } }
    );

    // Create PlacementRecord documents
    const placementRecordsToInsert = [];
    for (const studentInfo of studentsToNotify) {
      const s = studentInfo.studentData;
      // Resolve the Branch ObjectId by matching name and college
      const branchDoc = await Branch.findOne({ 
        name: { $regex: new RegExp(`^${s.branch}$`, "i") }, 
        college: collegeId 
      });
      
      if (branchDoc) {
        placementRecordsToInsert.push({
          student: s._id,
          college: collegeId,
          branch: branchDoc._id,
          company: s.companyName,
          package: s.package,
          placementSeasonYear: s.placementSeasonYear || drive.placementSeasonYear
        });
      }
    }
    
    if (placementRecordsToInsert.length > 0) {
      await PlacementRecord.insertMany(placementRecordsToInsert, { ordered: false }).catch(err => {
         console.warn("Some placement records might already exist:", err.message);
      });
    }
  }

  // Advance drive workflow to "completed" and close it
  drive.applicationWorkflowStage = "completed";
  drive.status = "closed";
  await drive.save();

  // Send emails using Promise.all in the background
  if (studentsToNotify.length > 0) {
    (async () => {
      try {
        const emailPromises = studentsToNotify.map(student => {
          const emailBody = {
            name: student.fullName,
            intro: `Congratulations! We are thrilled to inform you that you have been selected for the ${student.role} role at ${student.companyName}.`,
            outro: "Your placement status has been updated. Please contact the placement cell for further joining instructions.\\n\\nBest Regards,\\nPlacement Cell"
          };
          const mailgenContent = generateMailContent(emailBody);
          return sendEmail({
            email: student.email,
            subject: `Selection Confirmed - ${student.companyName}`,
            mailgenContent
          });
        });
        await Promise.all(emailPromises);
      } catch (error) {
        console.error("Failed to send some selection emails:", error);
      }
    })();
  }

  return res.status(200).json(new ApiResponse(200, {
    success: true,
    selectedCount: matchedAppIds.length,
    rejectedCount: rejectedAppIds.length,
    emailsSent: studentsToNotify.length,
    nextStage: "Completed"
  }, "Selection successfully processed. Drive moved to Completed Stage."));
});
