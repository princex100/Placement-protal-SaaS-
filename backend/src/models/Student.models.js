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
    // Personal Info
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
    // Academic Info
    branch: {
      type: String,
      // Required by default for student categorization? Let's make it optional if desired, but typically provided by college.
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
    placementBlocked: {
      type: Boolean,
      default: false,
    },
    // Track applications by reference (optional, applications collection is better)
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

// Compound Index: rollNo must be unique within a single college
studentSchema.index({ college: 1, rollNo: 1 }, { unique: true });

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
