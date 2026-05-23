import mongoose from "mongoose";
import jwt from "jsonwebtoken";

import Student from "../models/Student.models.js";
import College from "../models/College.models.js";
import PlacementDrive from "../models/placementDrive.models.js";
import Application from "../models/application.models.js";

import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import uploadOnCloudinary from "../utils/cloudinary.js";




// GENERATE TOKENS

const generateAccessAndRefreshTokens =
async (studentId)=>{

   try {

      const student =
      await Student.findById(studentId);

      const accessToken =
      student.generateAccessToken();

      const refreshToken =
      student.generateRefreshToken();

      student.refreshToken=refreshToken;

      await student.save({
         validateBeforeSave:false
      });

      return {
         accessToken,
         refreshToken
      };

   } catch (error) {

      throw new ApiError(
         500,
         "Something went wrong while generating tokens"
      );

   }

};






// LOGIN STUDENT

export const loginStudent = asyncHandler(
async (req,res)=>{

   const {
      collegeId,
      studentId,
      password
   } = req.body;



   // VALIDATION

   if(
      !collegeId ||
      !studentId ||
      !password
   ){

      throw new ApiError(
         400,
         "All fields are required"
      );

   }



   // FIND COLLEGE

   const college =
   await College.findOne({
      collegeId
   });



   if(!college){

      throw new ApiError(
         404,
         "College does not exist"
      );

   }



   // FIND STUDENT INSIDE COLLEGE

   const student =
   await Student.findOne({

      studentId,
      college:college._id

   }).select("+password +refreshToken");



   if(!student){

      throw new ApiError(
         404,
         "Student does not exist"
      );

   }



   // CHECK PASSWORD

   const isPasswordCorrect =
   await student.isPasswordCorrect(
      password
   );



   if(!isPasswordCorrect){

      throw new ApiError(
         401,
         "Invalid credentials"
      );

   }



   // GENERATE TOKENS

   const {
      accessToken,
      refreshToken
   } = await generateAccessAndRefreshTokens(
      student._id
   );



   // FETCH LOGGED IN STUDENT

   const loggedInStudent =
   await Student.findById(student._id)

   .select(
      "-password -refreshToken"
   )

   .populate(
      "college",
      "name collegeId logo"
   );



   // COOKIE OPTIONS

   const options={

      httpOnly:true,
      secure:true

   };



   return res

   .status(200)

   .cookie(
      "accessToken",
      accessToken,
      options
   )

   .cookie(
      "refreshToken",
      refreshToken,
      options
   )

   .json(

      new ApiResponse(

         200,

         {
            student:loggedInStudent,
            accessToken,
            refreshToken
         },

         "Student logged in successfully"

      )

   );

}
);



export const refreshAccessToken =
asyncHandler(
async (req,res)=>{

   // GET INCOMING REFRESH TOKEN

   const incomingRefreshToken =

   req.cookies?.refreshToken ||

   req.body.refreshToken;



   // VALIDATION

   if(!incomingRefreshToken){

      throw new ApiError(
         401,
         "Unauthorized request"
      );

   }



   try {

      // VERIFY TOKEN

      const decodedToken =
      jwt.verify(

         incomingRefreshToken,

         process.env
         .REFRESH_TOKEN_SECRET

      );



      // FIND STUDENT

      const student =
      await Student.findById(
         decodedToken?._id
      )

      .select("+refreshToken");



      if(!student){

         throw new ApiError(
            401,
            "Invalid refresh token"
         );

      }



      // COMPARE TOKENS

      if(
         incomingRefreshToken
         !==
         student.refreshToken
      ){

         throw new ApiError(
            401,
            "Refresh token expired or used"
         );

      }



      // GENERATE NEW TOKENS

      const {

         accessToken,

         refreshToken

      } = await
      generateAccessAndRefreshTokens(
         student._id
      );



      // COOKIE OPTIONS

      const options = {

         httpOnly:true,
         secure:true

      };



      // RESPONSE

      return res

      .status(200)

      .cookie(
         "accessToken",
         accessToken,
         options
      )

      .cookie(
         "refreshToken",
         refreshToken,
         options
      )

      .json(

         new ApiResponse(

            200,

            {
               accessToken,
               refreshToken
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

}
);








// LOGOUT STUDENT

export const logoutStudent = asyncHandler(
async (req,res)=>{

   await Student.findByIdAndUpdate(

      req.user._id,

      {
         $unset:{
            refreshToken:1
         }
      },

      {
         new:true
      }

   );



   const options={

      httpOnly:true,
      secure:true

   };



   return res

   .status(200)

   .clearCookie(
      "accessToken",
      options
   )

   .clearCookie(
      "refreshToken",
      options
   )

   .json(

      new ApiResponse(
         200,
         {},
         "Student logged out successfully"
      )

   );

}
);








// GET CURRENT STUDENT

export const getCurrentStudent =
asyncHandler(
async (req,res)=>{

   const student =
   await Student.findById(
      req.user._id
   )

   .select("-password -refreshToken")

   .populate(
      "college",
      "name collegeId logo"
   );



   return res.status(200).json(

      new ApiResponse(
         200,
         student,
         "Current student fetched successfully"
      )

   );

}
);








// UPDATE STUDENT PROFILE

export const updateStudentProfile =
asyncHandler(
async (req,res)=>{

   const {
     
      github,
      linkedin,
      portfolio,
      phoneNumber,
      skills,
     
   } = req.body;



   const updatedStudent =
   await Student.findByIdAndUpdate(

      req.user._id,

      {
         $set:{
          
            github,
            linkedin,
            portfolio,
            phoneNumber,
            skills,
          
         }
      },

      {
         new:true
      }

   ).select("-password -refreshToken");



   return res.status(200).json(

      new ApiResponse(
         200,
         updatedStudent,
         "Profile updated successfully"
      )

   );

}
);








// UPDATE RESUME


export const updateResume =
asyncHandler(
async (req,res)=>{

   // GET LOCAL FILE PATH

   const resumeLocalPath =
   req.file?.path;



   // VALIDATION

   if(!resumeLocalPath){

      throw new ApiError(
         400,
         "Resume file is required"
      );

   }



   // UPLOAD ON CLOUDINARY

   const uploadedResume =
   await uploadOnCloudinary(
      resumeLocalPath
   );



   if(!uploadedResume){

      throw new ApiError(
         500,
         "Error while uploading resume"
      );

   }



   // UPDATE STUDENT

   const updatedStudent =
   await Student.findByIdAndUpdate(

      req.user._id,

      {
         $set:{
            resume:uploadedResume.url
         }
      },

      {
         new:true
      }

   ).select(
      "-password -refreshToken"
   );



   return res.status(200).json(

      new ApiResponse(
         200,
         updatedStudent,
         "Resume updated successfully"
      )

   );

}
);


////////////////
export const getAllDrives =
asyncHandler(
async (req,res)=>{

   // FETCH DRIVES OF
   // LOGGED IN STUDENT'S COLLEGE

   const drives =
   await PlacementDrive.find({

      college:req.student.college,

      status:"open",

      isActive:true

   })

   .populate(
      "company",
      "name logo industry"
   )

   .sort({
      createdAt:-1
   });



   return res.status(200).json(

      new ApiResponse(

         200,

         drives,

         "Drives fetched successfully"

      )

   );

}
);

////////////////




export const applyToDrive = asyncHandler(async (req, res) => {
  const { driveId } = req.params;

  // VALIDATE DRIVE ID
  if (!mongoose.Types.ObjectId.isValid(driveId)) {
    throw new ApiError(400, "Invalid drive id");
  }

  // GET LOGGED IN STUDENT
  const student = await Student.findById(req.student?._id);

  if (!student) {
    throw new ApiError(404, "Student not found");
  }

  // FIND DRIVE
  const drive = await PlacementDrive.findById(driveId)
    .populate("company", "name logo");

  if (!drive) {
    throw new ApiError(404, "Drive not found");
  }

  // CHECK DRIVE STATUS
  if (!drive.isActive || drive.status !== "open") {
    throw new ApiError(400, "This drive is closed");
  }

  // CHECK SAME COLLEGE
  if (
    drive.college.toString() !==
    student.college.toString()
  ) {
    throw new ApiError(
      403,
      "You are not eligible for this drive"
    );
  }

  // CHECK ALREADY APPLIED
  const alreadyApplied = await Application.findOne({
    student: student._id,
    drive: drive._id,
  });

  if (alreadyApplied) {
    throw new ApiError(
      400,
      "You have already applied to this drive"
    );
  }

  // ELIGIBILITY CHECKS

  // CGPA CHECK
  if (student.cgpa < drive.minimumCgpa) {
    throw new ApiError(
      400,
      `Minimum CGPA required is ${drive.minimumCgpa}`
    );
  }

  // BRANCH CHECK
  const isEligibleBranch =
    drive.eligibleBranches.includes(student.branch);

  if (!isEligibleBranch) {
    throw new ApiError(
      400,
      "Your branch is not eligible for this drive"
    );
  }

  // OPTIONAL YEAR CHECK
  if (
    drive.eligibleYear &&
    student.year !== drive.eligibleYear
  ) {
    throw new ApiError(
      400,
      "You are not eligible based on year"
    );
  }

  // CREATE APPLICATION
  const application = await Application.create({
    student: student._id,
    drive: drive._id,

    status: "applied",

    studentDetails: {
      fullName: student.fullName,
      email: student.email,
      phoneNumber: student.phoneNumber,
      cgpa: student.cgpa,
      branch: student.branch,
      year: student.year,
      resume: student.resume,
      github: student.github,
      linkedin: student.linkedin,
      portfolio: student.portfolio,
      skills: student.skills,
    },
  });

  // INCREMENT APPLICANT COUNT
  await PlacementDrive.findByIdAndUpdate(
    driveId,
    {
      $inc: {
        totalApplicants: 1,
      },
    }
  );

  return res.status(201).json(
    new ApiResponse(
      201,
      application,
      "Applied successfully"
    )
  );
})




////////////////

export const getMyApplications = asyncHandler(
  async (req, res) => {

    const applications = await Application.find({
      student: req.student._id,
    })
      .populate({
        path: "drive",
        select:
          "title role package location jobType applicationDeadline status company",
        populate: {
          path: "company",
          select: "name logo",
        },
      })
      .sort({ createdAt: -1 });

    return res.status(200).json(
      new ApiResponse(
        200,
        applications,
        "Applications fetched successfully"
      )
    );
  }
);

////////////////

export const getDriveById = asyncHandler(
  async (req, res) => {
    const { driveId } = req.params;

    // VALIDATE DRIVE ID
    if (!mongoose.Types.ObjectId.isValid(driveId)) {
      throw new ApiError(400, "Invalid drive id");
    }

    // FIND DRIVE
    const drive = await PlacementDrive.findById(driveId)
      .populate("company", "name logo website industry description");

    // DRIVE EXISTS?
    if (!drive) {
      throw new ApiError(404, "Drive not found");
    }

    // OPTIONAL CHECK
    if (!drive.isActive) {
      throw new ApiError(
        400,
        "This drive is no longer active"
      );
    }

    // SAME COLLEGE CHECK
    if (
      drive.college.toString() !==
      req.student.college.toString()
    ) {
      throw new ApiError(
        403,
        "You are not authorized to view this drive"
      );
    }

    // SEND RESPONSE
    return res.status(200).json(
      new ApiResponse(
        200,
        drive,
        "Drive fetched successfully"
      )
    );
  }
);
