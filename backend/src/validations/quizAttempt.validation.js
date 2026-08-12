import { body } from "express-validator";


export const startQuizValidation = [

    body("quizId")
        .notEmpty()
        .withMessage("Quiz ID is required.")
];


export const submitQuizValidation = [

    body("answers")
        .isArray({ min: 1 })
        .withMessage("At least one answer is required."),

    body("answers.*.questionId")
        .notEmpty()
        .withMessage("Question ID is required."),

    body("answers.*.selectedAnswer")
        .isIn(["A", "B", "C", "D"])
        .withMessage(
            "Selected answer must be A, B, C or D."
        )
];