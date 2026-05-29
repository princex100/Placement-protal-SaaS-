import mongoose from "mongoose";
import College from "./src/models/College.models.js";
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

import { DB_NAME } from "./src/constants.js";

const testFlow = async () => {
  await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
  
  // Clean up
  await College.deleteMany({ email: "flowtest@example.com" });

  // 1. Create College
  const college = new College({
    collegeId: "FLOW123",
    name: "Flow Test",
    email: "flowtest@example.com",
    password: "password123",
    address: "123 Test",
    phoneNumber: "1234567890",
  });

  // Generate a fixed token for testing
  const unhashedToken = "dummytoken123";
  const hashedToken = crypto.createHash("sha256").update(unhashedToken).digest("hex");
  
  college.emailVerificationToken = hashedToken;
  college.emailVerificationExpiry = Date.now() + 15 * 60 * 1000;
  await college.save();

  console.log("1. College Created. isVerified:", college.isVerified);

  // 2. Test Verification Endpoint
  try {
    const res = await fetch(`http://localhost:8000/api/v1/colleges/verify-email/${unhashedToken}`);
    const data = await res.json();
    console.log("2. Verify Response:", data.message, "isVerified:", data.data?.college?.isVerified);
  } catch(e) {
    console.error("Verification error", e);
  }

  // 3. Test Login
  try {
    const res = await fetch(`http://localhost:8000/api/v1/colleges/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "flowtest@example.com", password: "password123" })
    });
    const data = await res.json();
    console.log("3. Login Response:", data.message, "StatusCode:", res.status);
  } catch(e) {
    console.error("Login error", e);
  }

  process.exit(0);
};

testFlow();
