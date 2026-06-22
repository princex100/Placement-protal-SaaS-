import Branch from "../models/branch.models.js";
import Student from "../models/Student.models.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

export const createBranch = asyncHandler(async (req, res) => {
  const collegeId = req.college._id;
   const { name } = req.body;

  if (!name || name.trim() === "") {
    throw new ApiError(400, "Branch name is required");
 }

  const existingBranch = await Branch.findOne({
    college: collegeId,
    name: { $regex: new RegExp(`^${name.trim()}$`, "i") },
  });

 if (existingBranch) {
    throw new ApiError(400, "Branch already exists");
   }

  const branch = await Branch.create({
    name: name.trim(),
     college: collegeId,
  });

 return res.status(201).json(new ApiResponse(201, branch, "Branch created successfully"));
});

// @desc    Get all branches for the logged-in college with student counts
export const getBranches = asyncHandler(async (req, res) => {
  const collegeId = req.college._id;

  const branches = await Branch.aggregate([
    { $match: { college: collegeId, isActive: true } },
    {
      $lookup: {
        from: "students", // MongoDB collection name for Student model
        let: { branchId: "$_id", collegeId: "$college" },
       pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$branch", "$$branchId"] },
                  { $eq: ["$college", "$$collegeId"] },
                  { $eq: ["$placementSeasonYear", req.college.activePlacementSeason] }
                 ]
              }
            }
          }
        ],
        as: "studentsList",
      },
    },
   {
     $addFields: {
        totalStudents: { $size: "$studentsList" },
     },
    },
    {
     $match: {
        totalStudents: { $gt: 0 } // Only return branches that have students for this season
      }
    },
   {
      $project: {
        studentsList: 0, // exclude array from output
      },
    },
    { $sort: { createdAt: -1 } },
  ]);

  return res.status(200).json(new ApiResponse(200, branches, "Branches fetched successfully"));
});

export const createStudent = asyncHandler(async (req, res) => {
 const collegeId = req.college._id;
  const { branchId } = req.params;
  const { fullName, rollNo, password, email, phone, cgpa, passingYear, semester } = req.body;

  const branch = await Branch.findOne({ _id: branchId, college: collegeId, isActive: true });
  if (!branch) {
    throw new ApiError(404, "Branch not found or unauthorized");
  }

  const existingStudent = await Student.findOne({ college: collegeId, rollNo });
  if (existingStudent) {
    throw new ApiError(400, "Student with this roll number already exists");
  }

  const student = await Student.create({
     fullName,
    rollNo,
    password, // Password will be hashed by pre-save hook
    email,
     phone,
    cgpa,
     passingYear,
    semester,
    branch: branch._id, // Save branch as ObjectId
    college: collegeId,
    placementSeasonYear: passingYear
  });

  const studentData = student.toObject();
  delete studentData.password;

  return res.status(201).json(new ApiResponse(201, studentData, "Student created successfully"));
});

export const getBranchStudents = asyncHandler(async (req, res) => {
  const collegeId = req.college._id;
  const { branchId } = req.params;
  
  const branch = await Branch.findOne({ _id: branchId, college: collegeId });
  if (!branch) {
    throw new ApiError(404, "Branch not found or unauthorized");
  }

 const page = parseInt(req.query.page) || 1;
 const limit = parseInt(req.query.limit) || 25;
  const skip = (page - 1) * limit;

  const filter = { 
     college: collegeId, 
   branch: branch._id,
    placementSeasonYear: req.college.activePlacementSeason
   };

  const [totalStudents, students] = await Promise.all([
    Student.countDocuments(filter),
    Student.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .select("fullName rollNo email cgpa placementStatus")
      .lean()
   ]);

  const totalPages = Math.ceil(totalStudents / limit);

  return res.status(200).json(new ApiResponse(200, {
    students,
   currentPage: page,
    totalPages: totalPages === 0 ? 1 : totalPages,
    totalStudents,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1
  }, "Students fetched successfully"));
});
