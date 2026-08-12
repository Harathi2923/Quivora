import prisma from "../prisma/client.js";

class LeaderboardRepository {

    // ============================================================
    // GET ALL COMPLETED ATTEMPTS FOR A QUIZ
    // ============================================================

    async findCompletedAttemptsByQuiz(quizId) {

        return await prisma.quizAttempt.findMany({

            where: {
                quizId,
                status: "COMPLETED",
            },

            orderBy: [
                {
                    score: "desc",
                },
                {
                    timeTaken: "asc",
                },
                {
                    submittedAt: "asc",
                },
            ],

            select: {
                id: true,
                studentId: true,
                score: true,
                submittedAt: true,
                timeTaken: true,
            },

        });

    }


    // ============================================================
    // CHECK WHETHER STUDENT PARTICIPATED
    // ============================================================

    async findStudentAttempt(studentId, quizId) {

        return await prisma.quizAttempt.findFirst({

            where: {
                studentId,
                quizId,
                status: "COMPLETED",
            },

            select: {
                id: true,
                studentId: true,
                quizId: true,
                score: true,
                submittedAt: true,
                timeTaken: true,
            },

        });

    }


    // ============================================================
    // GET USERS BY IDS
    // ============================================================

    async findUsersByIds(ids) {

        return await prisma.user.findMany({

            where: {
                id: {
                    in: ids,
                },
            },

            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
            },

        });

    }


    // ============================================================
    // GET QUIZZES PARTICIPATED BY STUDENT
    // ============================================================

    async findCompletedQuizzesByStudent(studentId) {

        return await prisma.quizAttempt.findMany({

            where: {
                studentId,
                status: "COMPLETED",
            },

            orderBy: {
                submittedAt: "desc",
            },

            select: {

                quizId: true,

                quiz: {
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        totalMarks: true,
                        passingMarks: true,
                        duration: true,
                    },
                },

            },

        });

    }

}


export default new LeaderboardRepository();