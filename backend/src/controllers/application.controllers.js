import Application from "../models/application.models.js";
import PlacementDrive from "../models/placementDrive.models.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

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

  // 3. Ensure student has a resume
  if (!student.resume) {
    throw new ApiError(400, "Please upload a resume in your profile before applying");
  }

  // 4. Check deadline
  if (new Date(drive.applicationDeadline) < new Date()) {
    throw new ApiError(400, "Application deadline has passed");
  }

  // 5. Prevent duplicate applications
  const existingApplication = await Application.findOne({ student: student._id, drive: driveId });
  if (existingApplication) {
    throw new ApiError(400, "You have already applied to this drive");
  }

  // 6. Create application
  const application = await Application.create({
    student: student._id,
    drive: driveId,
    college: student.college,
    resumeSnapshot: student.resume // Snapshot resume at time of applying
  });

  // Increment totalApplicants count in Drive
  await PlacementDrive.findByIdAndUpdate(driveId, { $inc: { totalApplicants: 1 } });

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

// College fetches applicants for a specific drive
export const getDriveApplicants = asyncHandler(async (req, res) => {
  const collegeId = req.college._id;
  const driveId = req.params.driveId;

  // Verify drive belongs to college
  const drive = await PlacementDrive.findOne({ _id: driveId, college: collegeId });
  if (!drive) {
    throw new ApiError(404, "Drive not found or unauthorized");
  }

  const applications = await Application.find({ drive: driveId })
    .populate("student", "fullName email branch cgpa passingYear skills resume")
    .sort({ appliedAt: -1 });

  return res.status(200).json(new ApiResponse(200, applications, "Applicants fetched successfully"));
});

// College updates application status
export const updateApplicationStatus = asyncHandler(async (req, res) => {
  const collegeId = req.college._id;
  const applicationId = req.params.applicationId;
  const { status, remarks } = req.body;

  // Find application and ensure it belongs to the college
  const application = await Application.findOne({ _id: applicationId, college: collegeId });
  if (!application) {
    throw new ApiError(404, "Application not found or unauthorized");
  }

  application.status = status;
  if (remarks) application.remarks = remarks;
  
  await application.save();

  // If status is "Selected", you could also update student's placementStatus
  if (status === "Selected") {
    // We only import Student if we need it here, or we can use mongoose.model
    const StudentModel = req.app.get("mongoose") ? req.app.get("mongoose").model("Student") : null;
    if(!StudentModel) {
       // fallback if we need it, but normally we just import it
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

  const filter = { college: collegeId };

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
