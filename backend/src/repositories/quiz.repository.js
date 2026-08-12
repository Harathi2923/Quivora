import prisma from "../prisma/client.js";

class QuizRepository {

    // =========================================================
    // CREATE QUIZ
    // =========================================================

    async create(data) {

        return await prisma.quiz.create({
            data,

            include: {
                category: true,

                _count: {
                    select: {
                        questions: true,
                        attempts: true,
                    },
                },
            },
        });

    }


    // =========================================================
    // GET ALL QUIZZES
    // =========================================================

    async findAll() {

        return await prisma.quiz.findMany({

            include: {

                category: true,

                _count: {
                    select: {
                        questions: true,
                        attempts: true,
                    },
                },

            },

            orderBy: {
                createdAt: "desc",
            },

        });

    }


    // =========================================================
    // GET QUIZ BY ID
    // =========================================================

    async findById(id) {

        return await prisma.quiz.findUnique({

            where: {
                id,
            },

            include: {

                category: true,

                _count: {
                    select: {
                        questions: true,
                        attempts: true,
                    },
                },

            },

        });

    }


    // =========================================================
    // UPDATE QUIZ
    // =========================================================

    async update(id, data) {

        return await prisma.quiz.update({

            where: {
                id,
            },

            data,

            include: {

                category: true,

                _count: {
                    select: {
                        questions: true,
                        attempts: true,
                    },
                },

            },

        });

    }


    // =========================================================
    // DELETE QUIZ
    // =========================================================

    async delete(id) {

        return await prisma.quiz.delete({

            where: {
                id,
            },

        });

    }

}

export default new QuizRepository();