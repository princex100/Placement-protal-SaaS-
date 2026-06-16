// import { BranchPlacementRecord } from "../models/BranchPlacementRecord.models.js";
import PlacementRecord from "../models/PlacementRecord.models.js";
import Student from "../models/Student.models.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import Branch from "../models/branch.models.js";

// GET /api/v1/placement-records
export const getPlacementOverview = asyncHandler(async (req, res) => {
  const collegeId = req.user._id;

  // Find all branch records for this college and populate branch name
  const records = await PlacementRecord.find({ 
    college: collegeId,
    placementSeasonYear: req.user.activePlacementSeason
  })
    .populate("branch", "name")
    .lean();

  // Dynamically calculate counts using Promise.all for speed
  const enrichedRecords = await Promise.all(
    records.map(async (record) => {
      // The branch.name is the string inside the branch doc
      const branchName = record.branch?.name || "";

      const [totalStudents, eligibleStudents, placedStudentsCount] = await Promise.all([
        Student.countDocuments({ 
          college: collegeId, 
          branch: branchName,
          placementSeasonYear: req.user.activePlacementSeason
        }),
        Student.countDocuments({
          college: collegeId,
          branch: branchName,
          placementSeasonYear: req.user.activePlacementSeason,
          placementBlocked: false,
        }),
        Student.countDocuments({
          college: collegeId,
          branch: branchName,
          placementSeasonYear: req.user.activePlacementSeason,
          placementStatus: { $in: ["placed", "internship"] }
        }),
      ]);

      return {
        _id: record._id,
        branchName: branchName,
        totalStudents,
        eligibleStudents,
        placedStudents: placedStudentsCount,
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
    placementSeasonYear: req.user.activePlacementSeason
  })
    .populate("branch", "name")
    .lean();

  if (!record) {
    throw new ApiError(404, "Branch placement record not found");
  }

  const branchName = record.branch?.name || "";

  // Fetch placement records directly from new collection
  const placementRecords = await PlacementRecord.find({
    college: collegeId,
    branch: branchId,
    placementSeasonYear: req.user.activePlacementSeason
  }).populate("student", "fullName rollNo email profileImage branch cgpa placementBlocked").lean();

  // Compute dynamic counts
  const [totalStudents, eligibleStudents, dynamicallyPlacedStudents] = await Promise.all([
    Student.countDocuments({ 
      college: collegeId, 
      branch: branchName,
      placementSeasonYear: req.user.activePlacementSeason
    }),
    Student.countDocuments({
      college: collegeId,
      branch: branchName,
      placementSeasonYear: req.user.activePlacementSeason,
      placementBlocked: false,
    }),
    Student.find({
      college: collegeId,
      branch: branchName,
      placementSeasonYear: req.user.activePlacementSeason,
      placementStatus: { $in: ["placed", "internship"] }
    }).select("fullName rollNo email profileImage branch cgpa placementBlocked").lean()
  ]);

  const formattedPlacedStudents = dynamicallyPlacedStudents.map(student => {
    // Look up existing placement details from PlacementRecord
    const existingDetail = placementRecords.find(
      pr => pr.student && pr.student._id.toString() === student._id.toString()
    );
    
    return {
      _id: existingDetail ? existingDetail._id : student._id,
      student: student,
      company: existingDetail?.company || "Manual / Off-Campus",
      package: existingDetail?.package || "N/A",
      packageDisplay: existingDetail?.package ? `${existingDetail.package} LPA` : "N/A",
    };
  });

  const enrichedRecord = {
    ...record,
    totalStudents,
    eligibleStudents,
    placedStudentsCount: dynamicallyPlacedStudents.length,
    placedStudents: formattedPlacedStudents
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

// PATCH /api/v1/placement-records/student/:studentId/update
export const updateStudentDetails = asyncHandler(async (req, res) => {
  const { studentId } = req.params;
  const collegeId = req.user._id;

  // Destructure to isolate editable fields
  const {
    fullName,
    phoneNumber,
    gender,
    rollNo,
    branch,
    cgpa,
    semester,
    passingYear,
    backlogCount,
    linkedin,
    github,
    portfolio,
    skills,
    projects
  } = req.body;

  // Build safe update object
  const updateData = {};
  if (fullName !== undefined) updateData.fullName = fullName;
  if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;
  if (gender !== undefined) updateData.gender = gender;
  if (rollNo !== undefined) updateData.rollNo = rollNo;
  if (branch !== undefined) updateData.branch = branch;
  if (cgpa !== undefined) updateData.cgpa = cgpa;
  if (semester !== undefined) updateData.semester = semester;
  if (passingYear !== undefined) updateData.passingYear = passingYear;
  if (backlogCount !== undefined) updateData.backlogCount = backlogCount;
  if (linkedin !== undefined) updateData.linkedin = linkedin;
  if (github !== undefined) updateData.github = github;
  if (portfolio !== undefined) updateData.portfolio = portfolio;
  if (skills !== undefined) updateData.skills = skills;
  if (projects !== undefined) updateData.projects = projects;

  const updatedStudent = await Student.findOneAndUpdate(
    { _id: studentId, college: collegeId },
    { $set: updateData },
    { new: true, runValidators: true }
  ).select("-password -refreshToken");

  if (!updatedStudent) {
    throw new ApiError(404, "Student not found or you are not authorized to update this student");
  }

  return res.status(200).json(
    new ApiResponse(200, updatedStudent, "Student details updated successfully")
  );
});

// PATCH /api/v1/placement-records/student/:studentId/placement-status
export const updatePlacementStatus = asyncHandler(async (req, res) => {
  const { studentId } = req.params;
  const collegeId = req.user._id;
  const { placementStatus } = req.body;

  if (!placementStatus || !["unplaced", "placed", "internship"].includes(placementStatus)) {
    throw new ApiError(400, "Invalid placement status provided");
  }

  const updatedStudent = await Student.findOneAndUpdate(
    { _id: studentId, college: collegeId },
    { $set: { placementStatus } },
    { new: true, runValidators: true }
  ).select("-password -refreshToken");

  if (!updatedStudent) {
    throw new ApiError(404, "Student not found or you are not authorized to update this student");
  }

  if (placementStatus === "placed" || placementStatus === "internship") {
    const branchDoc = await Branch.findOne({ 
      name: { $regex: new RegExp(`^${updatedStudent.branch}$`, "i") }, 
      college: collegeId 
    });
    
    if (branchDoc) {
      try {
        await PlacementRecord.create({
          student: updatedStudent._id,
          college: collegeId,
          branch: branchDoc._id,
          company: req.body.company || "Manual / Off-Campus",
          package: req.body.package || 0,
          placementSeasonYear: updatedStudent.placementSeasonYear
        });
      } catch (err) {
        console.warn("Manual PlacementRecord creation warning:", err.message);
      }
    }
  }

  return res.status(200).json(
    new ApiResponse(200, updatedStudent, "Placement status updated successfully")
  );
});
