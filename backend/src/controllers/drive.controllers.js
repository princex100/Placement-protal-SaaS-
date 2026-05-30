import PlacementDrive from "../models/placementDrive.models.js";
import Application from "../models/application.models.js";
import College from "../models/College.models.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

// College creates a drive
export const createDrive = asyncHandler(async (req, res) => {
  const collegeId = req.college._id;
  const driveData = req.body;

  const drive = await PlacementDrive.create({
    ...driveData,
    college: collegeId,
    placementSeasonYear: req.college.activePlacementSeason
  });

  return res.status(201).json(new ApiResponse(201, drive, "Placement drive created successfully"));
});

// College updates a drive
export const updateDrive = asyncHandler(async (req, res) => {
  const collegeId = req.college._id;
  const driveId = req.params.id;
  const updates = req.body;

  const drive = await PlacementDrive.findOneAndUpdate(
    { _id: driveId, college: collegeId },
    { $set: updates },
    { new: true, runValidators: true }
  );

  if (!drive) {
    throw new ApiError(404, "Drive not found or unauthorized");
  }

  return res.status(200).json(new ApiResponse(200, drive, "Placement drive updated successfully"));
});

// College deletes a drive
export const deleteDrive = asyncHandler(async (req, res) => {
  const collegeId = req.college._id;
  const driveId = req.params.id;

  const drive = await PlacementDrive.findOneAndDelete({ _id: driveId, college: collegeId });

  if (!drive) {
    throw new ApiError(404, "Drive not found or unauthorized");
  }

  // Also delete all associated applications
  await Application.deleteMany({ drive: driveId });

  return res.status(200).json(new ApiResponse(200, null, "Placement drive deleted successfully"));
});

// College fetches all their drives
export const getCollegeDrives = asyncHandler(async (req, res) => {
  const collegeId = req.college._id;

  const drives = await PlacementDrive.find({ 
    college: collegeId,
    placementSeasonYear: req.college.activePlacementSeason 
  })
    .select("companyName role package location applicationDeadline students status")
    .sort({ createdAt: -1 })
    .lean();
    
  // Map students array length to a clean count for the frontend, remove students array to save bandwidth
  const mappedDrives = drives.map(drive => ({
    ...drive,
    appliedStudentsCount: drive.students ? drive.students.length : 0,
    students: undefined
  }));

  return res.status(200).json(new ApiResponse(200, mappedDrives, "Drives fetched successfully"));
});

// Student fetches eligible drives (Includes isApplied flag)
export const getEligibleDrives = asyncHandler(async (req, res) => {
  const student = req.student;

  // Find all active open drives for the student's college
  // You can add more complex eligibility checks here (e.g., CGPA, branch, etc.)
  const filter = {
    college: student.college,
    placementSeasonYear: student.placementSeasonYear,
    status: "open",
    isActive: true,
    // Add logic to compare student.cgpa >= minimumCgpa etc. if desired
  };

  const drives = await PlacementDrive.find(filter).lean();

  // Find all applications this student has made
  const applications = await Application.find({ student: student._id }).select("drive status");
  const appliedDriveIds = new Set(applications.map((app) => app.drive.toString()));

  // Map drives to include the isApplied flag
  const drivesWithApplicationStatus = drives.map((drive) => {
    return {
      ...drive,
      isApplied: appliedDriveIds.has(drive._id.toString())
    };
  });

  return res.status(200).json(new ApiResponse(200, drivesWithApplicationStatus, "Eligible drives fetched successfully"));
});

// Get a single drive by ID
export const getDriveById = asyncHandler(async (req, res) => {
  const driveId = req.params.id;

  const drive = await PlacementDrive.findById(driveId).lean();
  if (!drive) throw new ApiError(404, "Drive not found");

  // Verify access
  if (req.role === "college-admin" && drive.college.toString() !== req.college._id.toString()) {
    throw new ApiError(403, "Unauthorized access to this drive");
  }
  if (req.role === "student" && drive.college.toString() !== req.student.college.toString()) {
    throw new ApiError(403, "Unauthorized access to this drive");
  }
  
  // Attach applied count dynamically from Application model
  const applicationsCount = await Application.countDocuments({ 
    drive: driveId, 
    college: req.role === "college-admin" ? req.college._id : drive.college 
  });
  
  drive.appliedStudentsCount = applicationsCount;
  // Remove the actual students array from this endpoint (handled by /students route)
  delete drive.students;

  return res.status(200).json(new ApiResponse(200, drive, "Drive fetched successfully"));
});

// College fetches students who applied to a drive
export const getDriveStudents = asyncHandler(async (req, res) => {
  const collegeId = req.college._id;
  const driveId = req.params.id;

  const drive = await PlacementDrive.findOne({ _id: driveId, college: collegeId })
    .populate("students", "fullName rollNo branch cgpa");

  if (!drive) {
    throw new ApiError(404, "Drive not found or unauthorized");
  }

  return res.status(200).json(new ApiResponse(200, drive.students, "Applied students fetched successfully"));
});

// College removes a student from a drive
export const removeStudentFromDrive = asyncHandler(async (req, res) => {
  const collegeId = req.college._id;
  const driveId = req.params.id;
  const studentId = req.params.studentId;

  // 1. Remove student reference from the Drive's students array
  const drive = await PlacementDrive.findOneAndUpdate(
    { _id: driveId, college: collegeId },
    { $pull: { students: studentId } },
    { new: true }
  );

  if (!drive) {
    throw new ApiError(404, "Drive not found or unauthorized");
  }

  // 2. Delete the associated Application document
  await Application.findOneAndDelete({ drive: driveId, student: studentId });

  return res.status(200).json(new ApiResponse(200, null, "Student removed from drive successfully"));
});
