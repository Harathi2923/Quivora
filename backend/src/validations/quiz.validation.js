import { body } from "express-validator";

export const createQuizValidation = [

    body("title")
        .trim()
        .notEmpty()
        .withMessage("Quiz title is required."),

    body("duration")
        .isInt({ min: 1 })
        .withMessage("Duration must be at least 1 minute."),

    body("totalMarks")
        .isInt({ min: 1 })
        .withMessage("Total marks must be greater than 0."),

    body("passingMarks")
        .isInt({ min: 1 })
        .withMessage("Passing marks must be greater than 0."),

    body("categoryId")
        .notEmpty()
        .withMessage("Category is required.")
];