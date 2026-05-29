import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const dropCollections = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      dbName: process.env.DB_NAME
    });
    console.log("Connected to MongoDB.");

    const db = mongoose.connection.db;

    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);

    if (collectionNames.includes("students")) {
      await db.dropCollection("students");
      console.log("Dropped students collection.");
    }
    if (collectionNames.includes("applications")) {
      await db.dropCollection("applications");
      console.log("Dropped applications collection.");
    }
    if (collectionNames.includes("branchplacementrecords")) {
      await db.dropCollection("branchplacementrecords");
      console.log("Dropped branchplacementrecords collection.");
    }

    console.log("Database cleanup complete.");
  } catch (error) {
    console.error("Error cleaning up database:", error);
  } finally {
    mongoose.connection.close();
  }
};

dropCollections();
