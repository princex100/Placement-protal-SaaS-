import { body } from "express-validator";

export const studentRegistrationRules = () => {
  return [
    body("studentId")
      .trim()
      .notEmpty()
      .withMessage("Student ID is required"),
    
    body("collegeId")
      .trim()
      .notEmpty()
      .withMessage("College ID is required")
      .isMongoId()
      .withMessage("Invalid College ID format"),
      
    body("fullName")
      .trim()
      .notEmpty()
      .withMessage("Full name is required"),
    
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Must be a valid email address")
      .normalizeEmail(),
    
    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
    
    body("branch")
      .trim()
      .notEmpty()
      .withMessage("Branch is required"),
    
    body("passingYear")
      .notEmpty()
      .withMessage("Passing year is required")
      .isNumeric()
      .withMessage("Passing year must be a number"),

    body("semester")
      .notEmpty()
      .withMessage("Semester is required")
      .isNumeric()
      .withMessage("Semester must be a number"),

    body("cgpa").optional().isNumeric(),
  ];
};

export const studentLoginRules = () => {
  return [
    body("rollNo")
      .trim()
      .notEmpty()
      .withMessage("Roll Number is required"),

    body("password")
      .notEmpty()
      .withMessage("Password is required"),
  ];
};

export const studentProfileUpdateRules = () => {
  return [
    body("fullName").optional().trim().notEmpty(),
    body("phoneNumber").optional().trim(),
    body("gender").optional().isIn(["Male", "Female", "Other", "Prefer not to say"]),
    body("branch").optional().trim(),
    body("cgpa").optional().isNumeric(),
    body("passingYear").optional().isNumeric(),
    body("semester").optional().isNumeric(),
    body("backlogCount").optional().isNumeric(),
    body("skills").optional().isArray(),
    body("github").optional().isURL().withMessage("Must be a valid URL"),
    body("linkedin").optional().isURL().withMessage("Must be a valid URL"),
    body("portfolio").optional().isURL().withMessage("Must be a valid URL"),
  ];
};
