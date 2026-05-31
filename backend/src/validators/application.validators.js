import { body, param } from "express-validator";

export const applyToDriveRules = () => {
  return [
    param("driveId").isMongoId().withMessage("Invalid Drive ID")
  ];
};

export const updateApplicationStatusRules = () => {
  return [
    param("applicationId").isMongoId().withMessage("Invalid Application ID"),
    body("applicationStatus")
      .isIn([
        "applied",
        "shortlisted",
        "interview_scheduled",
        "selected",
        "rejected"
      ])
      .withMessage("Invalid application status"),
    body("remarks").optional().isString()
  ];
};
