import { Router } from "express";

import {
   loginStudent,
   logoutStudent,
   getCurrentStudent,
   updateStudentProfile,
   updateResume,
   getAllDrives,
   getDriveById,
   refreshAccessToken
} from "../controllers/student.controllers.js";

import { verifyJWT }
from "../middlewares/verifyJWT.js";

import { upload }
from "../middlewares/multer.middleware.js";



const router = Router();




// PUBLIC ROUTES

router.route("/login")
.post(upload.none(),loginStudent);




// PROTECTED ROUTES

router.route("/logout")
.post(
   verifyJWT,
   logoutStudent
);




router.route("/current")
.get(
   verifyJWT,
   getCurrentStudent
);




router.route("/update-profile")
.patch(
   verifyJWT,
   updateStudentProfile
);




router.route("/update-resume")
.patch(
   verifyJWT,

   upload.single("resume"),

   updateResume
);

router.route("/refresh-token")
.patch(
  verifyJWT,
  refreshAccessToken
)

router.route("/drives")
.get(
   verifyJWT,
   getAllDrives
);

router.get(
  "/drives/:driveId",
  verifyJWT,
  getDriveById
);


export default router;

