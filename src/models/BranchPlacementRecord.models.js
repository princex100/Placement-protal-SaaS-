import mongoose from "mongoose";

const branchPlacementRecordSchema = new mongoose.Schema(
  {
    college: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
      required: true,
      index: true,
    },
    branch: {
      type: String,
      required: true,
      index: true,
    },
    totalStudentsInCollege: {
      type: Number,
      default: 0,
    },
    totalStudentsInBranch: {
      type: Number,
      default: 0,
    },
    eligibleStudents: {
      type: Number,
      default: 0,
    },
    placedStudentsCount: {
      type: Number,
      default: 0,
    },
    students: [
      {
        student: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Student",
          required: true,
        },
        company: {
          type: String,
          required: true,
        },
        package: {
          type: Number,
          required: true,
        },
        packageDisplay: {
          type: String, // Optional human-readable format e.g., "10-12 LPA"
        },
      },
    ],
  },
  { timestamps: true }
);

// Compound index to ensure one record per branch per college
branchPlacementRecordSchema.index({ college: 1, branch: 1 }, { unique: true });

export const BranchPlacementRecord = mongoose.model(
  "BranchPlacementRecord",
  branchPlacementRecordSchema
);
