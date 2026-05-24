import mongoose from "mongoose";

const placementDriveSchema = new mongoose.Schema(
{
   title:{
      type:String,
      required:true,
      trim:true
   },

   role:{
      type:String,
      required:true,
      trim:true
   },

   company:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"Company",
      required:true
   },

   college:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"College",
      required:true
   },

   jobType:{
      type:String,
      enum:[
         "internship",
         "fulltime",
         "internship+fte"
      ],
      required:true
   },

   package:{
      type:Number,
      required:true
   },

   location:{
      type:String,
      trim:true
   },

   eligibleBranches:[
      {
         type:String
      }
   ],

   minimumCgpa:{
      type:Number,
      default:0
   },

   skillsRequired:[
      {
         type:String
      }
   ],

   description:{
      type:String
   },

   applicationDeadline:{
      type:Date,
      required:true
   },

   driveDate:{
      type:Date
   },

   status:{
      type:String,
      enum:[
         "open",
         "closed"
      ],
      default:"open"
   },

   totalApplicants:{
      type:Number,
      default:0
   },

   isActive:{
      type:Boolean,
      default:true
   }

   ,
  approvalStatus: {
   type: String,
   enum: ["pending", "approved", "rejected"],
   default: "pending"
},

approvedBy: {
   type: mongoose.Schema.Types.ObjectId,
   ref: "College"
}

},
{
   timestamps:true
}
);

const PlacementDrive = mongoose.model(
   "PlacementDrive",
   placementDriveSchema
);

export default PlacementDrive;