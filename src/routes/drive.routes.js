import { Router } from "express";
import {
  createDrive,
  updateDrive,
  deleteDrive,
  getCollegeDrives,
  getEligibleDrives,
  getDriveById
} from "../controllers/drive.controllers.js";

import { verifyJWT } from "../middlewares/verifyJWT.js";
import { allowRoles } from "../middlewares/role.middleware.js";
import { validateRequest } from "../middlewares/validateRequest.middleware.js";
import {
  createDriveRules,
  updateDriveRules
} from "../validators/drive.validators.js";

const router = Router();

// All drive routes require authentication
router.use(verifyJWT);

// COLLEGE ROUTES
router.route("/")
  .post(
    allowRoles(["college-admin"]),
    ...createDriveRules(),
    validateRequest,
    createDrive
  );

router.route("/college")
  .get(
    allowRoles(["college-admin"]),
    getCollegeDrives
  );

router.route("/:id")
  .put(
    allowRoles(["college-admin"]),
    ...updateDriveRules(),
    validateRequest,
    updateDrive
  )
  .delete(
    allowRoles(["college-admin"]),
    deleteDrive
  );


// STUDENT ROUTES
router.route("/student/eligible")
  .get(
    allowRoles(["student"]),
    getEligibleDrives
  );

// SHARED ROUTES (Both Student and College can view a specific drive details, controller handles auth logic)
router.route("/:id")
  .get(getDriveById);

export default router;
