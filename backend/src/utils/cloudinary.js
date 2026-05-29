import { v2 as cloudinary } from "cloudinary";
import fs from "fs";



// CONFIGURATION

cloudinary.config({

   cloud_name:process.env.CLOUDINARY_CLOUD_NAME,

   api_key:process.env.CLOUDINARY_API_KEY,

   api_secret:process.env.CLOUDINARY_API_SECRET

});





// UPLOAD FUNCTION

const uploadOnCloudinary = async (
   localFilePath
) => {

   try {

      if(!localFilePath){
         return null;
      }



      // UPLOAD FILE

      const response =
      await cloudinary.uploader.upload(

         localFilePath,

         {

            resource_type:"auto",

            folder:"placement-portal"

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



      console.log(
         "Cloudinary upload error",
         error
      );



      return null;

   }

};


export default uploadOnCloudinary;