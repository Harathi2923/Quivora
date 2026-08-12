import { body } from "express-validator";

export const createQuestionValidation = [

    body("questionText")
        .trim()
        .notEmpty()
        .withMessage("Question is required."),

    body("optionA")
        .trim()
        .notEmpty()
        .withMessage("Option A is required."),

    body("optionB")
        .trim()
        .notEmpty()
        .withMessage("Option B is required."),

    body("optionC")
        .trim()
        .notEmpty()
        .withMessage("Option C is required."),

    body("optionD")
        .trim()
        .notEmpty()
        .withMessage("Option D is required."),

    body("correctAnswer")
        .isIn(["A", "B", "C", "D"])
        .withMessage("Correct answer must be A, B, C or D."),

    body("marks")
        .isInt({ min: 1 })
        .withMessage("Marks must be greater than 0."),

    body("quizId")
        .notEmpty()
        .withMessage("Quiz is required.")
];