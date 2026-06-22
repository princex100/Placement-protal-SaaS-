import Application from "../models/application.models.js";
import PlacementDrive from "../models/placementDrive.models.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { generateMailContent, sendEmail } from "../utils/sendEmail.js";
import fs from "fs";

export const uploadInterviewSchedule = asyncHandler(async (req, res) => {
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

  if (drive.applicationWorkflowStage !== "interview") {
    fs.unlinkSync(req.file.path);
    throw new ApiError(400, "Interview scheduling is not available for this drive.");
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

  fs.unlinkSync(req.file.path);

  if (!sheetData || sheetData.length === 0) {
    throw new ApiError(400, "The uploaded file is empty");
  }

  const headerMaps = {
    rollNo: ["rollnumber", "rollno"],
    interviewDate: ["interviewdate", "date"],
    interviewTime: ["interviewtime", "time"],
    venue: ["venue"],
    meetingLink: ["meetinglink", "meetlink", "googlemeet"]
  };

 const headers = Object.keys(sheetData[0]);
  const mappedKeys = {
    rollNo: null,
    interviewDate: null,
    interviewTime: null,
    venue: null,
    meetingLink: null
  };

  // Check the studentHeaderMap for rollNo
  const { studentHeaderMap } = await import("../constants/studentHeaderMap.js");

  for (const header of headers) {
    const normalizedHeader = String(header).toLowerCase().replace(/[^a-z0-9]/g, "");
    
    if (studentHeaderMap.rollNo.includes(normalizedHeader) || headerMaps.rollNo.includes(normalizedHeader)) {
      mappedKeys.rollNo = header;
    } else if (headerMaps.interviewDate.includes(normalizedHeader)) {
      mappedKeys.interviewDate = header;
    } else if (headerMaps.interviewTime.includes(normalizedHeader)) {
      mappedKeys.interviewTime = header;
     } else if (headerMaps.venue.includes(normalizedHeader)) {
      mappedKeys.venue = header;
    } else if (headerMaps.meetingLink.includes(normalizedHeader)) {
      mappedKeys.meetingLink = header;
    }
  }

  if (!mappedKeys.rollNo) {
    throw new ApiError(400, "Could not detect roll number column in the uploaded file");
  }
 if (!mappedKeys.interviewDate || !mappedKeys.interviewTime) {
    throw new ApiError(400, "The file must contain both Interview Date and Interview Time columns.");
  }

  const interviewDataMap = new Map();
  const errors = [];

   sheetData.forEach((row, index) => {
    const rollNo = String(row[mappedKeys.rollNo] || "").trim().toUpperCase();
    if (!rollNo) return;

   const interviewDate = String(row[mappedKeys.interviewDate] || "").trim();
    const interviewTime = String(row[mappedKeys.interviewTime] || "").trim();
    const venue = mappedKeys.venue ? String(row[mappedKeys.venue] || "").trim() : "";
    const meetingLink = mappedKeys.meetingLink ? String(row[mappedKeys.meetingLink] || "").trim() : "";

    if (!interviewDate || !interviewTime) {
      errors.push(`Row ${index + 2}: Missing date or time for Roll No ${rollNo}`);
   }

    interviewDataMap.set(rollNo, {
      interviewDate,
      interviewTime,
      venue,
      meetingLink
     });
 });

  if (errors.length > 0) {
    throw new ApiError(400, "Validation failed: " + errors.join(", "));
   }

  const currentApplications = await Application.find({
    drive: driveId,
    college: collegeId,
    applicationStatus: "shortlisted"
 }).populate("student");

  const matchedAppIds = [];
  const rejectedAppIds = [];
  const studentsToNotify = [];

  const bulkOps = [];

  currentApplications.forEach(app => {
    if (app.student && app.student.rollNo) {
      const studentRollNo = String(app.student.rollNo).toUpperCase();
      
     if (interviewDataMap.has(studentRollNo)) {
        const interviewDetails = interviewDataMap.get(studentRollNo);
        matchedAppIds.push(app._id);
        
       bulkOps.push({
          updateOne: {
             filter: { _id: app._id },
            update: { 
              $set: { 
                applicationStatus: "interview_scheduled",
               interviewDetails,
                statusUpdatedAt: new Date(),
                statusUpdatedBy: collegeId
              } 
            }
          }
        });

       // Queue student for email
        studentsToNotify.push({
          email: app.student.email,
          fullName: app.student.fullName,
          companyName: drive.companyName,
          role: drive.role,
          ...interviewDetails
        });

      } else {
        rejectedAppIds.push(app._id);
        
        bulkOps.push({
          updateOne: {
            filter: { _id: app._id },
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
    }
  });

  if (bulkOps.length > 0) {
     await Application.bulkWrite(bulkOps);
  }

  drive.applicationWorkflowStage = "selection";
  await drive.save();

  res.status(200).json(new ApiResponse(200, {
    success: true,
    interviewScheduledCount: matchedAppIds.length,
    rejectedCount: rejectedAppIds.length,
    emailsSent: studentsToNotify.length,
     nextStage: "Selection"
   }, "Interview Schedule Processed Successfully. Drive moved to Selection Stage."));

  if (studentsToNotify.length > 0) {
    (async () => {
       for (const studentData of studentsToNotify) {
        try {
           const bodyDict = [
            {
              item: "Company",
              description: studentData.companyName
            },
           {
              item: "Role",
              description: studentData.role
            },
            {
              item: "Interview Date",
             description: studentData.interviewDate
            },
            {
               item: "Interview Time",
              description: studentData.interviewTime
            }
          ];

          if (studentData.venue) {
            bodyDict.push({ item: "Venue", description: studentData.venue });
           }
          if (studentData.meetingLink) {
            bodyDict.push({ item: "Meeting Link", description: `<a href="${studentData.meetingLink}">${studentData.meetingLink}</a>` });
          }

          const emailBody = {
            name: studentData.fullName,
            intro: "Congratulations! You have been selected for the interview round.",
            dictionary: bodyDict,
             outro: "Please be available 15 minutes before the scheduled time.\n\nBest Regards,\nPlacement Cell"
          };

          const mailgenContent = generateMailContent(emailBody);
          
          await sendEmail({
            email: studentData.email,
            subject: `Interview Scheduled - ${studentData.companyName}`,
            mailgenContent
          });
        } catch (emailError) {
          console.error(`Failed to send interview email to ${studentData.email}:`, emailError);
        }
      }
     })();
  }
});
