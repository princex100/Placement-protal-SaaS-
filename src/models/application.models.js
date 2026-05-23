import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
{
   student:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"Student",
      required:true
   },

   drive:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"PlacementDrive",
      required:true
   },

   status:{
      type:String,
      enum:[
         "applied",
         "shortlisted",
         "rejected",
         "selected"
      ],
      default:"applied"
   },

   appliedAt:{
      type:Date,
      default:Date.now
   },

   remarks:{
      type:String
   }

},
{
   timestamps:true
}
);

applicationSchema.index(
   {
      student:1,
      drive:1
   },
   {
      unique:true
   }
);

const Application = mongoose.model(
   "Application",
   applicationSchema
);

export default Application;