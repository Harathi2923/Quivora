import { Router } from "express";
import authenticate from "../middleware/auth.middleware.js";
import authorize from "../middleware/role.middleware.js";

import {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
} from "../controllers/category.controller.js";

import {
    createCategoryValidation,
} from "../validations/category.validation.js";

const router = Router();

router.post(
    "/",
    authenticate,
    authorize("ADMIN"),
    createCategoryValidation,
    createCategory
);

router.get(
    "/",
    getAllCategories
);

router.get(
    "/:id",
    getCategoryById
);

router.put(
    "/:id",
    authenticate,
    authorize("ADMIN"),
    updateCategory
);

router.delete(
    "/:id",
    authenticate,
    authorize("ADMIN"),
    deleteCategory
);

export default router;