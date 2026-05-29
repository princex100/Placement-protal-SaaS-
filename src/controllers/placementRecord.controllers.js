import { BranchPlacementRecord } from "../models/BranchPlacementRecord.models.js";
import Student from "../models/Student.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// GET /api/v1/placement-records
export const getPlacementOverview = asyncHandler(async (req, res) => {
  const collegeId = req.user._id;

  // Find all branch records for this college, excluding the heavy 'students' array
  const records = await BranchPlacementRecord.find({ college: collegeId }).select("-students");

  return res
    .status(200)
    .json(new ApiResponse(200, records, "Placement records retrieved successfully"));
});

// GET /api/v1/placement-records/:branchId
export const getBranchPlacementDetails = asyncHandler(async (req, res) => {
  const { branchId } = req.params;
  const collegeId = req.user._id;

  const record = await BranchPlacementRecord.findOne({
    _id: branchId,
    college: collegeId,
  }).populate("students.student", "fullName rollNo email profileImage branch cgpa placementBlocked");

  if (!record) {
    throw new ApiError(404, "Branch placement record not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, record, "Branch details retrieved successfully"));
});

// GET /api/v1/placement-records/student/:studentId
export const getStudentProfileDetails = asyncHandler(async (req, res) => {
  const { studentId } = req.params;
  const collegeId = req.user._id;

  const student = await Student.findOne({
    _id: studentId,
    college: collegeId,
  });

  if (!student) {
    throw new ApiError(404, "Student not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, student, "Student profile retrieved successfully"));
});

// PATCH /api/v1/placement-records/student/:studentId/toggle-block
export const togglePlacementBlock = asyncHandler(async (req, res) => {
  const { studentId } = req.params;
  const collegeId = req.user._id;

  const student = await Student.findOne({
    _id: studentId,
    college: collegeId,
  });

  if (!student) {
    throw new ApiError(404, "Student not found");
  }

  student.placementBlocked = !student.placementBlocked;
  await student.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { placementBlocked: student.placementBlocked },
        `Student placement has been ${student.placementBlocked ? "blocked" : "unblocked"} successfully`
      )
    );
});
