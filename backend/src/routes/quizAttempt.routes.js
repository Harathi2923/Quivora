import { Router } from "express";

import authenticate
    from "../middleware/auth.middleware.js";

import authorize
    from "../middleware/role.middleware.js";


import {

    startQuiz,

    getQuizQuestions,

    submitQuiz,

    getResult,

    getStudentDashboard,

    getStudentResults,

} from "../controllers/quizAttempt.controller.js";


import {

    startQuizValidation,

    submitQuizValidation,

} from "../validations/quizAttempt.validation.js";


const router = Router();


// ============================================================
// STUDENT DASHBOARD
// ============================================================

router.get(
    "/dashboard",
    authenticate,
    authorize("STUDENT"),
    getStudentDashboard
);


// ============================================================
// STUDENT RESULT HISTORY
// ============================================================

router.get(
    "/results",
    authenticate,
    authorize("STUDENT"),
    getStudentResults
);


// ============================================================
// START QUIZ
// ============================================================

router.post(
    "/start",
    authenticate,
    authorize("STUDENT"),
    startQuizValidation,
    startQuiz
);


// ============================================================
// GET QUIZ QUESTIONS
// ============================================================

router.get(
    "/:attemptId/questions",
    authenticate,
    authorize("STUDENT"),
    getQuizQuestions
);


// ============================================================
// SUBMIT QUIZ
// ============================================================

router.post(
    "/:attemptId/submit",
    authenticate,
    authorize("STUDENT"),
    submitQuizValidation,
    submitQuiz
);


// ============================================================
// GET SINGLE QUIZ RESULT
// ============================================================

router.get(
    "/:attemptId/result",
    authenticate,
    authorize("STUDENT"),
    getResult
);


export default router;