import { Router } from "express";
import {
  createDrive,
  updateDrive,
  deleteDrive,
 getCollegeDrives,
  getEligibleDrives,
  getDriveById,
 getDriveStudents,
  removeStudentFromDrive
} from "../controllers/drive.controllers.js";

import { uploadShortlist } from "../controllers/shortlist.controllers.js";
import { uploadInterviewSchedule } from "../controllers/interview.controllers.js";
import { uploadSelection } from "../controllers/selection.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";

import { verifyJWT } from "../middlewares/verifyJWT.js";
import { allowRoles } from "../middlewares/role.middleware.js";
import { validateRequest } from "../middlewares/validateRequest.middleware.js";
import {
  createDriveRules,
  updateDriveRules
} from "../validators/drive.validators.js";

const router = Router();

router.use(verifyJWT);

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

router.route("/:id/students")
   .get(
    allowRoles(["college-admin"]),
     getDriveStudents
   );

router.route("/:id/students/:studentId")
  .delete(
    allowRoles(["college-admin"]),
   removeStudentFromDrive
  );

router.route("/:driveId/shortlist/upload")
  .post(
    allowRoles(["college-admin"]),
    upload.single("file"),
    uploadShortlist
  );

router.route("/:driveId/interview-schedule/upload")
  .post(
    allowRoles(["college-admin"]),
    upload.single("file"),
    uploadInterviewSchedule
  );

router.route("/:driveId/selection/upload")
  .post(
    allowRoles(["college-admin"]),
    upload.single("file"),
    uploadSelection
  );


router.route("/student/eligible")
   .get(
    allowRoles(["student"]),
    getEligibleDrives
  );

// SHARED ROUTES (Both Student and College can view a specific drive details, controller handles auth logic)
router.route("/:id")
  .get(getDriveById);

export default router;
