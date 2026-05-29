import { Router } from "express";
import { verifyCollegeJWT } from "../middlewares/auth.middlewares.js";
import {
  getPlacementOverview,
  getBranchPlacementDetails,
  getStudentProfileDetails,
  togglePlacementBlock,
} from "../controllers/placementRecord.controllers.js";

const router = Router();

// Secure all routes with College JWT middleware
router.use(verifyCollegeJWT);

router.route("/").get(getPlacementOverview);
router.route("/:branchId").get(getBranchPlacementDetails);
router.route("/student/:studentId").get(getStudentProfileDetails);
router.route("/student/:studentId/toggle-block").patch(togglePlacementBlock);

export default router;
