import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import Student from "../models/Student.models.js";
import College from "../models/College.models.js";
import PlacementDrive from "../models/placementDrive.models.js";
import Application from "../models/application.models.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import { calculateProfileCompletion } from "../utils/calculateProfileCompletion.js";
const cookieOptions = {
  httpOnly: true,
};

const generateAccessAndRefreshTokens = async (studentId) => {
  try {
    const student = await Student.findById(studentId);
    if (!student) throw new ApiError(404, "Student not found");

    const accessToken = student.generateAccessToken();
    const refreshToken = student.generateRefreshToken();

    student.refreshToken = refreshToken;
    await student.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating tokens");
  }
};

export const registerStudent = asyncHandler(async (req, res) => {
  const { studentId, collegeId, fullName, email, password, branch, passingYear, semester, cgpa } = req.body || {};

  const existingStudent = await Student.findOne({
    $or: [{ studentId }, { email }],
  });

  if (existingStudent) {
    throw new ApiError(409, "Student with this id or email already exists");
  }

  const college = await College.findById(collegeId);
  if (!college) {
    throw new ApiError(404, "College not found");
  }

  const student = await Student.create({
    studentId,
    college: college._id,
    fullName,
    email,
    password,
    branch,
    passingYear,
    semester,
    cgpa,
    placementSeasonYear: passingYear
  });

  await College.findByIdAndUpdate(college._id, {
    $inc: { studentsCount: 1 }
  });

  const createdStudent = await Student.findById(student._id).select("-password -refreshToken");

  return res.status(201).json(new ApiResponse(201, createdStudent, "Student registered successfully"));
});

export const loginStudent = asyncHandler(async (req, res) => {
  const { rollNo, password } = req.body || {};

  const student = await Student.findOne({ rollNo }).select("+password +refreshToken");

  if (!student) throw new ApiError(404, "Student does not exist");

  const isPasswordCorrect = await student.isPasswordCorrect(password);
  if (!isPasswordCorrect) throw new ApiError(401, "Invalid credentials");

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(student._id);

  const loggedInStudent = await Student.findById(student._id)
    .populate("college", "name")
    .select("-password -refreshToken");

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        { student: loggedInStudent, accessToken },
        "Student logged in successfully"
      )
    );
});

export const logoutStudent = asyncHandler(async (req, res) => {
  await Student.findByIdAndUpdate(
    req.student._id,
    { $unset: { refreshToken: 1 } },
    { new: true }
  );

  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, {}, "Student logged out successfully"));
});

export const getCurrentStudent = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.student._id)
    .populate("college", "name")
    .select("-password -refreshToken");
  return res.status(200).json(new ApiResponse(200, student, "Current student fetched successfully"));
});

export const updateStudentProfile = asyncHandler(async (req, res) => {
  // 1. Whitelist safe fields
  const allowedFields = [
    "email", "phoneNumber", "gender", "profileImage",
    "linkedin", "github", "portfolio", "resume",
    "skills", "projects"
  ];
  
  const updates = {};
  Object.keys(req.body).forEach(key => {
    if (allowedFields.includes(key)) {
      updates[key] = req.body[key];
    }
  });

  // 2. Fetch current student to calculate completion properly
  const currentStudent = await Student.findById(req.student._id);
  if (!currentStudent) {
    throw new ApiError(404, "Student not found");
  }

  // Merge updates to calculate completion
  const updatedData = { ...currentStudent.toObject(), ...updates };
  
  // 3. Profile completion logic
  const isProfileCompleted = Boolean(
    updatedData.phoneNumber &&
    updatedData.email &&
    updatedData.resume &&
    updatedData.linkedin &&
    updatedData.skills && updatedData.skills.length > 0
  );

  updates.isProfileCompleted = isProfileCompleted;
  
  const student = await Student.findByIdAndUpdate(
    req.student._id,
    { $set: updates },
    { new: true, runValidators: true }
  ).populate("college", "name").select("-password -refreshToken");

  return res.status(200).json(new ApiResponse(200, student, "Profile updated successfully"));
});

export const uploadResume = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "Resume file is required");
  }

  const cloudinaryResponse = await uploadOnCloudinary(req.file.path);
  const student = await Student.findByIdAndUpdate(
    req.student._id,
    { $set: { resume: cloudinaryResponse.secure_url || cloudinaryResponse.url } },
    { new: true }
  ).populate("college", "name").select("-password -refreshToken");

  return res.status(200).json(new ApiResponse(200, student, "Resume uploaded successfully"));
});

export const getStudentDashboardStats = asyncHandler(async (req, res) => {
  const student = req.student;
  const placementSeasonYear = student.placementSeasonYear;

  // We only import Application here if not already imported globally, but since it's just controller let's dynamically import to prevent cyclic dependency if any, or just import at top. Let's dynamically import for safety.
  const Application = (await import("../models/application.models.js")).default;
  const PlacementDrive = (await import("../models/placementDrive.models.js")).default;

  const [jobOffers, appliedDrives] = await Promise.all([
    Application.countDocuments({
      student: student._id,
      applicationStatus: "selected",
      placementSeasonYear
    }),
    Application.countDocuments({
      student: student._id,
      placementSeasonYear
    })
  ]);

  const profileCompletion = calculateProfileCompletion(student);

  return res.status(200).json(new ApiResponse(200, {
    jobOffers,
    appliedDrives,
    placementStatus: student.placementStatus,
    isProfileCompleted: student.isProfileCompleted,
    profileCompletion
  }, "Dashboard stats fetched successfully"));
});
