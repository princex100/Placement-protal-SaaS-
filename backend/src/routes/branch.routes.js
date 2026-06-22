import express from "express";
import {
   createBranch,
  getBranches,
  createStudent,
  getBranchStudents
} from "../controllers/branch.controllers.js";
import { verifyJWT } from "../middlewares/verifyJWT.js";
import { allowRoles } from "../middlewares/role.middleware.js";

 const router = express.Router();

router.use(verifyJWT);
router.use(allowRoles(["college-admin", "college"])); // Both college roles to be safe

router.route("/")
  .post(createBranch)
  .get(getBranches);

router.route("/:branchId/students")
   .post(createStudent)
  .get(getBranchStudents);

export default router;
