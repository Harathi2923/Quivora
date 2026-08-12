import { Router } from "express";

import authenticate from "../middleware/auth.middleware.js";
import authorize from "../middleware/role.middleware.js";

import {
    createQuiz,
    getAllQuizzes,
    getQuizById,
    updateQuiz,
    deleteQuiz,
} from "../controllers/quiz.controller.js";

import {
    createQuizValidation,
} from "../validations/quiz.validation.js";

const router = Router();

router.post(
    "/",
    authenticate,
    authorize("ADMIN"),
    createQuizValidation,
    createQuiz
);

router.get("/", getAllQuizzes);

router.get("/:id", getQuizById);

router.put(
    "/:id",
    authenticate,
    authorize("ADMIN"),
    updateQuiz
);

router.delete(
    "/:id",
    authenticate,
    authorize("ADMIN"),
    deleteQuiz
);

export default router;