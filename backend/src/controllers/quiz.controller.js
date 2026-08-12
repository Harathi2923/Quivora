import { validationResult } from "express-validator";

import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import quizService from "../services/quiz.service.js";

export const createQuiz = asyncHandler(async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        throw new ApiError(400, errors.array()[0].msg);
    }

    const quiz = await quizService.createQuiz(req.body);

    return res.status(201).json(
        new ApiResponse(
            201,
            "Quiz created successfully.",
            quiz
        )
    );
});

export const getAllQuizzes = asyncHandler(async (req, res) => {

    const quizzes = await quizService.getAllQuizzes();

    return res.status(200).json(
        new ApiResponse(
            200,
            "Quizzes fetched successfully.",
            quizzes
        )
    );
});

export const getQuizById = asyncHandler(async (req, res) => {

    const quiz = await quizService.getQuizById(req.params.id);

    return res.status(200).json(
        new ApiResponse(
            200,
            "Quiz fetched successfully.",
            quiz
        )
    );
});

export const updateQuiz = asyncHandler(async (req, res) => {

    const quiz = await quizService.updateQuiz(
        req.params.id,
        req.body
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            "Quiz updated successfully.",
            quiz
        )
    );
});

export const deleteQuiz = asyncHandler(async (req, res) => {

    await quizService.deleteQuiz(req.params.id);

    return res.status(200).json(
        new ApiResponse(
            200,
            "Quiz deleted successfully."
        )
    );
});