import { body } from "express-validator";

export const createCategoryValidation = [

    body("name")
        .trim()
        .notEmpty()
        .withMessage("Category name is required.")
        .isLength({ min: 3, max: 50 })
        .withMessage("Category name must be between 3 and 50 characters."),

    body("description")
        .optional()
        .isLength({ max: 200 })
        .withMessage("Description cannot exceed 200 characters.")
];