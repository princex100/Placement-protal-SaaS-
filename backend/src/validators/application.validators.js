import { body, param } from "express-validator";

export const applyToDriveRules = () => {
  return [
    param("driveId").isMongoId().withMessage("Invalid Drive ID")
  ];
};

export const updateApplicationStatusRules = () => {
  return [
    param("applicationId").isMongoId().withMessage("Invalid Application ID"),
    body("status")
      .isIn([
        "Applied",
        "Shortlisted",
        "Interview Scheduled",
        "Selected",
        "Rejected",
        "Withdrawn",
      ])
      .withMessage("Invalid status"),
    body("remarks").optional().isString()
  ];
};
