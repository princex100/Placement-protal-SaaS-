import jwt from "jsonwebtoken";

import Company from "../models/company.models.js";
import asyncHandler from "../utils/asynchandler.js";
import ApiError from "../utils/ApiError.js";

export const verifyCompanyJWT = asyncHandler(
  async (req, res, next) => {

    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")
        ?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(
        401,
        "Unauthorized request"
      );
    }

    try {
      const decodedToken =
        jwt.verify(
          token,
          process.env.ACCESS_TOKEN_SECRET
        );

      const company =
        await Company.findById(
          decodedToken?._id
        ).select(
          "-password -refreshToken"
        );

      if (!company) {
        throw new ApiError(
          401,
          "Invalid access token"
        );
      }

      if (company.isBlocked) {
        throw new ApiError(
          403,
          "Company account is blocked"
        );
      }

      req.company = company;

      next();

    } catch (error) {
      throw new ApiError(
        401,
        error?.message ||
          "Invalid access token"
      );
    }
  }
);