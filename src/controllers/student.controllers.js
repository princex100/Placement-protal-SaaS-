import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import Student from "../models/Student.models.js";
import College from "../models/College.models.js";
import PlacementDrive from "../models/placementDrive.models.js";
import Application from "../models/application.models.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

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
    cgpa
  });

  await College.findByIdAndUpdate(college._id, {
    $inc: { studentsCount: 1 }
  });

  const createdStudent = await Student.findById(student._id).select("-password -refreshToken");

  return res.status(201).json(new ApiResponse(201, createdStudent, "Student registered successfully"));
});

export const loginStudent = asyncHandler(async (req, res) => {
  const { email, password } = req.body || {};

  const student = await Student.findOne({ email }).select("+password +refreshToken");

  if (!student) throw new ApiError(404, "Student does not exist");

  const isPasswordCorrect = await student.isPasswordCorrect(password);
  if (!isPasswordCorrect) throw new ApiError(401, "Invalid credentials");

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(student._id);

  const loggedInStudent = await Student.findById(student._id).select("-password -refreshToken");

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
  const student = await Student.findById(req.student._id).select("-password -refreshToken");
  return res.status(200).json(new ApiResponse(200, student, "Current student fetched successfully"));
});

export const updateStudentProfile = asyncHandler(async (req, res) => {
  const updates = req.body;
  
  const student = await Student.findByIdAndUpdate(
    req.student._id,
    { $set: updates },
    { new: true, runValidators: true }
  ).select("-password -refreshToken");

  return res.status(200).json(new ApiResponse(200, student, "Profile updated successfully"));
});

export const uploadResume = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "Resume file is required");
  }

  const student = await Student.findByIdAndUpdate(
    req.student._id,
    { $set: { resume: req.file.path } },
    { new: true }
  ).select("-password -refreshToken");

  return res.status(200).json(new ApiResponse(200, student, "Resume uploaded successfully"));
});
