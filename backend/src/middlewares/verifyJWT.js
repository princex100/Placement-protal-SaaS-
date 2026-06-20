import jwt from "jsonwebtoken";

import Student from "../models/Student.models.js";
import College from "../models/College.models.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";

export const verifyJWT = asyncHandler(
async (req,res,next)=>{
   try {

      const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ","");

      if(!token){
         throw new ApiError(
            401,
            "Unauthorized request"
         );
      }

      const decodedToken =
      jwt.verify(
         token,
         process.env.ACCESS_TOKEN_SECRET
      );

      if(decodedToken?.role === "college-admin"){
         const college = await College.findById(decodedToken?._id).select("-password -refreshToken");
         if(!college) throw new ApiError(401, "Invalid access token");
         req.college = college;
         req.user = college;
         req.role = "college-admin";
         return next();
      }

      const student = await Student.findById(decodedToken?._id).select("-password -refreshToken");
      if(!student) throw new ApiError(401, "Invalid access token");
      req.student = student;
      req.user = student;
      req.role = "student";
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
