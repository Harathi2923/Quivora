import { Router } from "express";

import authenticate from "../middleware/auth.middleware.js";

import {
    getProfile,
    updateProfile,
    changePassword,
    uploadProfileImage as uploadProfileImageController,
} from "../controllers/user.controller.js";

import uploadProfileImage
    from "../middleware/upload.middleware.js";


const router = Router();


// Get Profile
router.get(
    "/profile",
    authenticate,
    getProfile
);


// Update Profile
router.put(
    "/profile",
    authenticate,
    updateProfile
);


// Change Password
router.put(
    "/change-password",
    authenticate,
    changePassword
);


// Update Profile Picture
router.put(
    "/profile-picture",
    authenticate,
    uploadProfileImage.single("profileImage"),
    uploadProfileImageController
);


export default router;