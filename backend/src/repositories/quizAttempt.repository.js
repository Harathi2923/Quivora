import prisma from "../prisma/client.js";

class QuizAttemptRepository {

    // =========================================================
    // CREATE ATTEMPT
    // =========================================================

    async create(data) {

        return await prisma.quizAttempt.create({
            data,
        });

    }


    // =========================================================
    // FIND ATTEMPT BY ID
    // =========================================================

    async findById(id) {

        return await prisma.quizAttempt.findUnique({
            where: {
                id,
            },
        });

    }


    // =========================================================
    // FIND ATTEMPT WITH QUIZ + QUESTIONS
    // =========================================================

    async findByIdWithQuestions(id) {

        return await prisma.quizAttempt.findUnique({

            where: {
                id,
            },

            include: {

                quiz: {

                    include: {

                        questions: {

                            orderBy: {
                                createdAt: "asc",
                            },

                        },

                    },

                },

            },

        });

    }


    // =========================================================
    // UPDATE ATTEMPT
    // =========================================================

    async update(id, data) {

        return await prisma.quizAttempt.update({

            where: {
                id,
            },

            data,

        });

    }


    // =========================================================
    // CREATE SINGLE ANSWER
    // =========================================================

    async createAnswer(data) {

        return await prisma.studentAnswer.create({
            data,
        });

    }


    // =========================================================
    // CREATE MULTIPLE ANSWERS
    // =========================================================

    async createAnswers(data) {

        return await prisma.studentAnswer.createMany({
            data,
        });

    }


    // =========================================================
    // FIND COMPLETED ATTEMPT
    // =========================================================
async findCompletedAttempt(id) {

    const attempt = await prisma.quizAttempt.findUnique({
        where: {
            id,
        },

        include: {
            quiz: {
                include: {
                    questions: {
                        orderBy: {
                            createdAt: "asc",
                        },
                    },
                },
            },
        },
    });

    if (!attempt) {
        return null;
    }

    const studentAnswers =
        await prisma.studentAnswer.findMany({
            where: {
                attemptId: id,
            },

            orderBy: {
                questionId: "asc",
            },
        });

    return {
        ...attempt,
        studentAnswers,
    };
}


    // =========================================================
    // CHECK WHETHER STUDENT ALREADY ATTEMPTED QUIZ
    // =========================================================

    async findByStudentAndQuiz(
        studentId,
        quizId
    ) {

        return await prisma.quizAttempt.findFirst({

            where: {

                studentId,

                quizId,

            },

            orderBy: {

                startedAt: "desc",

            },

        });

    }


    // =========================================================
    // STUDENT DASHBOARD
    // =========================================================

    async getStudentDashboard(studentId) {

        // -----------------------------------------------------
        // ALL COMPLETED ATTEMPTS
        // -----------------------------------------------------

        const completedAttempts =
            await prisma.quizAttempt.findMany({

                where: {

                    studentId,

                    status: "COMPLETED",

                },

                include: {

                    quiz: true,

                },

                orderBy: {

                    submittedAt: "asc",

                },

            });


        // -----------------------------------------------------
        // ALL PUBLISHED QUIZZES
        // -----------------------------------------------------

        const publishedQuizzes =
            await prisma.quiz.findMany({

                where: {

                    isPublished: true,

                },

                select: {

                    id: true,

                },

            });


        // -----------------------------------------------------
        // UNIQUE COMPLETED QUIZ IDS
        // -----------------------------------------------------

        const completedQuizIds = [
            ...new Set(

                completedAttempts.map(
                    (attempt) =>
                        attempt.quizId
                )

            ),
        ];


        // -----------------------------------------------------
        // COMPLETED QUIZZES
        // -----------------------------------------------------

        const completedQuizzes =
            completedQuizIds.length;


        // -----------------------------------------------------
        // AVAILABLE QUIZZES
        // -----------------------------------------------------

        const availableQuizzes =
            publishedQuizzes.filter(

                (quiz) =>
                    !completedQuizIds.includes(
                        quiz.id
                    )

            ).length;


        // -----------------------------------------------------
        // LATEST ATTEMPT FOR EACH QUIZ
        // -----------------------------------------------------

        const latestAttemptByQuiz =
            new Map();


        for (const attempt of completedAttempts) {

            latestAttemptByQuiz.set(
                attempt.quizId,
                attempt
            );

        }


        const uniqueCompletedAttempts =
            Array.from(
                latestAttemptByQuiz.values()
            );


        // -----------------------------------------------------
        // PASSED
        // -----------------------------------------------------

        const passedQuizzes =
            uniqueCompletedAttempts.filter(

                (attempt) =>

                    Number(
                        attempt.score || 0
                    ) >=
                    Number(
                        attempt.quiz.passingMarks || 0
                    )

            ).length;


        // -----------------------------------------------------
        // FAILED
        // -----------------------------------------------------

        const failedQuizzes =
            uniqueCompletedAttempts.length -
            passedQuizzes;


        // -----------------------------------------------------
        // AVERAGE SCORE
        // -----------------------------------------------------

        const scores =
            uniqueCompletedAttempts.map(

                (attempt) =>
                    Number(
                        attempt.score || 0
                    )

            );


        const totalScore =
            scores.reduce(

                (total, score) =>
                    total + score,

                0

            );


        const averageScore =
            scores.length > 0

                ? Number(

                    (
                        totalScore /
                        scores.length

                    ).toFixed(2)

                )

                : 0;


        // -----------------------------------------------------
        // HIGHEST SCORE
        // -----------------------------------------------------

        const highestScore =
            scores.length > 0

                ? Math.max(
                    ...scores
                )

                : 0;


        // -----------------------------------------------------
        // PERFORMANCE GRAPH
        //
        // One point per unique quiz.
        // Latest result is used.
        // -----------------------------------------------------

        const performance =
            uniqueCompletedAttempts.map(

                (attempt) => ({

                    attemptId:
                        attempt.id,

                    quizId:
                        attempt.quizId,

                    quizTitle:
                        attempt.quiz.title,

                    score:
                        Number(
                            attempt.score || 0
                        ),

                    totalMarks:
                        Number(
                            attempt.quiz.totalMarks || 0
                        ),

                    submittedAt:
                        attempt.submittedAt,

                })

            );


        // -----------------------------------------------------
        // FINAL RESPONSE
        // -----------------------------------------------------

        return {

            statistics: {

                availableQuizzes,

                completedQuizzes,

                passedQuizzes,

                failedQuizzes,

                averageScore,

                highestScore,

            },

            performance,

            completedQuizIds,

        };

    }


    // =========================================================
    // GET ALL COMPLETED RESULTS FOR STUDENT
    //
    // We fetch latest-first.
    // Service will keep only the latest result for each quiz.
    // =========================================================

    async getStudentCompletedResults(
        studentId
    ) {

        return await prisma.quizAttempt.findMany({

            where: {

                studentId,

                status: "COMPLETED",

            },

            include: {

                quiz: true,

            },

            orderBy: {

                submittedAt: "desc",

            },

        });

    }

}


export default new QuizAttemptRepository();