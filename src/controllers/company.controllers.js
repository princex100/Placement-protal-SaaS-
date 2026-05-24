import jwt from "jsonwebtoken";

import Company from "../models/company.models.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asynchandler.js";
import College from "../models/College.models.js";
import PlacementDrive from "../models/placementDrive.models.js";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
};

///////////////////////////////////////////
// GENERATE TOKENS
///////////////////////////////////////////

const generateAccessAndRefreshTokens =
  async (companyId) => {
    try {
console.log(1);

      const company =
        await Company.findById(companyId);

      if (!company) {
        throw new ApiError(
          404,
          "Company not found"
        );
      }

      const accessToken =
        company.generateAccessToken();

      const refreshToken =
        company.generateRefreshToken();

      company.refreshToken =
        refreshToken;
console.log("done");
console.log(accessToken);

      await company.save({
        validateBeforeSave: false,
      });
console.log(2);


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
// REGISTER COMPANY
///////////////////////////////////////////

export const registerCompany =
  asyncHandler(async (req, res) => {
    const {
      companyId,
      name,
      email,
      password,
      industry,
      description,
      hrName,
      hrEmail,
    } = req.body;

    const logo =
      req.file?.path || "";

    if (
      !companyId ||
      !name ||
      !email ||
      !password
    ) {
      throw new ApiError(
        400,
        "Company id, name, email and password are required"
      );
    }

    const existingCompany =
      await Company.findOne({
        $or: [
          { companyId },
          { email },
        ],
      });

    if (existingCompany) {
      throw new ApiError(
        409,
        "Company already exists"
      );
    }

    const company =
      await Company.create({
        companyId,
        name,
        email,
        password,
        logo,
        industry,
        description,
        hrName,
        hrEmail,
      });

    const createdCompany =
      await Company.findById(
        company._id
      ).select(
        "-password -refreshToken"
      );

    return res.status(201).json(
      new ApiResponse(
        201,
        createdCompany,
        "Company registered successfully"
      )
    );
  });

///////////////////////////////////////////
// LOGIN COMPANY
///////////////////////////////////////////

export const loginCompany =
  asyncHandler(async (req, res) => {
    const {
      companyId,
      email,
      password,
    } = req.body;

    if (
      (!companyId && !email) ||
      !password
    ) {
      throw new ApiError(
        400,
        "Company id or email and password are required"
      );
    }

    const company =
      await Company.findOne({
        $or: [
          ...(companyId
            ? [{ companyId }]
            : []),

          ...(email
            ? [{ email }]
            : []),
        ],
      }).select(
        "+password +refreshToken"
      );

    if (!company) {
      throw new ApiError(
        404,
        "Company does not exist"
      );
    }

    if (company.isBlocked) {
      throw new ApiError(
        403,
        "Company account is blocked"
      );
    }

    const isPasswordCorrect =
      await company.isPasswordCorrect(
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
        company._id
      );

    const loggedInCompany =
      await Company.findById(
        company._id
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
            company:
              loggedInCompany,
            accessToken,
          },
          "Company logged in successfully"
        )
      );
  });

///////////////////////////////////////////
// LOGOUT COMPANY
///////////////////////////////////////////

export const logoutCompany =
  asyncHandler(async (req, res) => {
    await Company.findByIdAndUpdate(
      req.company._id,
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
          "Company logged out successfully"
        )
      );
  });

///////////////////////////////////////////
// GET CURRENT COMPANY
///////////////////////////////////////////

export const getCurrentCompany =
  asyncHandler(async (req, res) => {
    const company =
      await Company.findById(
        req.company._id
      ).select(
        "-password -refreshToken"
      );

    return res.status(200).json(
      new ApiResponse(
        200,
        company,
        "Current company fetched successfully"
      )
    );
  });

///////////////////////////////////////////
// REFRESH ACCESS TOKEN
///////////////////////////////////////////

export const refreshCompanyAccessToken =
  asyncHandler(async (req, res) => {
    const incomingRefreshToken =
      req.cookies?.refreshToken ||
      req.body.refreshToken;

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

      const company =
        await Company.findById(
          decodedToken?._id
        ).select(
          "+refreshToken"
        );

      if (!company) {
        throw new ApiError(
          401,
          "Invalid refresh token"
        );
      }

      if (
        incomingRefreshToken !==
        company.refreshToken
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
          company._id
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


  /////////////

  export const getAllColleges =
  asyncHandler(async (req, res) => {

    const colleges =
      await College.find()
        .select(
          "collegeId name logo address"
        );

    return res.status(200).json(
      new ApiResponse(
        200,
        colleges,
        "Colleges fetched successfully"
      )
    );
  });


  export const createDrive =
  asyncHandler(async (req, res) => {

    const { collegeId } =
      req.params;

    const {
      title,
      role,
      jobType,
      package: drivePackage,
      location,
      eligibleBranches,
      minimumCgpa,
      skillsRequired,
      description,
      applicationDeadline,
      driveDate,
    } = req.body;

    if (
      !title ||
      !role ||
      !jobType ||
      !drivePackage ||
      !applicationDeadline
    ) {
      throw new ApiError(
        400,
        "Required drive fields are missing"
      );
    }

  const college =
  await College.findOne({
    collegeId
  });
    if (!college) {
      throw new ApiError(
        404,
        "College not found"
      );
    }

    const eligibleBranchesArray =
      eligibleBranches
        ?.split(",")
        .map(branch =>
          branch.trim()
        );

    const skillsRequiredArray =
      skillsRequired
        ?.split(",")
        .map(skill =>
          skill.trim()
        );

    const drive =
      await PlacementDrive.create({
        title,
        role,
        company:
          req.company._id,
        college:
          college._id,
        jobType,
        package:
          drivePackage,
        location,

        eligibleBranches:
          eligibleBranchesArray,

        minimumCgpa,

        skillsRequired:
          skillsRequiredArray,

        description,
        applicationDeadline,
        driveDate,

        approvalStatus:
          "pending",
      });

    const createdDrive =
      await PlacementDrive.findById(
        drive._id
      )
        .populate(
          "company",
          "name logo"
        )
        .populate(
          "college",
          "name collegeId"
        );

    return res.status(201).json(
      new ApiResponse(
        201,
        createdDrive,
        "Drive created and sent for approval"
      )
    );
  });
/////////////////////


  export const getCompanyDrives =
  asyncHandler(async (req, res) => {

    const drives =
      await PlacementDrive.find({
        company:
          req.company._id,
      })
        .populate(
          "college",
          "name collegeId logo"
        )
        .sort({
          createdAt: -1,
        });

    return res.status(200).json(
      new ApiResponse(
        200,
        drives,
        "Company drives fetched successfully"
      )
    );
  });


/////////////////////////////


  export const getDriveById =
  asyncHandler(async (req, res) => {

    const { driveId } =
      req.params;

    const drive =
      await PlacementDrive.findOne({
        _id: driveId,
        company:
          req.company._id,
      })
        .populate(
          "company",
          "name logo"
        )
        .populate(
          "college",
          "name collegeId"
        );

    if (!drive) {
      throw new ApiError(
        404,
        "Drive not found"
      );
    }

    return res.status(200).json(
      new ApiResponse(
        200,
        drive,
        "Drive fetched successfully"
      )
    );
  });


//////////////////////////////////

  export const deleteDrive =
  asyncHandler(async (req, res) => {

    const { driveId } =
      req.params;

    const drive =
      await PlacementDrive.findOne({
        _id: driveId,
        company:
          req.company._id,
      });

    if (!drive) {
      throw new ApiError(
        404,
        "Drive not found"
      );
    }

    if (
      drive.approvalStatus !==
      "pending"
    ) {
      throw new ApiError(
        400,
        "Only pending drives can be deleted"
      );
    }

    await drive.deleteOne();

    return res.status(200).json(
      new ApiResponse(
        200,
        {},
        "Drive deleted successfully"
      )
    );
  });