import prisma from "../prisma/client.js";

class UserRepository {

    // =========================================================
    // FIND USER BY EMAIL
    // =========================================================

    async findByEmail(email) {

        return await prisma.user.findUnique({
            where: {
                email,
            },
        });

    }


    // =========================================================
    // FIND USER BY ID
    // =========================================================

    async findById(id) {

        return await prisma.user.findUnique({
            where: {
                id,
            },
        });

    }


    // =========================================================
    // FIND ADMIN
    // =========================================================

    async findAdmin() {

        return await prisma.user.findFirst({
            where: {
                role: "ADMIN",
            },
        });

    }


    // =========================================================
    // CREATE USER
    // =========================================================

    async create(userData) {

        return await prisma.user.create({
            data: userData,
        });

    }


    // =========================================================
    // UPDATE USER PROFILE
    // =========================================================

    async updateById(id, data) {

        return await prisma.user.update({
            where: {
                id,
            },
            data,
        });

    }


    // =========================================================
    // UPDATE PASSWORD
    // =========================================================

    async updatePassword(id, hashedPassword) {

        return await prisma.user.update({
            where: {
                id,
            },
            data: {
                password: hashedPassword,
            },
        });

    }



    // =========================================================
    // UPDATE PROFILE IMAGE
    // =========================================================

    async updateProfileImage(
        id,
        profileImage
    ) {

        return await prisma.user.update({

            where: {
                id,
            },

            data: {
                profileImage,
            },

        });

      }

}

export default new UserRepository();