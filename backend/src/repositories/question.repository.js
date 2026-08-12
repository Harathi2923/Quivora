import prisma from "../prisma/client.js";

class QuestionRepository {

    // ============================================================
    // CREATE ONE QUESTION
    // ============================================================

    async create(data) {

        return await prisma.question.create({

            data,

            include: {
                quiz: true,
            },

        });

    }


    // ============================================================
    // CREATE MULTIPLE QUESTIONS
    // ============================================================

    async createMany(data) {

        return await prisma.question.createMany({

            data,

        });

    }


    // ============================================================
    // GET ALL QUESTIONS
    // ============================================================

    async findAll() {

        return await prisma.question.findMany({

            include: {
                quiz: true,
            },

            orderBy: {
                createdAt: "asc",
            },

        });

    }


    // ============================================================
    // GET QUESTION BY ID
    // ============================================================

    async findById(id) {

        return await prisma.question.findUnique({

            where: {
                id,
            },

            include: {
                quiz: true,
            },

        });

    }


    // ============================================================
    // FIND INCLUDING DELETED
    // ============================================================

    async findByIdIncludingDeleted(id) {

        return await prisma.question.findUnique({

            where: {
                id,
            },

            include: {
                quiz: true,
            },

        });

    }


    // ============================================================
    // UPDATE QUESTION
    // ============================================================

    async update(id, data) {

        return await prisma.question.update({

            where: {
                id,
            },

            data,

            include: {
                quiz: true,
            },

        });

    }


    // ============================================================
    // SOFT DELETE
    // ============================================================

    async delete(id) {

        return await prisma.question.update({

            where: {
                id,
            },

            data: {
                isDeleted: true,
            },

        });

    }


    // ============================================================
    // RESTORE
    // ============================================================

    async restore(id) {

        return await prisma.question.update({

            where: {
                id,
            },

            data: {
                isDeleted: false,
            },

            include: {
                quiz: true,
            },

        });

    }

}


export default new QuestionRepository();