import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {
  registerStudent,
  loginStudent,
  logoutStudent,
  getCurrentStudent,
  updateStudentProfile,
  uploadResume
} from "../controllers/student.controllers.js";

import { verifyJWT } from "../middlewares/verifyJWT.js";
import { allowRoles } from "../middlewares/role.middleware.js";
import { validateRequest } from "../middlewares/validateRequest.middleware.js";
import {
  studentRegistrationRules,
  studentLoginRules,
  studentProfileUpdateRules
} from "../validators/student.validators.js";

const router = Router();

// PUBLIC ROUTES
router.route("/register").post(
  upload.none(),
  ...studentRegistrationRules(),
  validateRequest,
  registerStudent
);

router.route("/login").post(
  upload.none(),
  ...studentLoginRules(),
  validateRequest,
  loginStudent
);

// PROTECTED ROUTES (Student only)
router.use(verifyJWT, allowRoles(["student"]));

router.route("/logout").post(logoutStudent);

router.route("/current").get(getCurrentStudent);

router.route("/profile").patch(
  upload.none(),
  ...studentProfileUpdateRules(),
  validateRequest,
  updateStudentProfile
);

router.route("/resume").patch(
  upload.single("resume"),
  uploadResume
);

export default router;
