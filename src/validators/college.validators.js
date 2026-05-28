import { body } from "express-validator";

/**
 * Validation rules for college registration
 */
export const collegeRegistrationRules = () => {
  return [
    body("collegeId")
      .trim()
      .notEmpty()
      .withMessage("College ID is required")
      .toUpperCase()
      .isString()
      .withMessage("College ID must be a string")
      .isLength({ min: 6 })
      .withMessage("College ID must be at least 6 characters long")
      .matches(/^(?=.*[A-Z])(?=.*\d)[A-Z\d]+$/)
      .withMessage("College ID must contain both letters and numbers without special characters"),

    body("name")
      .trim()
      .notEmpty()
      .withMessage("College name is required")
      .isString()
      .withMessage("College name must be a string"),

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

    body("address")
      .optional()
      .isString()
      .trim(),

    body("phoneNumber")
      .optional()
      .isString()
      .trim()
      .matches(/^\d{10}$/)
      .withMessage("Phone number must be exactly 10 digits"),
  ];
};

/**
 * Validation rules for college login
 */
export const collegeLoginRules = () => {
  return [
    body().custom((value, { req }) => {
      if (!req.body.collegeId && !req.body.email) {
        throw new Error("Either College ID or Email is required for login");
      }
      return true;
    }),

    body("collegeId")
      .optional({ checkFalsy: true })
      .toUpperCase()
      .isString()
      .withMessage("College ID must be a string")
      .isLength({ min: 6 })
      .withMessage("College ID must be at least 6 characters long")
      .matches(/^(?=.*[A-Z])(?=.*\d)[A-Z\d]+$/)
      .withMessage("College ID must contain both letters and numbers without special characters"),

    body("email")
      .optional({ checkFalsy: true })
      .isEmail()
      .withMessage("Must be a valid email address")
      .normalizeEmail(),

    body("password")
      .notEmpty()
      .withMessage("Password is required"),
  ];
};

/**
 * Validation rules for adding a student
 */
export const addStudentRules = () => {
  return [
    body("studentId")
      .trim()
      .notEmpty()
      .withMessage("Student ID is required"),
    
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
    
    body("year")
      .notEmpty()
      .withMessage("Year is required")
      .isNumeric()
      .withMessage("Year must be a number"),

    body("cgpa").optional().isNumeric(),
    body("skills").optional().isArray(),
    body("phoneNumber").optional().isString(),
    body("github").optional().isString(),
    body("linkedin").optional().isString(),
    body("portfolio").optional().isString(),
  ];
};
