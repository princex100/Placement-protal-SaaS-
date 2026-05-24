import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import studentRouter from "./routes/student.routes.js"
import collegeRouter from "./routes/college.routes.js"
import companyRouter
from "./routes/company.routes.js";


export const app=express()

app.use(express.json({ limit: "16kb" }));

// Parse URL encoded data
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// Serve static files
app.use(express.static("public"));

// Parse cookies
app.use(cookieParser());


app.use("/api/v1/students", studentRouter);
app.use("/api/v1/colleges", collegeRouter);
app.use("/api/v1/companies",companyRouter);


app.use((err,req,res,next)=>{
  res.status(err.statusCode||500).json({
    statusCode:err.statusCode,
    message:err.message,
    success:err.success||false,
    errors:err.errors||[]
  })
})





