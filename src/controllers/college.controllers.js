import jwt from "jsonwebtoken";

import College from "../models/College.models.js";
import PlacementDrive from "../models/placementDrive.models.js";
import Student from "../models/Student.models.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

const cookieOptions = {
  httpOnly: true,
};

const generateAccessAndRefreshTokens = async (
  collegeId
) => {
  try {
    const college =
      await College.findById(collegeId);

    if (!college) {
      throw new ApiError(
        404,
        "College not found"
      );
    }

    const accessToken =
      college.generateAccessToken();

    const refreshToken =
      college.generateRefreshToken();

    college.refreshToken =
      refreshToken;

    await college.save({
      validateBeforeSave: false,
    });

    return {
      accessToken,
      refreshToken,
    };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating tokens"
    );
  }
};

///////////////////////////////////////////

export const registerCollege =
  asyncHandler(async (req, res) => {
    const {
      collegeId,
      name,
      email,
      password,
      address,
      phoneNumber,
    } = req.body || {};

    if (
      !collegeId ||
      !name ||
      !email ||
      !password
    ) {
      throw new ApiError(
        400,
        "College id, name, email and password are required"
      );
    }

    const existingCollege =
      await College.findOne({
        $or: [
          { collegeId },
          { email },
        ],
      });

    if (existingCollege) {
      throw new ApiError(
        409,
        "College with this id or email already exists"
      );
    }

    const college =
      await College.create({
        collegeId,
        name,
        email,
        password,
        address,
        phoneNumber,
        logo: req.file?.path,
      });

    const createdCollege =
      await College.findById(
        college._id
      ).select(
        "-password -refreshToken"
      );

    return res.status(201).json(
      new ApiResponse(
        201,
        createdCollege,
        "College registered successfully"
      )
    );
  });

///////////////////////////////////////////

export const loginCollege =
  asyncHandler(async (req, res) => {
    const {
      collegeId,
      email,
      password,
    } = req.body || {};

    if (
      (!collegeId && !email) ||
      !password
    ) {
      throw new ApiError(
        400,
        "College id or email and password are required"
      );
    }

    const college =
      await College.findOne({
        $or: [
          ...(collegeId
            ? [{ collegeId }]
            : []),
          ...(email
            ? [{ email }]
            : []),
        ],
      }).select(
        "+password +refreshToken"
      );

    if (!college) {
      throw new ApiError(
        404,
        "College does not exist"
      );
    }

    if (college.isBlocked) {
      throw new ApiError(
        403,
        "College account is blocked"
      );
    }

    const isPasswordCorrect =
      await college.isPasswordCorrect(
        password
      );

    if (!isPasswordCorrect) {
      throw new ApiError(
        401,
        "Invalid credentials"
      );
    }

    const {
      accessToken,
      refreshToken,
    } =
      await generateAccessAndRefreshTokens(
        college._id
      );

    const loggedInCollege =
      await College.findById(
        college._id
      ).select(
        "-password -refreshToken"
      );

    return res
      .status(200)
      .cookie(
        "accessToken",
        accessToken,
        cookieOptions
      )
      .cookie(
        "refreshToken",
        refreshToken,
        cookieOptions
      )
      .json(
        new ApiResponse(
          200,
          {
            college:
              loggedInCollege,
            accessToken,
          },
          "College logged in successfully"
        )
      );
  });

///////////////////////////////////////////

export const logoutCollege =
  asyncHandler(async (req, res) => {
    await College.findByIdAndUpdate(
      req.college._id,
      {
        $unset: {
          refreshToken: 1,
        },
      },
      {
        new: true,
      }
    );

    return res
      .status(200)
      .clearCookie(
        "accessToken",
        cookieOptions
      )
      .clearCookie(
        "refreshToken",
        cookieOptions
      )
      .json(
        new ApiResponse(
          200,
          {},
          "College logged out successfully"
        )
      );
  });

///////////////////////////////////////////

export const getCurrentCollege =
  asyncHandler(async (req, res) => {
    const college =
      await College.findById(
        req.college._id
      ).select(
        "-password -refreshToken"
      );

    return res.status(200).json(
      new ApiResponse(
        200,
        college,
        "Current college fetched successfully"
      )
    );
  });

///////////////////////////////////////////

export const refreshCollegeAccessToken =
  asyncHandler(async (req, res) => {
    const incomingRefreshToken =
      req.cookies?.refreshToken ||
      req.body?.refreshToken;

    if (!incomingRefreshToken) {
      throw new ApiError(
        401,
        "Unauthorized request"
      );
    }

    try {
      const decodedToken =
        jwt.verify(
          incomingRefreshToken,
          process.env
            .REFRESH_TOKEN_SECRET
        );

      const college =
        await College.findById(
          decodedToken?._id
        ).select("+refreshToken");

      if (!college) {
        throw new ApiError(
          401,
          "Invalid refresh token"
        );
      }

      if (
        incomingRefreshToken !==
        college.refreshToken
      ) {
        throw new ApiError(
          401,
          "Refresh token expired or used"
        );
      }

      const {
        accessToken,
        refreshToken,
      } =
        await generateAccessAndRefreshTokens(
          college._id
        );

      return res
        .status(200)
        .cookie(
          "accessToken",
          accessToken,
          cookieOptions
        )
        .cookie(
          "refreshToken",
          refreshToken,
          cookieOptions
        )
        .json(
          new ApiResponse(
            200,
            {
              accessToken,
            },
            "Access token refreshed successfully"
          )
        );
    } catch (error) {
      throw new ApiError(
        401,
        error?.message ||
          "Invalid refresh token"
      );
    }
  });


//////////////////////

export const addStudent = asyncHandler(
  async (req, res) => {

    const {
      studentId,
      fullName,
      email,
      password,
      branch,
      year,
      cgpa,
      skills,
      phoneNumber,
      github,
      linkedin,
      portfolio
    } = req.body || {};

    // REQUIRED FIELDS
    if (
      !studentId ||
      !fullName ||
      !email ||
      !password ||
      !branch ||
      !year
    ) {
      throw new ApiError(
        400,
        "Student id, full name, email, password, branch and year are required"
      );
    }

    // CHECK IF STUDENT EXISTS
    const existingStudent =
      await Student.findOne({
        $or: [
          { studentId },
          { email }
        ]
      });

    if (existingStudent) {
      throw new ApiError(
        409,
        "Student with this id or email already exists"
      );
    }

    // CREATE STUDENT
    const student =
      await Student.create({
        studentId,
        college: req.college._id, // auto attach college
        fullName,
        email,
        password,
        branch,
        year,
        cgpa,
        skills,
        phoneNumber,
        github,
        linkedin,
        portfolio
      });

    // OPTIONAL COUNT UPDATE
    await req.college.updateOne({
      $inc: {
        studentsCount: 1
      }
    });

    const createdStudent =
      await Student.findById(student._id)
        .select("-password -refreshToken");

    return res.status(201).json(
      new ApiResponse(
        201,
        createdStudent,
        "Student added successfully"
      )
    );
  }
);

///////////////////////////////////////////

///////////////////////////////////////////
// DASHBOARD STATS CONTROLLER
///////////////////////////////////////////

export const getCollegeDashboardStats = asyncHandler(async (req, res) => {
  const collegeId = req.college._id;
  const studentsCount = req.college.studentsCount || 0;

  // RUN ALL QUERIES IN PARALLEL FOR SPEED
  const [
    linkedStudents,
    placedStudents,
    pendingApprovals,
    uniqueCompanies
  ] = await Promise.all([
    // 1. TOTAL STUDENTS
    Student.countDocuments({
      college: collegeId
    }),

    // 2. PLACED STUDENTS
    Student.countDocuments({
      college: collegeId,
      placementStatus: "placed",
    }),

    // 3. PENDING DRIVES
    PlacementDrive.countDocuments({
      college: collegeId,
      approvalStatus: "pending",
    }),

    // 4. UNIQUE PARTNER COMPANIES
    PlacementDrive.distinct(
      "company",
      {
        college: collegeId,
        approvalStatus: "approved",
      }
    )
  ]);

  const totalStudents = Math.max(
    linkedStudents,
    studentsCount
  );

  // CALCULATE PLACEMENT RATE
  const placementRate = totalStudents > 0
    ? Math.round((placedStudents / totalStudents) * 100)
    : 0;

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        totalStudents,
        pendingApprovals,
        partnerCompanies: uniqueCompanies.length,
        placementRate
      },
      "Dashboard stats fetched successfully"
    )
  );
});

///////////////////////////////////////////
// INCOMING DRIVES CONTROLLER
///////////////////////////////////////////

export const getIncomingDrives = asyncHandler(async (req, res) => {
  const collegeId = req.college._id;

  const incomingDrives = await PlacementDrive.find({
    college: collegeId,
    approvalStatus: "pending",
  })
    .populate(
      "company", // This assumes your Drive model references the Company model via 'company'
      "name logo"
    )
    .sort({
      createdAt: -1 // Newest first
    })
    .limit(5); // Only fetch top 5 for the dashboard

  return res.status(200).json(
    new ApiResponse(
      200,
      incomingDrives,
      "Incoming drives fetched successfully"
    )
  );
});
