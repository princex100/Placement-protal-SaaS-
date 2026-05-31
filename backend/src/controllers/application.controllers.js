import Application from "../models/application.models.js";
import PlacementDrive from "../models/placementDrive.models.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

// Student applies to a drive
export const applyToDrive = asyncHandler(async (req, res) => {
  const student = req.student;
  const driveId = req.params.driveId;

  // 1. Check if drive exists and is active/open
  const drive = await PlacementDrive.findById(driveId);
  if (!drive || drive.status !== "open" || !drive.isActive) {
    throw new ApiError(404, "Drive is not available for applications");
  }

  // 2. Ensure student belongs to the same college
  if (drive.college.toString() !== student.college.toString()) {
    throw new ApiError(403, "You can only apply to drives from your own college");
  }

  // 3. (Deferred) We will check resume after eligibility

  // 4. Check deadline
  if (new Date(drive.applicationDeadline) < new Date()) {
    throw new ApiError(400, "Application deadline has passed");
  }

  // 5. Check Eligibility
  // a) Placement Season
  if (drive.placementSeasonYear !== student.placementSeasonYear) {
    throw new ApiError(400, "You are not eligible for this drive (Placement Season mismatch)");
  }
  // b) Placement Status
  if (student.placementStatus === "placed") {
    throw new ApiError(400, "You are already placed and cannot apply for this drive");
  }
  // c) CGPA
  if (drive.minimumCgpa && student.cgpa < drive.minimumCgpa) {
    throw new ApiError(400, `You do not meet the minimum CGPA requirement (${drive.minimumCgpa})`);
  }
  // d) Backlogs
  if (drive.backlogAllowed !== undefined && student.backlogCount > drive.backlogAllowed) {
    throw new ApiError(400, `You exceed the maximum allowed active backlogs (${drive.backlogAllowed})`);
  }
  // e) Allowed Branches
  if (drive.eligibleBranches && drive.eligibleBranches.length > 0) {
    if (!drive.eligibleBranches.includes(student.branch)) {
      throw new ApiError(400, "Your branch is not eligible for this drive");
    }
  }
  // f) Passing Year
  if (drive.passingYearsAllowed && drive.passingYearsAllowed.length > 0) {
    if (!drive.passingYearsAllowed.includes(student.passingYear)) {
      throw new ApiError(400, "Your passing year is not eligible for this drive");
    }
  }
  // g) Skills
  if (drive.skillsRequired && drive.skillsRequired.length > 0) {
    const studentSkills = student.skills || [];
    const hasRequiredSkill = drive.skillsRequired.some(skill => studentSkills.includes(skill));
    if (!hasRequiredSkill) {
      throw new ApiError(400, "You do not possess the required skills for this drive");
    }
  }

  // 6. Prevent duplicate applications
  const existingApplication = await Application.findOne({ student: student._id, drive: driveId });
  if (existingApplication) {
    throw new ApiError(400, "You have already applied to this drive");
  }
  
  // Prevent duplicate insertion in drive.students
  const isAlreadyInDrive = drive.students?.some(s => s.student.toString() === student._id.toString());
  if (isAlreadyInDrive) {
    throw new ApiError(400, "You are already registered as an eligible student in this drive");
  }

  // 7. Handle Resume Upload via Cloudinary if new file provided
  const Student = (await import("../models/Student.models.js")).default;
  let finalResumeUrl = student.resume;

  if (req.file) {
    const cloudinaryResponse = await uploadOnCloudinary(req.file.path);
    finalResumeUrl = cloudinaryResponse.secure_url || cloudinaryResponse.url;
    
    // Update student's default resume
    await Student.findByIdAndUpdate(student._id, { $set: { resume: finalResumeUrl } });
  }

  if (!finalResumeUrl) {
    throw new ApiError(400, "Please upload a resume before applying");
  }

  // 8. Create application
  const application = await Application.create({
    student: student._id,
    drive: driveId,
    college: student.college,
    placementSeasonYear: drive.placementSeasonYear,
    resumeSnapshot: finalResumeUrl // Snapshot resume at time of applying
  });

  // Increment totalApplicants count and add to students array
  await PlacementDrive.findByIdAndUpdate(driveId, { 
    $inc: { totalApplicants: 1 },
    $push: { students: { student: student._id } }
  });

  // Update student appliedDrives
  await Student.findByIdAndUpdate(student._id, {
    $addToSet: { appliedDrives: driveId }
  });

  return res.status(201).json(new ApiResponse(201, application, "Successfully applied to drive"));
});

// Student fetches their own applications
export const getMyApplications = asyncHandler(async (req, res) => {
  const studentId = req.student._id;

  const applications = await Application.find({ student: studentId })
    .populate("drive", "title companyName role status")
    .sort({ appliedAt: -1 });

  return res.status(200).json(new ApiResponse(200, applications, "Applications fetched successfully"));
});

// College fetches applicants for a specific drive (Paginated)
export const getDriveApplicants = asyncHandler(async (req, res) => {
  const collegeId = req.college._id;
  const driveId = req.params.driveId;

  // Verify drive belongs to college
  const drive = await PlacementDrive.findOne({ _id: driveId, college: collegeId });
  if (!drive) {
    throw new ApiError(404, "Drive not found or unauthorized");
  }

  // Pagination parameters
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 25;
  const skip = (page - 1) * limit;

  const filter = { drive: driveId, college: collegeId };
  if (req.query.showRejected !== 'true') {
    filter.applicationStatus = { $ne: "rejected" };
  }

  // Fetch data concurrently
  const [totalApplications, applications] = await Promise.all([
    Application.countDocuments(filter),
    Application.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate("student", "fullName rollNo branch cgpa email placementStatus")
      .populate("drive", "companyName role applicationWorkflowStage")
      .lean()
  ]);

  const totalPages = Math.ceil(totalApplications / limit);

  return res.status(200).json(new ApiResponse(200, {
    drive,
    applications,
    currentPage: page,
    totalPages: totalPages === 0 ? 1 : totalPages,
    totalApplications,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1
  }, "Applicants fetched successfully"));
});

export const advanceDriveWorkflow = asyncHandler(async (req, res) => {
  const collegeId = req.college._id;
  const driveId = req.params.driveId;

  if (!req.file) {
    throw new ApiError(400, "Please upload an Excel or CSV file");
  }

  const drive = await PlacementDrive.findOne({ _id: driveId, college: collegeId });
  if (!drive) {
    throw new ApiError(404, "Drive not found or unauthorized");
  }

  if (drive.applicationWorkflowStage === "completed") {
    throw new ApiError(400, "Drive workflow is already completed");
  }

  const xlsx = (await import("xlsx")).default;
  const workbook = xlsx.readFile(req.file.path);
  const sheetName = workbook.SheetNames[0];
  const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

  if (!sheetData || sheetData.length === 0) {
    throw new ApiError(400, "The uploaded file is empty");
  }

  // Find roll number column using semi-mapping
  const { studentHeaderMap } = await import("../constants/studentHeaderMap.js");
  const headers = Object.keys(sheetData[0]);
  let rollNoKey = null;

  for (const header of headers) {
    const normalizedHeader = header.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (studentHeaderMap.rollNo.includes(normalizedHeader)) {
      rollNoKey = header;
      break;
    }
  }

  if (!rollNoKey) {
    throw new ApiError(400, "Could not detect roll number column in the uploaded file");
  }

  const uploadedRollNumbers = sheetData
    .map(row => row[rollNoKey]?.toString().trim().toUpperCase())
    .filter(Boolean);

  let sourceStatus;
  let targetStatus;
  let nextWorkflowStage;

  switch (drive.applicationWorkflowStage) {
    case "shortlisting":
      sourceStatus = "applied";
      targetStatus = "shortlisted";
      nextWorkflowStage = "interview";
      break;
    case "interview":
      sourceStatus = "shortlisted";
      targetStatus = "interview_scheduled";
      nextWorkflowStage = "selection";
      break;
    case "selection":
      sourceStatus = "interview_scheduled";
      targetStatus = "selected";
      nextWorkflowStage = "completed";
      break;
    default:
      throw new ApiError(400, "Invalid workflow stage");
  }

  // Find all current applications for this drive at the source status
  const currentApplications = await Application.find({ 
    drive: driveId, 
    college: collegeId,
    applicationStatus: sourceStatus
  }).populate("student", "rollNo");

  const matchedAppIds = [];
  const unmatchedAppIds = [];
  const selectedStudentIds = [];

  currentApplications.forEach(app => {
    if (app.student && app.student.rollNo) {
      if (uploadedRollNumbers.includes(app.student.rollNo.toUpperCase())) {
        matchedAppIds.push(app._id);
        if (targetStatus === "selected") {
          selectedStudentIds.push(app.student._id);
        }
      } else {
        unmatchedAppIds.push(app._id);
      }
    }
  });

  // Bulk update matched
  if (matchedAppIds.length > 0) {
    await Application.updateMany(
      { _id: { $in: matchedAppIds } },
      { 
        $set: { 
          applicationStatus: targetStatus,
          statusUpdatedAt: new Date(),
          statusUpdatedBy: collegeId
        } 
      }
    );
  }

  // Bulk update unmatched
  if (unmatchedAppIds.length > 0) {
    await Application.updateMany(
      { _id: { $in: unmatchedAppIds } },
      { 
        $set: { 
          applicationStatus: "rejected",
          statusUpdatedAt: new Date(),
          statusUpdatedBy: collegeId
        } 
      }
    );
  }

  // Update placement status if selected
  if (selectedStudentIds.length > 0) {
    const StudentModel = req.app.get("mongoose") ? req.app.get("mongoose").model("Student") : null;
    const Student = StudentModel || (await import("../models/Student.models.js")).default;
    await Student.updateMany(
      { _id: { $in: selectedStudentIds } },
      { $set: { placementStatus: "placed" } }
    );
  }

  // Advance drive workflow
  drive.applicationWorkflowStage = nextWorkflowStage;
  await drive.save();

  return res.status(200).json(new ApiResponse(200, {
    matchedCount: matchedAppIds.length,
    unmatchedCount: unmatchedAppIds.length,
    newWorkflowStage: nextWorkflowStage
  }, `Workflow advanced to ${nextWorkflowStage}`));
});

export const updateApplicationStatus = asyncHandler(async (req, res) => {
  const collegeId = req.college._id;
  const applicationId = req.params.applicationId;
  const { applicationStatus, remarks } = req.body;

  // Find application and ensure it belongs to the college
  const application = await Application.findOne({ _id: applicationId, college: collegeId });
  if (!application) {
    throw new ApiError(404, "Application not found or unauthorized");
  }

  application.applicationStatus = applicationStatus;
  application.statusUpdatedAt = new Date();
  application.statusUpdatedBy = collegeId;
  if (remarks) application.remarks = remarks;
  
  await application.save();

  // Update student's placementStatus if selected
  if (applicationStatus === "selected") {
    const StudentModel = req.app.get("mongoose") ? req.app.get("mongoose").model("Student") : null;
    if(!StudentModel) {
       const Student = (await import("../models/Student.models.js")).default;
       await Student.findByIdAndUpdate(application.student, { placementStatus: "placed" });
    }
  }

  return res.status(200).json(new ApiResponse(200, application, "Application status updated successfully"));
});

// College fetches all applications (Paginated)
export const getAllCollegeApplications = asyncHandler(async (req, res) => {
  const collegeId = req.college._id;
  
  // Pagination parameters
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const filter = { 
    college: collegeId,
    placementSeasonYear: req.college.activePlacementSeason
  };

  // Fetch data concurrently
  const [totalApplications, applications] = await Promise.all([
    Application.countDocuments(filter),
    Application.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate("student", "fullName rollNo branch cgpa")
      .populate("drive", "companyName role")
      .lean()
  ]);

  const totalPages = Math.ceil(totalApplications / limit);

  return res.status(200).json(new ApiResponse(200, {
    applications,
    currentPage: page,
    totalPages: totalPages === 0 ? 1 : totalPages,
    totalApplications,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1
  }, "Applications fetched successfully"));
});

// College fetches a single application by ID
export const getApplicationById = asyncHandler(async (req, res) => {
  const applicationId = req.params.applicationId;
  const isStudent = req.role === "student";

  const query = { _id: applicationId };
  if (isStudent) {
    query.student = req.student._id;
  } else {
    query.college = req.college._id;
  }

  const application = await Application.findOne(query)
    .populate("student", "fullName rollNo email branch cgpa passingYear skills resume")
    .populate("drive", "title companyName role package location applicationDeadline")
    .lean();

  if (!application) {
    throw new ApiError(404, "Application not found or unauthorized");
  }

  return res.status(200).json(new ApiResponse(200, application, "Application details fetched successfully"));
});
