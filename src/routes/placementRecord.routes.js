import { Router } from "express";
import { verifyJWT } from "../middlewares/verifyJWT.js";
import { allowRoles } from "../middlewares/role.middleware.js";
import {
  getPlacementOverview,
  getBranchPlacementDetails,
  getStudentProfileDetails,
  togglePlacementBlock,
} from "../controllers/placementRecord.controllers.js";

const router = Router();

// Secure all routes with College JWT middleware
router.use(verifyJWT);
router.use(allowRoles(["college-admin"]));

router.route("/").get(getPlacementOverview);
router.route("/:branchId").get(getBranchPlacementDetails);
router.route("/student/:studentId").get(getStudentProfileDetails);
router.route("/student/:studentId/toggle-block").patch(togglePlacementBlock);

export default router;
