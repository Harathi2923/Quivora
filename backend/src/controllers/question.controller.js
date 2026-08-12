import { validationResult } from "express-validator";

import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

import questionService from "../services/question.service.js";


// ============================================================
// CREATE ONE QUESTION
// ============================================================

export const createQuestion = asyncHandler(
    async (req, res) => {

        const errors =
            validationResult(req);


        if (!errors.isEmpty()) {

            throw new ApiError(
                400,
                errors.array()[0].msg
            );

        }


        const question =
            await questionService.createQuestion(
                req.body
            );


        return res.status(201).json(

            new ApiResponse(

                201,

                "Question created successfully.",

                question

            )

        );

    }
);


// ============================================================
// CREATE MULTIPLE QUESTIONS
// ============================================================

export const createManyQuestions = asyncHandler(
    async (req, res) => {

        const { questions } =
            req.body;


        if (
            !Array.isArray(questions) ||
            questions.length === 0
        ) {

            throw new ApiError(
                400,
                "Questions array is required."
            );

        }


        const result =
            await questionService.createManyQuestions(
                questions
            );


        return res.status(201).json(

            new ApiResponse(

                201,

                "Questions created successfully.",

                {
                    count: result.count,
                }

            )

        );

    }
);


// ============================================================
// GET ALL QUESTIONS
// ============================================================

export const getAllQuestions = asyncHandler(
    async (req, res) => {

        const questions =
            await questionService.getAllQuestions();


        return res.status(200).json(

            new ApiResponse(

                200,

                "Questions fetched successfully.",

                questions

            )

        );

    }
);


// ============================================================
// GET QUESTION BY ID
// ============================================================

export const getQuestionById = asyncHandler(
    async (req, res) => {

        const question =
            await questionService.getQuestionById(
                req.params.id
            );


        return res.status(200).json(

            new ApiResponse(

                200,

                "Question fetched successfully.",

                question

            )

        );

    }
);


// ============================================================
// UPDATE QUESTION
// ============================================================

export const updateQuestion = asyncHandler(
    async (req, res) => {

        const question =
            await questionService.updateQuestion(

                req.params.id,

                req.body

            );


        return res.status(200).json(

            new ApiResponse(

                200,

                "Question updated successfully.",

                question

            )

        );

    }
);


// ============================================================
// DELETE QUESTION
// ============================================================

export const deleteQuestion = asyncHandler(
    async (req, res) => {

        await questionService.deleteQuestion(
            req.params.id
        );


        return res.status(200).json(

            new ApiResponse(

                200,

                "Question deleted successfully."

            )

        );

    }
);


// ============================================================
// RESTORE QUESTION
// ============================================================

export const restoreQuestion = asyncHandler(
    async (req, res) => {

        const question =
            await questionService.restoreQuestion(
                req.params.id
            );


        return res.status(200).json(

            new ApiResponse(

                200,

                "Question restored successfully.",

                question

            )

        );

    }
);