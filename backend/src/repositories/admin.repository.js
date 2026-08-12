import prisma from "../prisma/client.js";

class AdminRepository {

    // =========================================================
    // TOTAL STUDENTS
    // =========================================================

    async countStudents() {

        return await prisma.user.count({
            where: {
                role: "STUDENT",
            },
        });

    }


    // =========================================================
    // ACTIVE STUDENTS
    // =========================================================

    async countActiveStudents() {

        return await prisma.user.count({
            where: {
                role: "STUDENT",
                isActive: true,
            },
        });

    }


    // =========================================================
    // TOTAL QUIZZES
    // =========================================================

    async countQuizzes() {

        return await prisma.quiz.count();

    }


    // =========================================================
    // PUBLISHED QUIZZES
    // =========================================================

    async countPublishedQuizzes() {

        return await prisma.quiz.count({
            where: {
                isPublished: true,
            },
        });

    }


    // =========================================================
    // DRAFT QUIZZES
    // =========================================================

    async countDraftQuizzes() {

        return await prisma.quiz.count({
            where: {
                isPublished: false,
            },
        });

    }


    // =========================================================
    // TOTAL CATEGORIES
    // =========================================================

    async countCategories() {

        return await prisma.category.count();

    }


    // =========================================================
    // ACTIVE CATEGORIES
    // =========================================================

    async countActiveCategories() {

        return await prisma.category.count({
            where: {
                isActive: true,
            },
        });

    }


    // =========================================================
    // TOTAL QUESTIONS
    // =========================================================

    async countQuestions() {

        return await prisma.question.count();

    }


    // =========================================================
    // TOTAL COMPLETED ATTEMPTS
    // =========================================================

    async countCompletedAttempts() {

        return await prisma.quizAttempt.count({
            where: {
                status: "COMPLETED",
            },
        });

    }


    // =========================================================
    // TOTAL IN-PROGRESS ATTEMPTS
    // =========================================================

    async countInProgressAttempts() {

        return await prisma.quizAttempt.count({
            where: {
                status: "IN_PROGRESS",
            },
        });

    }


    // =========================================================
    // COMPLETED ATTEMPTS WITH QUIZ INFORMATION
    // =========================================================

    async findCompletedAttempts() {

        return await prisma.quizAttempt.findMany({

            where: {
                status: "COMPLETED",
            },

            select: {
                id: true,
                score: true,
                submittedAt: true,
                timeTaken: true,

                quiz: {
                    select: {
                        id: true,
                        title: true,
                        totalMarks: true,
                        passingMarks: true,
                    },
                },

                student: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
            },

            orderBy: {
                submittedAt: "desc",
            },

        });

    }


    // =========================================================
    // RECENT STUDENTS
    // =========================================================

    async findRecentStudents(limit = 5) {

        return await prisma.user.findMany({

            where: {
                role: "STUDENT",
            },

            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                profileImage: true,
                isActive: true,
                createdAt: true,
            },

            orderBy: {
                createdAt: "desc",
            },

            take: limit,

        });

    }


    // =========================================================
    // RECENT QUIZZES
    // =========================================================

    async findRecentQuizzes(limit = 5) {

        return await prisma.quiz.findMany({

            select: {
                id: true,
                title: true,
                difficulty: true,
                totalMarks: true,
                passingMarks: true,
                duration: true,
                isPublished: true,
                createdAt: true,

                category: {
                    select: {
                        id: true,
                        name: true,
                    },
                },

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

            take: limit,

        });

    }


    // =========================================================
    // QUIZ PARTICIPATION
    // =========================================================

    async getQuizParticipation() {

        return await prisma.quiz.findMany({

            select: {
                id: true,
                title: true,

                _count: {
                    select: {
                        attempts: true,
                    },
                },
            },

            orderBy: {
                attempts: {
                    _count: "desc",
                },
            },

            take: 10,

        });

    }


    // =========================================================
    // CATEGORY QUIZ DISTRIBUTION
    // =========================================================

    async getCategoryDistribution() {

        return await prisma.category.findMany({

            select: {
                id: true,
                name: true,

                _count: {
                    select: {
                        quizzes: true,
                    },
                },
            },

            orderBy: {
                name: "asc",
            },

        });

    }

    // =========================================================
// STUDENT STATISTICS
// =========================================================

async countVerifiedStudents() {

    return await prisma.user.count({
        where: {
            role: "STUDENT",
            isVerified: true,
        },
    });

}


// =========================================================
// INACTIVE STUDENTS
// =========================================================

async countInactiveStudents() {

    return await prisma.user.count({
        where: {
            role: "STUDENT",
            isActive: false,
        },
    });

}


// =========================================================
// GET ALL STUDENTS
// =========================================================

async findAllStudents({
    search = "",
    status = "ALL",
    verified = "ALL",
} = {}) {

    const where = {
        role: "STUDENT",
    };


    // =====================================================
    // SEARCH
    // =====================================================

    if (search.trim()) {

        where.OR = [

            {
                firstName: {
                    contains: search.trim(),
                    mode: "insensitive",
                },
            },

            {
                lastName: {
                    contains: search.trim(),
                    mode: "insensitive",
                },
            },

            {
                email: {
                    contains: search.trim(),
                    mode: "insensitive",
                },
            },

        ];

    }


    // =====================================================
    // ACTIVE / INACTIVE
    // =====================================================

    if (status === "ACTIVE") {

        where.isActive = true;

    }

    if (status === "INACTIVE") {

        where.isActive = false;

    }


    // =====================================================
    // VERIFIED / UNVERIFIED
    // =====================================================

    if (verified === "VERIFIED") {

        where.isVerified = true;

    }

    if (verified === "UNVERIFIED") {

        where.isVerified = false;

    }


    return await prisma.user.findMany({

        where,

        select: {

            id: true,

            firstName: true,

            lastName: true,

            email: true,

            phone: true,

            dateOfBirth: true,

            profileImage: true,

            isActive: true,

            isVerified: true,

            createdAt: true,

            updatedAt: true,

            _count: {

                select: {

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
// GET STUDENT BY ID
// =========================================================

async findStudentById(id) {

    return await prisma.user.findFirst({

        where: {

            id,

            role: "STUDENT",

        },

        select: {

            id: true,

            firstName: true,

            lastName: true,

            email: true,

            phone: true,

            dateOfBirth: true,

            profileImage: true,

            isActive: true,

            isVerified: true,

            createdAt: true,

            updatedAt: true,

            attempts: {

                select: {

                    id: true,

                    score: true,

                    status: true,

                    startedAt: true,

                    submittedAt: true,

                    timeTaken: true,

                    quiz: {

                        select: {

                            id: true,

                            title: true,

                            difficulty: true,

                            totalMarks: true,

                            passingMarks: true,

                        },

                    },

                },

                orderBy: {

                    createdAt: "desc",

                },

            },

        },

    });

}

}

export default new AdminRepository();