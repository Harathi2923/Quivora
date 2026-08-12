import { body } from "express-validator";

export const registerValidation = [
  body("firstName")
    .trim()
    .notEmpty()
    .withMessage("First Name is required.")
    .matches(/^[A-Z][a-zA-Z]*$/)
    .withMessage("First Name must start with a capital letter."),

  body("lastName")
    .trim()
    .notEmpty()
    .withMessage("Last Name is required.")
    .matches(/^[A-Z][a-zA-Z]*$/)
    .withMessage("Last Name must start with a capital letter."),

  body("email")
    .isEmail()
    .withMessage("Enter a valid email address."),

  body("password")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/
    )
    .withMessage(
      "Password must contain uppercase, lowercase, number and special character."
    ),
];