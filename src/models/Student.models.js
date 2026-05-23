import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const studentSchema=new mongoose.Schema({
   studentId:{
      type:String,
      unique:true,
      required:true
   },

   college:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"College",
      required:true
   },

   fullName:{
      type:String,
      required:true
   },

   email:{
      type:String,
      required:true
   },

   password:{
      type:String,
      required:true,
      select:false
   },

   branch:{
      type:String,
      required:true
   },

   year:{
      type:Number,
      required:true
   },

   cgpa:{
      type:Number,
      default:0
   },

   skills:[String],

   resume:{
      type:String
   },

   github:{
      type:String
   },

   linkedin:{
      type:String
   },

   portfolio:{
      type:String
   },

   phoneNumber:String,

   placementStatus:{
      type:String,
      enum:[
         "unplaced",
         "placed",
         "internship"
      ],
      default:"unplaced"
   },

   appliedDrives:[
      {
         type:mongoose.Schema.Types.ObjectId,
         ref:"PlacementDrive"
      }
   ],

   refreshToken:{
      type:String,
      select:false
   }

},{timestamps:true})



// HASH PASSWORD BEFORE SAVE

studentSchema.pre(
   "save",
   async function(){

      if(!this.isModified("password")){
         return;
      }

      this.password =
      await bcrypt.hash(this.password,10);

   }
);





// CHECK PASSWORD

studentSchema.methods.isPasswordCorrect =
async function(password){

   return await bcrypt.compare(
      password,
      this.password
   );

};





// GENERATE ACCESS TOKEN

studentSchema.methods.generateAccessToken =
function(){

   return jwt.sign(

      {
         _id:this._id,
         role:"student",
         college:this.college
      },

      process.env.ACCESS_TOKEN_SECRET,

      {
         expiresIn:
         process.env.ACCESS_TOKEN_EXPIRY
      }

   );

};





// GENERATE REFRESH TOKEN

studentSchema.methods.generateRefreshToken =
function(){

   return jwt.sign(

      {
         _id:this._id
      },

      process.env.REFRESH_TOKEN_SECRET,

      {
         expiresIn:
         process.env.REFRESH_TOKEN_EXPIRY
      }

   );

};

const Student=mongoose.model("Student",studentSchema)

export default Student
