import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import userService from "../services/user.service.js";

// =========================================================
// GET PROFILE
// =========================================================

export const getProfile = asyncHandler(
    async (req, res) => {

        const user =
            await userService.getProfile(
                req.user.id
            );

        return res.status(200).json(
            new ApiResponse(
                200,
                "Profile fetched successfully.",
                user
            )
        );

    }
);


// =========================================================
// UPDATE PROFILE
// =========================================================

export const updateProfile = asyncHandler(
    async (req, res) => {

        const user =
            await userService.updateProfile(
                req.user.id,
                req.body
            );

        return res.status(200).json(
            new ApiResponse(
                200,
                "Profile updated successfully.",
                user
            )
        );

    }
);


// =========================================================
// CHANGE PASSWORD
// =========================================================

export const changePassword = asyncHandler(
    async (req, res) => {

        const {
            currentPassword,
            newPassword,
        } = req.body;

        await userService.changePassword(
            req.user.id,
            currentPassword,
            newPassword
        );

        return res.status(200).json(
            new ApiResponse(
                200,
                "Password changed successfully.",
                null
            )
        );

    }
);


// =========================================================
// UPLOAD PROFILE PICTURE
// =========================================================

export const uploadProfileImage = asyncHandler(
    async (req, res) => {

        const updatedUser =
            await userService.updateProfileImage(
                req.user.id,
                req.file
            );

        return res.status(200).json(
            new ApiResponse(
                200,
                "Profile picture updated successfully.",
                updatedUser
            )
        );

    }
);