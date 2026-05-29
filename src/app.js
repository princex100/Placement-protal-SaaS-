import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import studentRouter from "./routes/student.routes.js"
import collegeRouter from "./routes/college.routes.js"
import driveRouter from "./routes/drive.routes.js"
import applicationRouter from "./routes/application.routes.js"
import placementRecordRouter from "./routes/placementRecord.routes.js"
import branchRouter from "./routes/branch.routes.js"


export const app = express()
console.log("CORS CONFIG LOADED");
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));

// Parse URL encoded data
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// Serve static files
app.use(express.static("public"));

// Parse cookies
app.use(cookieParser());

app.get("/test-server", (req, res) => {
  res.send("THIS IS MY REAL SERVER");
});
app.use("/api/v1/students", studentRouter);
app.use("/api/v1/colleges", collegeRouter);
app.use("/api/v1/drives", driveRouter);
app.use("/api/v1/applications", applicationRouter);
app.use("/api/v1/placement-records", placementRecordRouter);
app.use("/api/v1/branches", branchRouter);


app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    statusCode: err.statusCode,
    message: err.message,
    success: err.success || false,
    errors: err.errors || []
  })
})
