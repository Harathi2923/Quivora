import { validationResult } from "express-validator";

import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import authService from "../services/auth.service.js";
import generateToken from "../utils/generateToken.js";

export const register = asyncHandler(async (req, res) => {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new ApiError(400, errors.array()[0].msg);
  }

  const user = await authService.register(req.body);

  return res.status(201).json(
    new ApiResponse(
      201,
      "Student registered successfully.",
      {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      }
    )
  );
});

export const login = asyncHandler(async (req, res) => {

    const { email, password } = req.body;

    const user = await authService.login(email, password);

    const token = generateToken(user);

    return res.status(200).json(
        new ApiResponse(
            200,
            "Login successful.",
            {
                token,
                user: {
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    role: user.role,
                },
            }
        )
    );
});