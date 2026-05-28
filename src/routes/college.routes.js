import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {
   registerCollege,
   loginCollege,
   logoutCollege,
   getCurrentCollege,
   refreshCollegeAccessToken,
   getCollegeDashboardStats,
   verifyEmail,
   getIncomingDrives
} from "../controllers/college.controllers.js";

import { verifyJWT } from "../middlewares/verifyJWT.js";
import { allowRoles } from "../middlewares/role.middleware.js";
import { validateRequest } from "../middlewares/validateRequest.middleware.js";
import {
  collegeRegistrationRules,
  collegeLoginRules,
} from "../validators/college.validators.js";

const router = Router();

// PUBLIC ROUTES

router.route("/register")
  .post(
    upload.single("logo"),
    ...collegeRegistrationRules(),
    validateRequest,
    registerCollege
  );

router.route("/login")
  .post(
    upload.none(), 
    ...collegeLoginRules(), 
    validateRequest, 
    loginCollege
  );

router.route("/refresh-token")
  .patch(refreshCollegeAccessToken);

router.route("/verify-email/:token")
  .get(verifyEmail);

// PROTECTED ROUTES (College only)

router.route("/logout")
  .post(verifyJWT, allowRoles(["college-admin"]), logoutCollege);

router.route("/current")
  .get(verifyJWT, allowRoles(["college-admin"]), getCurrentCollege);

router.route("/dashboard/stats")
  .get(verifyJWT, allowRoles(["college-admin"]), getCollegeDashboardStats);

router.route("/dashboard/incoming-drives")
  .get(verifyJWT, allowRoles(["college-admin"]), getIncomingDrives);

export default router;
