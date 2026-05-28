import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const collegeSchema = new mongoose.Schema(
  {
    collegeId: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    logo: {
      type: String,
    },
    address: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    refreshToken: {
      type: String,
      select: false,
    },
    refreshTokenExpiry: {
      type: Date,
    },
    accessTokenVersion: {
      type: Number,
      default: 0,
    },
    role: {
      type: String,
      default: "college-admin",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: {
      type: String,
    },
    emailVerificationExpiry: {
      type: Date,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    studentsCount: {
      type: Number,
      default: 0,
    },
    activeDrivesCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

collegeSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }
  this.password = await bcrypt.hash(this.password, 10);
});

collegeSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

collegeSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      role: "college-admin",
      college: this._id,
      tokenVersion: this.accessTokenVersion,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

collegeSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      role: "college-admin",
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

collegeSchema.methods.generateVerificationToken = function () {
  // Generate an unhashed random token
  const unhashedToken = crypto.randomBytes(32).toString("hex");

  // Hash it and store in DB
  this.emailVerificationToken = crypto
    .createHash("sha256")
    .update(unhashedToken)
    .digest("hex");

  // Set expiry to 15 minutes from now
  this.emailVerificationExpiry = Date.now() + 15 * 60 * 1000;

  // Return the unhashed token to be sent in the email
  return unhashedToken;
};

const College = mongoose.model("College", collegeSchema);
export default College;
