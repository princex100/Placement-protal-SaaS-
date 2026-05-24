import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const companySchema = new mongoose.Schema(
  {
    companyId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
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
      trim: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    logo: {
      type: String,
      default: "",
    },

    website: {
      type: String,
      default: "",
    },

    industry: {
      type: String,
      trim: true,
      default: "",
    },

    description: {
      type: String,
      default: "",
    },

    hrName: {
      type: String,
      trim: true,
      default: "",
    },

    hrEmail: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },

    refreshToken: {
      type: String,
      select: false,
    },

    accessTokenVersion: {
      type: Number,
      default: 0,
    },

    isBlocked: {
      type: Boolean,
      default: false,
    }
  },
  {
    timestamps: true,
  }
);

///////////////////////////////////////
// PASSWORD HASHING
///////////////////////////////////////

companySchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  this.password = await bcrypt.hash(
    this.password,
    10
  );
});
///////////////////////////////////////
// PASSWORD CHECK
///////////////////////////////////////

companySchema.methods.isPasswordCorrect =
  async function (password) {
    return await bcrypt.compare(
      password,
      this.password
    );
  };

///////////////////////////////////////
// ACCESS TOKEN
///////////////////////////////////////

companySchema.methods.generateAccessToken =
  function () {
    return jwt.sign(
      {
        _id: this._id,
        companyId: this.companyId,
        email: this.email,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn:
          process.env.ACCESS_TOKEN_EXPIRY,
      }
    );
  };

///////////////////////////////////////
// REFRESH TOKEN
///////////////////////////////////////

companySchema.methods.generateRefreshToken =
  function () {
    return jwt.sign(
      {
        _id: this._id,
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn:
          process.env.REFRESH_TOKEN_EXPIRY,
      }
    );
  };

const Company = mongoose.model(
  "Company",
  companySchema
);

export default Company;