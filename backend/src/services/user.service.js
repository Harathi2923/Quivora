import bcrypt from "bcrypt";

import userRepository from "../repositories/user.repository.js";
import ApiError from "../utils/ApiError.js";


class UserService {

    // =========================================================
    // GET PROFILE
    // =========================================================

    async getProfile(userId) {

        const user =
            await userRepository.findById(userId);


        if (!user) {

            throw new ApiError(
                404,
                "User not found."
            );

        }


        return this.formatUser(user);

    }


    // =========================================================
    // UPDATE PROFILE
    // =========================================================

    async updateProfile(userId, profileData) {

        const user =
            await userRepository.findById(userId);


        if (!user) {

            throw new ApiError(
                404,
                "User not found."
            );

        }


        const {
            firstName,
            lastName,
            email,
            phone,
            dateOfBirth,
        } = profileData;


        // =====================================================
        // VALIDATE FIRST NAME
        // =====================================================

        if (
            firstName !== undefined &&
            !String(firstName).trim()
        ) {

            throw new ApiError(
                400,
                "First name cannot be empty."
            );

        }


        // =====================================================
        // VALIDATE LAST NAME
        // =====================================================

        if (
            lastName !== undefined &&
            !String(lastName).trim()
        ) {

            throw new ApiError(
                400,
                "Last name cannot be empty."
            );

        }


        // =====================================================
        // EMAIL VALIDATION
        // =====================================================

        if (email !== undefined) {

            const normalizedEmail =
                String(email)
                    .trim()
                    .toLowerCase();


            if (!normalizedEmail) {

                throw new ApiError(
                    400,
                    "Email cannot be empty."
                );

            }


            if (normalizedEmail !== user.email) {

                const existingUser =
                    await userRepository.findByEmail(
                        normalizedEmail
                    );


                if (
                    existingUser &&
                    existingUser.id !== userId
                ) {

                    throw new ApiError(
                        409,
                        "Email already exists."
                    );

                }

            }

        }


        // =====================================================
        // DATE OF BIRTH
        // =====================================================

        let parsedDateOfBirth = undefined;


        if (dateOfBirth !== undefined) {

            if (dateOfBirth === null || dateOfBirth === "") {

                parsedDateOfBirth = null;

            } else {

                const date =
                    new Date(dateOfBirth);


                if (Number.isNaN(date.getTime())) {

                    throw new ApiError(
                        400,
                        "Invalid date of birth."
                    );

                }


                parsedDateOfBirth = date;

            }

        }


        // =====================================================
        // BUILD UPDATE DATA
        // =====================================================

        const updateData = {};


        if (firstName !== undefined) {

            updateData.firstName =
                String(firstName).trim();

        }


        if (lastName !== undefined) {

            updateData.lastName =
                String(lastName).trim();

        }


        if (email !== undefined) {

            updateData.email =
                String(email)
                    .trim()
                    .toLowerCase();

        }


        if (phone !== undefined) {

            updateData.phone =
                phone === null
                    ? null
                    : String(phone).trim();

        }


        if (dateOfBirth !== undefined) {

            updateData.dateOfBirth =
                parsedDateOfBirth;

        }


        // =====================================================
        // UPDATE DATABASE
        // =====================================================

        const updatedUser =
            await userRepository.updateById(
                userId,
                updateData
            );


        return this.formatUser(updatedUser);

    }


    // =========================================================
    // CHANGE PASSWORD
    // =========================================================

    async changePassword(
        userId,
        currentPassword,
        newPassword
    ) {

        const user =
            await userRepository.findById(userId);


        if (!user) {

            throw new ApiError(
                404,
                "User not found."
            );

        }


        if (!currentPassword) {

            throw new ApiError(
                400,
                "Current password is required."
            );

        }


        if (!newPassword) {

            throw new ApiError(
                400,
                "New password is required."
            );

        }


        if (newPassword.length < 8) {

            throw new ApiError(
                400,
                "New password must be at least 8 characters."
            );

        }


        const passwordMatches =
            await bcrypt.compare(
                currentPassword,
                user.password
            );


        if (!passwordMatches) {

            throw new ApiError(
                400,
                "Current password is incorrect."
            );

        }


        if (currentPassword === newPassword) {

            throw new ApiError(
                400,
                "New password must be different from current password."
            );

        }


        const hashedPassword =
            await bcrypt.hash(
                newPassword,
                10
            );


        await userRepository.updatePassword(
            userId,
            hashedPassword
        );


        return true;

    }


    // =========================================================
    // FORMAT USER RESPONSE
    // =========================================================

    formatUser(user) {

        return {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            dateOfBirth: user.dateOfBirth,
            profileImage: user.profileImage,
            role: user.role,
            isActive: user.isActive,
            isVerified: user.isVerified,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };

    }

     // =========================================================
    // UPDATE PROFILE IMAGE
    // =========================================================

    async updateProfileImage(
        userId,
        file
    ) {

        if (!file) {

            throw new ApiError(
                400,
                "Please select a profile image."
            );

        }


        const profileImage =
            `/uploads/profiles/${file.filename}`;


        const updatedUser =
            await userRepository.updateProfileImage(
                userId,
                profileImage
            );


        return {

            id:
                updatedUser.id,

            firstName:
                updatedUser.firstName,

            lastName:
                updatedUser.lastName,

            email:
                updatedUser.email,

            phone:
                updatedUser.phone || "",

            dateOfBirth:
                updatedUser.dateOfBirth,

            profileImage:
                updatedUser.profileImage,

            role:
                updatedUser.role,

        };

    }



}


export default new UserService();