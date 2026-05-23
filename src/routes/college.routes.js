import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {
   registerCollege,
   loginCollege,
   logoutCollege,
   getCurrentCollege,
   refreshCollegeAccessToken,
   addStudent
} from "../controllers/college.controllers.js";

import { verifyJWT } from "../middlewares/verifyJWT.js";

const router = Router();

// PUBLIC ROUTES

router.post(
  "/register",
  upload.single("logo"),
  registerCollege
);


router.route("/login")
.post(upload.none(),loginCollege);

router.route("/refresh-token")
.patch(refreshCollegeAccessToken);

// PROTECTED ROUTES

router.route("/logout")
.post(
   verifyJWT,
   logoutCollege
);

router.route("/current")
.get(
   verifyJWT,
   getCurrentCollege
);

router.route("/add-student")
.post(upload.none(),verifyJWT,addStudent);

export default router;
