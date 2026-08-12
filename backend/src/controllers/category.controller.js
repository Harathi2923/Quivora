import { validationResult } from "express-validator";

import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import categoryService from "../services/category.service.js";

export const createCategory = asyncHandler(async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        throw new ApiError(400, errors.array()[0].msg);
    }

    const category = await categoryService.createCategory(req.body);

    return res.status(201).json(
        new ApiResponse(
            201,
            "Category created successfully.",
            category
        )
    );
});

export const getAllCategories = asyncHandler(async (req, res) => {

    const categories = await categoryService.getAllCategories();

    return res.status(200).json(
        new ApiResponse(
            200,
            "Categories fetched successfully.",
            categories
        )
    );
});

export const getCategoryById = asyncHandler(async (req, res) => {

    const category = await categoryService.getCategoryById(req.params.id);

    return res.status(200).json(
        new ApiResponse(
            200,
            "Category fetched successfully.",
            category
        )
    );
});

export const updateCategory = asyncHandler(async (req, res) => {

    const category = await categoryService.updateCategory(
        req.params.id,
        req.body
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            "Category updated successfully.",
            category
        )
    );
});

export const deleteCategory = asyncHandler(async (req, res) => {

    await categoryService.deleteCategory(req.params.id);

    return res.status(200).json(
        new ApiResponse(
            200,
            "Category deleted successfully."
        )
    );
});