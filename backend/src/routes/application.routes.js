import { Router } from "express";
import {
  applyToDrive,
  getMyApplications,
  getDriveApplicants,
  updateApplicationStatus,
  getAllCollegeApplications,
  getApplicationById
} from "../controllers/application.controllers.js";

import { verifyJWT } from "../middlewares/verifyJWT.js";
import { allowRoles } from "../middlewares/role.middleware.js";
import { validateRequest } from "../middlewares/validateRequest.middleware.js";
import {
  applyToDriveRules,
  updateApplicationStatusRules
} from "../validators/application.validators.js";

const router = Router();

// All application routes require authentication
router.use(verifyJWT);

// STUDENT ROUTES
router.route("/student/me")
  .get(
    allowRoles(["student"]),
    getMyApplications
  );

router.route("/:driveId/apply")
  .post(
    allowRoles(["student"]),
    ...applyToDriveRules(),
    validateRequest,
    applyToDrive
  );


// COLLEGE ROUTES
router.route("/college/all")
  .get(
    allowRoles(["college-admin"]),
    getAllCollegeApplications
  );

router.route("/drive/:driveId")
  .get(
    allowRoles(["college-admin"]),
    // Add validation rules for driveId if needed (can just use applyToDriveRules logic)
    getDriveApplicants
  );

router.route("/:applicationId/status")
  .patch(
    allowRoles(["college-admin"]),
    ...updateApplicationStatusRules(),
    validateRequest,
    updateApplicationStatus
  );

router.route("/:applicationId")
  .get(
    allowRoles(["college-admin"]),
    getApplicationById
  );

export default router;
