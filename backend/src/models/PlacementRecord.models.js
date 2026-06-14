import mongoose from "mongoose";

const placementRecordSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      index: true
    },
    college: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
      required: true,
      index: true
    },
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: true,
      index: true
    },
    company: {
      type: String,
      required: true
    },
    package: {
      type: Number,
      required: true
    },
    placementSeasonYear: {
      type: Number,
      required: true,
      index: true
    }
  },
  { timestamps: true }
);

// Compound index to prevent duplicate placement entries for the same student in the same season
placementRecordSchema.index({ student: 1, placementSeasonYear: 1 }, { unique: true });

export const PlacementRecord = mongoose.model(
  "PlacementRecord",
  placementRecordSchema
);

export default PlacementRecord;
