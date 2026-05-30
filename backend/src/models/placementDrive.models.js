import mongoose from "mongoose";

const placementDriveSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
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
    jobType: {
      type: String,
      enum: ["internship", "fulltime", "internship+fte"],
      required: true,
    },
    mode: {
      type: String,
      enum: ["remote", "hybrid", "on-site"],
      default: "on-site"
    },
    package: {
      type: Number,
      required: true,
    },
    location: {
      type: String,
      trim: true,
    },
    // Eligibility
    eligibleBranches: [
      {
        type: String,
      },
    ],
    minimumCgpa: {
      type: Number,
      default: 0,
    },
    passingYearsAllowed: [
      {
        type: Number
      }
    ],
    backlogAllowed: {
      type: Number,
      default: 0
    },
    // Extra details
    skillsRequired: [
      {
        type: String,
      },
    ],
    description: {
      type: String,
    },
    responsibilities: {
      type: String
    },
    // Timeline
    applicationDeadline: {
      type: Date,
      required: true,
    },
    driveDate: {
      type: Date,
    },
    // Status
    status: {
      type: String,
      enum: ["open", "closed"],
      default: "open",
    },
    totalApplicants: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Compound index for dashboard queries
placementDriveSchema.index({ college: 1, status: 1 });

const PlacementDrive = mongoose.model("PlacementDrive", placementDriveSchema);

export default PlacementDrive;