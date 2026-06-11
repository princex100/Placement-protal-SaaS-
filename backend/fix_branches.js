import mongoose from "mongoose";
import dotenv from "dotenv";
import Branch from "./src/models/branch.models.js";
import Student from "./src/models/Student.models.js";

dotenv.config();

const debugGetStudents = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URL}/${process.env.DB_NAME}`);
    console.log("Connected to MongoDB.");

    const collegeId = new mongoose.Types.ObjectId("6a1a347473033619f1604feb");
    const activePlacementSeason = 2026;

    const branch = await Branch.findOne({ college: collegeId });
    console.log("Found branch:", branch.name, branch._id);

    const filter = { 
      college: collegeId, 
      branch: branch.name,
      placementSeasonYear: activePlacementSeason
    };

    const count = await Student.countDocuments(filter);
    const students = await Student.find(filter).limit(3);

    console.log("Filter:", filter);
    console.log("Count:", count);
    console.log("Students:", JSON.stringify(students, null, 2));

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

debugGetStudents();
