import { body } from "express-validator";

export const createDriveRules = () => {
  return [
    body("title").trim().notEmpty().withMessage("Title is required"),
    body("companyName").trim().notEmpty().withMessage("Company Name is required"),
    body("role").trim().notEmpty().withMessage("Role is required"),
     body("jobType")
      .isIn(["internship", "fulltime", "internship+fte"])
      .withMessage("Invalid job type"),
    body("mode")
      .optional()
      .isIn(["remote", "hybrid", "on-site"])
      .withMessage("Invalid mode"),
    body("package")
      .notEmpty()
      .withMessage("Package is required")
      .isNumeric()
      .withMessage("Package must be a number"),
    body("applicationDeadline")
      .notEmpty()
      .withMessage("Application deadline is required")
      .isISO8601()
     .withMessage("Must be a valid date"),
    
    body("minimumCgpa").optional().isNumeric(),
    body("backlogAllowed").optional().isNumeric(),
    body("eligibleBranches").optional().isArray(),
    body("passingYearsAllowed").optional().isArray(),
    body("skillsRequired").optional().isArray()
  ];
};

export const updateDriveRules = () => {
  return [
   body("title").optional().trim().notEmpty(),
    body("companyName").optional().trim().notEmpty(),
    body("role").optional().trim().notEmpty(),
    body("jobType").optional().isIn(["internship", "fulltime", "internship+fte"]),
    body("mode").optional().isIn(["remote", "hybrid", "on-site"]),
    body("package").optional().isNumeric(),
    body("applicationDeadline").optional().isISO8601(),
    body("minimumCgpa").optional().isNumeric(),
    body("backlogAllowed").optional().isNumeric(),
    body("eligibleBranches").optional().isArray(),
     body("passingYearsAllowed").optional().isArray(),
    body("skillsRequired").optional().isArray(),
     body("status").optional().isIn(["open", "closed"])
  ];
 };
