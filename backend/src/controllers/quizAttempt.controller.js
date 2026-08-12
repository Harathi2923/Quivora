import asyncHandler
    from "../utils/asyncHandler.js";

import ApiResponse
    from "../utils/ApiResponse.js";

import quizAttemptService
    from "../services/quizAttempt.service.js";


// ============================================================
// START QUIZ
// ============================================================

export const startQuiz =
    asyncHandler(
        async (req, res) => {

            const result =
                await quizAttemptService
                    .startQuiz(
                        req.user.id,
                        req.body.quizId
                    );


            return res
                .status(201)
                .json(

                    new ApiResponse(
                        201,
                        "Quiz started successfully.",
                        result
                    )

                );

        }
    );


// ============================================================
// GET QUIZ QUESTIONS
// ============================================================

export const getQuizQuestions =
    asyncHandler(
        async (req, res) => {

            const result =
                await quizAttemptService
                    .getQuizQuestions(
                        req.user.id,
                        req.params.attemptId
                    );


            return res
                .status(200)
                .json(

                    new ApiResponse(
                        200,
                        "Quiz questions fetched successfully.",
                        result
                    )

                );

        }
    );


// ============================================================
// SUBMIT QUIZ
// ============================================================

export const submitQuiz =
    asyncHandler(
        async (req, res) => {

            const result =
                await quizAttemptService
                    .submitQuiz(
                        req.user.id,
                        req.params.attemptId,
                        req.body.answers
                    );


            return res
                .status(200)
                .json(

                    new ApiResponse(
                        200,
                        "Quiz submitted successfully.",
                        result
                    )

                );

        }
    );


// ============================================================
// GET SINGLE RESULT
// ============================================================

export const getResult =
    asyncHandler(
        async (req, res) => {

            const result =
                await quizAttemptService
                    .getResult(
                        req.user.id,
                        req.params.attemptId
                    );


            return res
                .status(200)
                .json(

                    new ApiResponse(
                        200,
                        "Quiz result fetched successfully.",
                        result
                    )

                );

        }
    );


// ============================================================
// GET STUDENT DASHBOARD
// ============================================================

export const getStudentDashboard =
    asyncHandler(
        async (req, res) => {

            const dashboard =
                await quizAttemptService
                    .getStudentDashboard(
                        req.user.id
                    );


            return res
                .status(200)
                .json({

                    success: true,

                    statusCode: 200,

                    message:
                        "Student dashboard fetched successfully.",

                    data:
                        dashboard,

                });

        }
    );


// ============================================================
// GET STUDENT RESULT HISTORY
// ============================================================

export const getStudentResults =
    asyncHandler(
        async (req, res) => {

            const page =
                req.query.page || 1;


            const limit =
                req.query.limit || 6;


            const result =
                await quizAttemptService
                    .getStudentResults(

                        req.user.id,

                        page,

                        limit

                    );


            return res
                .status(200)
                .json(

                    new ApiResponse(
                        200,
                        "Student results fetched successfully.",
                        result
                    )

                );

        }
    );