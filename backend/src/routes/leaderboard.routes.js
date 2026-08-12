import { Router } from "express";

import authenticate from "../middleware/auth.middleware.js";

import {
    getLeaderboard,
    getMyLeaderboards,
} from "../controllers/leaderboard.controller.js";


const router = Router();


// ============================================================
// MY PARTICIPATED QUIZZES
// ============================================================

router.get(
    "/my",
    authenticate,
    getMyLeaderboards
);


// ============================================================
// ONE QUIZ LEADERBOARD
// ============================================================

router.get(
    "/:quizId",
    authenticate,
    getLeaderboard
);


export default router;