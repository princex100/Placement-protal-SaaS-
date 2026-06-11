import Application from "../models/application.models.js";
import PlacementDrive from "../models/placementDrive.models.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { generateMailContent, sendEmail } from "../utils/sendEmail.js";
import fs from "fs";

export const uploadShortlist = asyncHandler(async (req, res) => {
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

  // Verify that the drive is in the shortlist stage
  if (drive.applicationWorkflowStage !== "shortlisting") {
    fs.unlinkSync(req.file.path);
    throw new ApiError(400, "Shortlist stage already completed or invalid stage");
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
    if (studentHeaderMap.rollNo.includes(normalizedHeader)) {
      rollNoKey = header;
      break;
    }
  }

  if (!rollNoKey) {
    throw new ApiError(400, "Could not detect roll number column in the uploaded file");
  }

  // Extract roll numbers and put them in a Set
  const shortlistedRollNumbers = new Set();
  sheetData.forEach((row) => {
    const rawValue = row[rollNoKey];
    if (rawValue) {
      shortlistedRollNumbers.add(String(rawValue).trim().toUpperCase());
    }
  });

  if (shortlistedRollNumbers.size === 0) {
    throw new ApiError(400, "No valid roll numbers found in the file.");
  }

  // Fetch current applications for this drive
  const currentApplications = await Application.find({ 
    drive: driveId, 
    college: collegeId,
    applicationStatus: "applied"
  }).populate("student", "rollNo email fullName");

  const matchedAppIds = [];
  const rejectedAppIds = [];
  const matchedRollNumbers = new Set();
  const studentsToNotify = [];

  currentApplications.forEach(app => {
    if (app.student && app.student.rollNo) {
      const studentRollNo = String(app.student.rollNo).toUpperCase();
      if (shortlistedRollNumbers.has(studentRollNo)) {
        matchedAppIds.push(app._id);
        matchedRollNumbers.add(studentRollNo);
        studentsToNotify.push({
          email: app.student.email,
          fullName: app.student.fullName,
          companyName: drive.companyName,
          role: drive.role
        });
      } else {
        rejectedAppIds.push(app._id);
      }
    }
  });

  // Identify unmatched roll numbers from the uploaded file
  const unmatchedRollNumbers = Array.from(shortlistedRollNumbers).filter(
    (rollNo) => !matchedRollNumbers.has(rollNo)
  );

  const bulkOps = [];

  // Prepare bulk operations for shortlisted applications
  if (matchedAppIds.length > 0) {
    bulkOps.push({
      updateMany: {
        filter: { _id: { $in: matchedAppIds } },
        update: { 
          $set: { 
            applicationStatus: "shortlisted",
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

  // Advance drive workflow to "interview"
  drive.applicationWorkflowStage = "interview";
  await drive.save();

  // Send emails using Promise.all in the background
  if (studentsToNotify.length > 0) {
    (async () => {
      try {
        const emailPromises = studentsToNotify.map(student => {
          const emailBody = {
            name: student.fullName,
            intro: `Congratulations! You have been shortlisted for the ${student.role} role at ${student.companyName}.`,
            outro: "Please check your dashboard for further updates regarding the interview schedule.\\n\\nBest Regards,\\nPlacement Cell"
          };
          const mailgenContent = generateMailContent(emailBody);
          return sendEmail({
            email: student.email,
            subject: `Shortlisted - ${student.companyName}`,
            mailgenContent
          });
        });
        await Promise.all(emailPromises);
      } catch (error) {
        console.error("Failed to send some shortlist emails:", error);
      }
    })();
  }

  return res.status(200).json(new ApiResponse(200, {
    success: true,
    shortlistedCount: matchedAppIds.length,
    rejectedCount: rejectedAppIds.length,
    unmatchedRollNumbers,
    nextStage: "Interview Schedule"
  }, "Shortlist successfully processed. Drive moved to Interview Schedule."));
});
