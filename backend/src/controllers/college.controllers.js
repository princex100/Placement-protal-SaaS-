import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import crypto from "crypto";
import College from "../models/College.models.js";
import PlacementDrive from "../models/placementDrive.models.js";
import Student from "../models/Student.models.js";
import Application from "../models/application.models.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { sendEmail, generateMailContent } from "../utils/sendEmail.js";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
};

const generateAccessAndRefreshTokens = async (collegeId) => {
   try {
    const college = await College.findById(collegeId);
    if (!college) throw new ApiError(404, "College not found");

     const accessToken = college.generateAccessToken();
    const refreshToken = college.generateRefreshToken();

    college.refreshToken = refreshToken;
    await college.save({ validateBeforeSave: false });

     return { accessToken, refreshToken };
  } catch (error) {
   throw new ApiError(500, "Something went wrong while generating tokens");
  }
};

export const registerCollege = asyncHandler(async (req, res) => {
  const { collegeId, name, email, password, address, phoneNumber } = req.body || {};

  const existingCollege = await College.findOne({
    $or: [{ collegeId }, { email }],
 });

  if (existingCollege) {
     throw new ApiError(409, "College with this id or email already exists");
 }

  const college = new College({
    collegeId,
    name,
     email,
    password,
    address,
    phoneNumber,
    logo: req.file?.path,
    isVerified: true, // Auto-verify since email is disabled
  });

  const unhashedToken = college.generateVerificationToken();
 await college.save();

  // DISABLED EMAIL SENDING FOR NOW
  /*
  try {
    const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
    const verificationLink = `${FRONTEND_URL}/verify-email/${unhashedToken}`;
     console.log("TEST VERIFICATION LINK:", verificationLink);

    const mailgenContent = generateMailContent({
      name: college.name,
      intro: "Welcome to PlacementPortal! We're very excited to have you on board.",
      action: {
       instructions: "To verify your email and activate your college account, please click here:",
        button: {
         color: "#4F46E5",
          text: "Verify your email",
          link: verificationLink,
        },
      },
      outro: "Need help, or have questions? Just reply to this email, we'd love to help.",
    });

    await sendEmail({
       email: college.email,
      subject: "Verify your email - PlacementPortal",
     mailgenContent,
    });
  } catch (error) {
    console.error("Failed to send verification email", error);
  }
  */

  const createdCollege = await College.findById(college._id).select("-password -refreshToken -emailVerificationToken");

  return res.status(201).json(new ApiResponse(201, createdCollege, "Account created successfully. You can now log in."));
});

export const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.params;

  if (!token) {
   throw new ApiError(400, "Verification token is missing");
  }

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const college = await College.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpiry: { $gt: Date.now() },
  });

  if (!college) {
    throw new ApiError(400, "Verification token is invalid or has expired");
  }

   college.isVerified = true;
  college.emailVerificationToken = undefined;
  college.emailVerificationExpiry = undefined;
   await college.save({ validateBeforeSave: false });

   const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(college._id);

  const loggedInCollege = await College.findById(college._id).select("-password -refreshToken");

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        { college: loggedInCollege, accessToken },
        "Email verified successfully"
      )
    );
});

export const loginCollege = asyncHandler(async (req, res) => {
 const { collegeId, email, password } = req.body || {};

  const college = await College.findOne({
     $or: [...(collegeId ? [{ collegeId }] : []), ...(email ? [{ email }] : [])],
  }).select("+password +refreshToken");

  if (!college) throw new ApiError(404, "College does not exist");
  if (college.isBlocked) throw new ApiError(403, "College account is blocked");
  if (!college.isVerified) throw new ApiError(403, "Please verify your email before logging in");

  const isPasswordCorrect = await college.isPasswordCorrect(password);
  if (!isPasswordCorrect) throw new ApiError(401, "Invalid credentials");

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(college._id);

  const loggedInCollege = await College.findById(college._id).select("-password -refreshToken");

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
   .json(
      new ApiResponse(
        200,
        { college: loggedInCollege, accessToken },
        "College logged in successfully"
      )
    );
});

export const logoutCollege = asyncHandler(async (req, res) => {
  await College.findByIdAndUpdate(
    req.college._id,
    { $unset: { refreshToken: 1 } },
    { new: true }
  );

  return res
    .status(200)
     .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, {}, "College logged out successfully"));
});

export const getCurrentCollege = asyncHandler(async (req, res) => {
  const college = await College.findById(req.college._id).select("-password -refreshToken");
  return res.status(200).json(new ApiResponse(200, college, "Current college fetched successfully"));
});

export const refreshCollegeAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
    const college = await College.findById(decodedToken?._id).select("+refreshToken");

    if (!college) throw new ApiError(401, "Invalid refresh token");
     if (incomingRefreshToken !== college.refreshToken) throw new ApiError(401, "Refresh token expired or used");

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(college._id);

    return res
       .status(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .json(new ApiResponse(200, { accessToken }, "Access token refreshed successfully"));
  } catch (error) {
   throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

export const updatePlacementSeason = asyncHandler(async (req, res) => {
   const { placementSeasonYear } = req.body;

  if (!placementSeasonYear || isNaN(placementSeasonYear)) {
     throw new ApiError(400, "Valid placement season year is required");
  }

  const college = await College.findByIdAndUpdate(
   req.college._id,
    { $set: { activePlacementSeason: Number(placementSeasonYear) } },
     { new: true, runValidators: true }
  ).select("-password -refreshToken");

  if (!college) {
    throw new ApiError(404, "College not found");
 }

  return res.status(200).json(
    new ApiResponse(200, college, "Placement season updated successfully")
  );
});

export const getCollegeDashboardStats = asyncHandler(async (req, res) => {
 const collegeId = req.college._id;
   const activeSeason = req.college.activePlacementSeason;

   const [
    totalStudents,
    allDrivesForSeason,
    placedStudents,
    totalApplications,
    activeDrives,
    latestDrives,
   unblockedStudents
  ] = await Promise.all([
    // 1. Total Registered Students
    Student.countDocuments({ college: collegeId, placementSeasonYear: activeSeason }),

     // 2. Eligible Students (Calculated via Set below)
    PlacementDrive.find({
       college: collegeId,
      placementSeasonYear: activeSeason
    }).select("students.student").lean(),

   Student.countDocuments({ 
      college: collegeId, 
     placementSeasonYear: activeSeason,
      placementStatus: { $in: ["placed"] } 
    }),

    Application.countDocuments({ college: collegeId, placementSeasonYear: activeSeason }),

    PlacementDrive.countDocuments({ 
      college: collegeId, 
      placementSeasonYear: activeSeason,
      status: "open", 
      isActive: true 
    }),

    PlacementDrive.find({ college: collegeId, placementSeasonYear: activeSeason })
      .select("companyName role package applicationDeadline status students")
      .sort({ createdAt: -1 })
      .limit(4)
      .lean(),

    Student.countDocuments({ 
       college: collegeId, 
      placementSeasonYear: activeSeason,
     placementBlocked: false 
    })
 ]);

   const eligibleStudentIds = new Set();
   allDrivesForSeason.forEach(drive => {
    drive.students?.forEach(studentObj => {
      if (studentObj.student) {
        eligibleStudentIds.add(studentObj.student.toString());
      }
    });
  });
  const eligibleStudents = eligibleStudentIds.size;

  const placementRate = totalStudents > 0 
    ? Math.round((placedStudents / totalStudents) * 100) 
    : 0;

  const mappedLatestDrives = latestDrives.map(drive => ({
    ...drive,
    appliedStudentsCount: drive.students ? drive.students.length : 0,
    students: undefined
  }));

  return res.status(200).json(new ApiResponse(200, {
    totalStudents,
    eligibleStudents,
     placedStudents,
    placementRate,
    totalApplications,
    activeDrives,
    latestDrives: mappedLatestDrives
  }, "Dashboard stats fetched successfully"));
});

