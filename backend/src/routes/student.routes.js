import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {
  registerStudent,
  loginStudent,
  logoutStudent,
  getCurrentStudent,
  updateStudentProfile,
  uploadResume,
  getStudentDashboardStats
} from "../controllers/student.controllers.js";

import { verifyJWT } from "../middlewares/verifyJWT.js";
import { allowRoles } from "../middlewares/role.middleware.js";
import { importStudents } from "../controllers/student.import.controller.js";
import { validateRequest } from "../middlewares/validateRequest.middleware.js";
import {
 studentRegistrationRules,
  studentLoginRules,
  studentProfileUpdateRules
} from "../validators/student.validators.js";

const router = Router();

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

router.route("/register").post(
  verifyJWT,
  allowRoles(["college-admin"]),
  registerStudent
);
router.route("/import").post(
   verifyJWT,
  allowRoles(["college-admin"]),
  upload.single("file"),
  importStudents
);

// PROTECTED ROUTES (Student only)
router.route("/logout").post(
  verifyJWT,
 allowRoles(["student"]),
  logoutStudent
);

router.route("/current").get(
  verifyJWT,
  allowRoles(["student"]),
  getCurrentStudent
);

router.route("/dashboard-stats").get(
  verifyJWT,
  allowRoles(["student"]),
   getStudentDashboardStats
);

router.route("/profile").patch(
  verifyJWT,
  allowRoles(["student"]),
  upload.none(),
   ...studentProfileUpdateRules(),
  validateRequest,
  updateStudentProfile
);

 router.route("/resume").patch(
  verifyJWT,
  allowRoles(["student"]),
  upload.single("resume"),
  uploadResume
);

export default router;
