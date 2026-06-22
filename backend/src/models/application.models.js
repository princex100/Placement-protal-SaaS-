import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
       ref: "Student",
      required: true,
      index: true
    },
    drive: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PlacementDrive",
      required: true,
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
    applicationStatus: {
      type: String,
      enum: [
        "applied",
        "shortlisted",
        "interview_scheduled",
        "selected",
        "rejected",
      ],
      default: "applied",
      index: true
    },
    statusUpdatedAt: {
      type: Date,
    },
    statusUpdatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
    },
    appliedAt: {
      type: Date,
      default: Date.now,
     },
    resumeSnapshot: {
      type: String,
      required: true // Must snapshot the resume URL at the time of applying
    },
    remarks: {
      type: String,
    },
    interviewDetails: {
      interviewDate: String,
      interviewTime: String,
      venue: String,
      meetingLink: String
     }
  },
  {
    timestamps: true,
  }
);

applicationSchema.index(
  {
    student: 1,
    drive: 1,
 },
  {
    unique: true, // Prevent duplicate applications
  }
);

const Application = mongoose.model("Application", applicationSchema);

export default Application;