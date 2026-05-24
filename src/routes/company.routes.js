import { Router } from "express";

import {
  registerCompany,
  loginCompany,
  logoutCompany,
  getCurrentCompany,
  refreshCompanyAccessToken,
  getAllColleges,
  createDrive,
  getCompanyDrives,
  getDriveById,
  deleteDrive
} from "../controllers/company.controllers.js";

import { upload }
from "../middlewares/multer.middleware.js";

import { verifyCompanyJWT }
from "../middlewares/verifyCompanyJWT.js";

const router = Router();

///////////////////////////////////////////
// PUBLIC ROUTES
///////////////////////////////////////////

router.post(
  "/register",
  upload.single("logo"),
  registerCompany
);

router.post(
  "/login",
  upload.none(),
  loginCompany
);

router.patch(
  "/refresh-token",
  upload.none(),

  refreshCompanyAccessToken
);

///////////////////////////////////////////
// PROTECTED ROUTES
///////////////////////////////////////////

router.post(
  "/logout",
  upload.none(),

  verifyCompanyJWT,
  logoutCompany
);

router.get(
  "/current",
  upload.none(),

  verifyCompanyJWT,
  getCurrentCompany
);

router.get(
  "/colleges",
  upload.none(),

  verifyCompanyJWT,
  getAllColleges
);

router.post(
  "/drives/create/:collegeId",
  upload.none(),

  verifyCompanyJWT,
  createDrive
);

router.get(
  "/drives",
  upload.none(),

  verifyCompanyJWT,
  getCompanyDrives
);

router.get(
  "/drives/:driveId",
  upload.none(),

  verifyCompanyJWT,
  getDriveById
);

router.delete(
  "/drives/delete/:driveId",
  upload.none(),

  verifyCompanyJWT,
  deleteDrive
);

export default router;