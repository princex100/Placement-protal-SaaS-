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
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: true,
      index: true,
    },
    placedStudents: [
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
