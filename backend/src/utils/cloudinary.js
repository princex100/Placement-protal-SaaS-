import { v2 as cloudinary } from "cloudinary";
import fs from "fs";


const uploadOnCloudinary = async (
   localFilePath
) => {

   try {
       cloudinary.config({
         cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
         api_key:process.env.CLOUDINARY_API_KEY,
         api_secret:process.env.CLOUDINARY_API_SECRET
      });

      if(!localFilePath){
         return null;
      }




      const isPDF = localFilePath.toLowerCase().endsWith(".pdf");
      const response = await cloudinary.uploader.upload(
         localFilePath,
         {
            resource_type: isPDF ? "raw" : "auto",
            folder: "placement-portal"
         }
      );




      console.log(
         "File uploaded successfully",
         response.url
      );




      fs.unlinkSync(localFilePath);



      return response;

   } catch (error) {


      fs.unlinkSync(localFilePath);



      console.error("Cloudinary upload error:", error);
      throw error;

   }

};


export default uploadOnCloudinary;