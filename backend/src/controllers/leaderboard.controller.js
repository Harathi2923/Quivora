import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

import leaderboardService from "../services/leaderboard.service.js";


// ============================================================
// GET LEADERBOARD FOR ONE QUIZ
// ============================================================

export const getLeaderboard = asyncHandler(
    async (req, res) => {

        const {
            page = 1,
            limit = 10,
        } = req.query;


        const result =
            await leaderboardService.getLeaderboard(

                req.params.quizId,

                req.user.id,

                req.user.role,

                page,

                limit

            );


        return res.status(200).json(

            new ApiResponse(

                200,

                "Leaderboard fetched successfully.",

                result

            )

        );

    }
);


// ============================================================
// GET MY PARTICIPATED QUIZZES
// ============================================================

export const getMyLeaderboards = asyncHandler(
    async (req, res) => {

        const result =
            await leaderboardService.getMyLeaderboards(
                req.user.id
            );


        return res.status(200).json(

            new ApiResponse(

                200,

                "Student leaderboards fetched successfully.",

                result

            )

        );

    }
);