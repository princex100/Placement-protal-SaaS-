import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const studentSchema = new mongoose.Schema(
   {
    rollNo: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    college: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
      required: true,
      index: true
     },
    placementSeasonYear: {
      type: Number,
      required: true,
      index: true
    },
    isProfileCompleted: {
      type: Boolean,
      default: false
     },
    fullName: {
      type: String,
       required: true,
    },
    email: {
     type: String,
      // Optional initially, unique if provided
      sparse: true,
      unique: true
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    mustChangePassword: {
     type: Boolean,
     default: false,
    },
    phoneNumber: {
      type: String,
    },
    gender: {
      type: String,
     enum: ["Male", "Female", "Other", "Prefer not to say"]
    },
    profileImage: {
      type: String
    },
    branch: { 
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
       required: true,
     },
    cgpa: {
     type: Number,
      default: 0,
      min: 0,
      max: 10
    },
    passingYear: {
      type: Number,
     required: true
   },
    semester: {
      type: Number,
     required: true
    },
    backlogCount: {
      type: Number,
      default: 0,
      min: 0
    },
    skills: [String],
    projects: [
      {
        title: String,
        description: String,
        link: String
      }
   ],
    resume: {
      type: String,
    },
    github: {
      type: String,
    },
   linkedin: {
      type: String,
    },
     portfolio: {
      type: String,
    },
    placementStatus: {
      type: String,
      enum: ["unplaced", "placed", "internship"],
      default: "unplaced",
    },
    placementBlocked: {
      type: Boolean,
      default: false,
    },
    appliedDrives: [
      {
        type: mongoose.Schema.Types.ObjectId,
       ref: "PlacementDrive",
      },
    ],
   // Auth fields
    accessToken: {
      type: String,
      select: false,
   },
    accessTokenExpiry: {
      type: Date,
    },
    refreshToken: {
      type: String,
      select: false,
    },
    role: {
      type: String,
      default: "student"
    }
 },
  { timestamps: true }
);

studentSchema.index({ college: 1, rollNo: 1 }, { unique: true });

studentSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }
  this.password = await bcrypt.hash(this.password, 10);
});

studentSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

studentSchema.methods.generateAccessToken = function () {
 return jwt.sign(
    {
      _id: this._id,
     role: "student",
      college: this.college,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

studentSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
   },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
   }
  );
};

const Student = mongoose.model("Student", studentSchema);

export default Student;
