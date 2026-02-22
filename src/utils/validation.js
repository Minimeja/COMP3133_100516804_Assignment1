const { body } = require("express-validator");

const userValidation = [
  body("variables.username")
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters"),

  body("variables.email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),

  body("variables.password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
];

const employeeValidation = [
  body("variables.first_name")
    .notEmpty()
    .withMessage("First name is required"),

  body("variables.last_name")
    .notEmpty()
    .withMessage("Last name is required"),

  body("variables.salary")
    .notEmpty()
    .withMessage("Salary is required")
    .isFloat({ min: 1000 })
    .withMessage("Salary must be >= 1000"),

  body("variables.designation")
    .notEmpty()
    .withMessage("Designation is required"),

  body("variables.department")
    .notEmpty()
    .withMessage("Department is required")
];

const runValidation = (rules) => async (req, res, next) => {
  await Promise.all(rules.map((r) => r.run(req)));
  next();
};

module.exports = {
  userValidation,
  employeeValidation,
  runValidation
};