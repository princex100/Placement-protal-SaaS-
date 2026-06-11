
import dotenv from "dotenv";
import connectDB from "./db/db.js";
import { app } from "./app.js";
import { DB_NAME } from "./constants.js";

dotenv.config({
  path: "./.env",
});

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {

      console.log(process.env.MONGODB_URL);
      console.log(DB_NAME);
      console.log(
        `⚙️ Server is running on port : ${process.env.PORT}`
      );

    });
  })

  .catch((error) => {

    console.log("❌ MongoDB connection failed!", error);

  });
  
  
  