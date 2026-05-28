import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const studentSchema = new mongoose.Schema(
  {
    studentId: {
      type: String,
      unique: true,
      required: true,
      index: true
    },
    college: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
      required: true,
      index: true
    },
    // Personal Info
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    password: {
      type: String,
      required: true,
      select: false,
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
    // Academic Info
    branch: {
      type: String,
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
    // Skills / Profile
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
    // Placement Status
    placementStatus: {
      type: String,
      enum: ["unplaced", "placed", "internship"],
      default: "unplaced",
    },
    // Track applications by reference (optional, applications collection is better)
    appliedDrives: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PlacementDrive",
      },
    ],
    // Auth fields
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

// HASH PASSWORD BEFORE SAVE
studentSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// CHECK PASSWORD
studentSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// GENERATE ACCESS TOKEN
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

// GENERATE REFRESH TOKEN
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
