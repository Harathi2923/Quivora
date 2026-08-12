import { Router } from "express";

import authenticate from "../middleware/auth.middleware.js";
import authorize from "../middleware/role.middleware.js";


import {
    createQuestion,
    createManyQuestions,
    getAllQuestions,
    getQuestionById,
    updateQuestion,
    deleteQuestion,
    restoreQuestion,
} from "../controllers/question.controller.js";


import {
    createQuestionValidation,
} from "../validations/question.validation.js";


const router = Router();


// ============================================================
// CREATE MULTIPLE QUESTIONS
// ============================================================

router.post(
    "/bulk",
    authenticate,
    authorize("ADMIN"),
    createManyQuestions
);


// ============================================================
// CREATE ONE QUESTION
// ============================================================

router.post(
    "/",
    authenticate,
    authorize("ADMIN"),
    createQuestionValidation,
    createQuestion
);


// ============================================================
// GET ALL QUESTIONS
// ============================================================

router.get(
    "/",
    getAllQuestions
);


// ============================================================
// GET QUESTION BY ID
// ============================================================

router.get(
    "/:id",
    getQuestionById
);


// ============================================================
// UPDATE QUESTION
// ============================================================

router.put(
    "/:id",
    authenticate,
    authorize("ADMIN"),
    updateQuestion
);


// ============================================================
// DELETE QUESTION
// ============================================================

router.delete(
    "/:id",
    authenticate,
    authorize("ADMIN"),
    deleteQuestion
);


// ============================================================
// RESTORE QUESTION
// ============================================================

router.patch(
    "/:id/restore",
    authenticate,
    authorize("ADMIN"),
    restoreQuestion
);


export default router;