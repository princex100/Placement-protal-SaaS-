import { v2 as cloudinary } from "cloudinary";
import fs from "fs";









// UPLOAD FUNCTION

const uploadOnCloudinary = async (
   localFilePath
) => {

   try {
      // CONFIGURATION (Lazy load so env vars are available)
      cloudinary.config({
         cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
         api_key:process.env.CLOUDINARY_API_KEY,
         api_secret:process.env.CLOUDINARY_API_SECRET
      });

      if(!localFilePath){
         return null;
      }



      // UPLOAD FILE

      const isPDF = localFilePath.toLowerCase().endsWith(".pdf");
      const response = await cloudinary.uploader.upload(
         localFilePath,
         {
            resource_type: isPDF ? "raw" : "auto",
            folder: "placement-portal"
         }
      );



      // FILE UPLOADED SUCCESSFULLY

      console.log(
         "File uploaded successfully",
         response.url
      );



      // REMOVE LOCAL FILE

      fs.unlinkSync(localFilePath);



      return response;

   } catch (error) {

      // REMOVE LOCAL FILE IF ERROR

      fs.unlinkSync(localFilePath);



      console.error("Cloudinary upload error:", error);
      throw error;

   }

};


export default uploadOnCloudinary;