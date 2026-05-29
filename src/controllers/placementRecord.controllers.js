import { BranchPlacementRecord } from "../models/BranchPlacementRecord.models.js";
import Student from "../models/Student.models.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

// GET /api/v1/placement-records
export const getPlacementOverview = asyncHandler(async (req, res) => {
  const collegeId = req.user._id;

  // Find all branch records for this college and populate branch name
  const records = await BranchPlacementRecord.find({ college: collegeId })
    .populate("branch", "name")
    .lean();

  // Dynamically calculate counts using Promise.all for speed
  const enrichedRecords = await Promise.all(
    records.map(async (record) => {
      // The branch.name is the string inside the branch doc
      const branchName = record.branch?.name || "";

      const [totalStudents, eligibleStudents] = await Promise.all([
        Student.countDocuments({ college: collegeId, branch: branchName }),
        Student.countDocuments({
          college: collegeId,
          branch: branchName,
          placementBlocked: false,
          isProfileCompleted: true,
        }),
      ]);

      return {
        _id: record._id,
        branchName: branchName,
        totalStudents,
        eligibleStudents,
        placedStudents: record.placedStudents ? record.placedStudents.length : 0,
      };
    })
  );

  return res
    .status(200)
    .json(new ApiResponse(200, enrichedRecords, "Placement records retrieved successfully"));
});

// GET /api/v1/placement-records/:branchId
export const getBranchPlacementDetails = asyncHandler(async (req, res) => {
  const { branchId } = req.params;
  const collegeId = req.user._id;

  const record = await BranchPlacementRecord.findOne({
    _id: branchId,
    college: collegeId,
  })
    .populate("branch", "name")
    .populate("placedStudents.student", "fullName rollNo email profileImage branch cgpa placementBlocked")
    .lean();

  if (!record) {
    throw new ApiError(404, "Branch placement record not found");
  }

  const branchName = record.branch?.name || "";

  // Compute dynamic counts for this specific branch
  const [totalStudents, eligibleStudents] = await Promise.all([
    Student.countDocuments({ college: collegeId, branch: branchName }),
    Student.countDocuments({
      college: collegeId,
      branch: branchName,
      placementBlocked: false,
      isProfileCompleted: true,
    }),
  ]);

  const enrichedRecord = {
    ...record,
    totalStudents,
    eligibleStudents,
    placedStudentsCount: record.placedStudents ? record.placedStudents.length : 0,
  };

  return res
    .status(200)
    .json(new ApiResponse(200, enrichedRecord, "Branch details retrieved successfully"));
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
