import adminRepository
    from "../repositories/admin.repository.js";

import ApiError from "../utils/ApiError.js";

class AdminService {

    // =========================================================
    // GET ADMIN DASHBOARD
    // =========================================================

    async getDashboard() {

        // =====================================================
        // BASIC COUNTS
        // =====================================================

        const [
            totalStudents,
            activeStudents,
            totalQuizzes,
            publishedQuizzes,
            draftQuizzes,
            totalCategories,
            activeCategories,
            totalQuestions,
            completedAttempts,
            inProgressAttempts,
        ] = await Promise.all([

            adminRepository.countStudents(),

            adminRepository.countActiveStudents(),

            adminRepository.countQuizzes(),

            adminRepository.countPublishedQuizzes(),

            adminRepository.countDraftQuizzes(),

            adminRepository.countCategories(),

            adminRepository.countActiveCategories(),

            adminRepository.countQuestions(),

            adminRepository.countCompletedAttempts(),

            adminRepository.countInProgressAttempts(),

        ]);


        // =====================================================
        // COMPLETED ATTEMPTS
        // =====================================================

        const attempts =
            await adminRepository.findCompletedAttempts();


        // =====================================================
        // PASS / FAIL CALCULATION
        // =====================================================

        let passedAttempts = 0;
        let failedAttempts = 0;

        let totalScore = 0;
        let totalMarks = 0;


        for (const attempt of attempts) {

            const score =
                Number(attempt.score || 0);

            const quizTotalMarks =
                Number(
                    attempt.quiz?.totalMarks || 0
                );

            const passingMarks =
                Number(
                    attempt.quiz?.passingMarks || 0
                );


            totalScore += score;

            totalMarks += quizTotalMarks;


            if (score >= passingMarks) {

                passedAttempts++;

            } else {

                failedAttempts++;

            }

        }


        // =====================================================
        // AVERAGE SCORE
        // =====================================================

        const averageScore =
            attempts.length > 0
                ? Number(
                    (
                        totalScore /
                        attempts.length
                    ).toFixed(2)
                )
                : 0;


        // =====================================================
        // AVERAGE PERCENTAGE
        // =====================================================

        const averagePercentage =
            totalMarks > 0
                ? Number(
                    (
                        (totalScore /
                            totalMarks) *
                        100
                    ).toFixed(2)
                )
                : 0;


        // =====================================================
        // PASS RATE
        // =====================================================

        const passRate =
            attempts.length > 0
                ? Number(
                    (
                        (passedAttempts /
                            attempts.length) *
                        100
                    ).toFixed(2)
                )
                : 0;


        // =====================================================
        // FAIL RATE
        // =====================================================

        const failRate =
            attempts.length > 0
                ? Number(
                    (
                        (failedAttempts /
                            attempts.length) *
                        100
                    ).toFixed(2)
                )
                : 0;


        // =====================================================
        // RECENT STUDENTS
        // =====================================================

        const recentStudents =
            await adminRepository.findRecentStudents(5);


        // =====================================================
        // RECENT QUIZZES
        // =====================================================

        const recentQuizzes =
            await adminRepository.findRecentQuizzes(5);


        // =====================================================
        // QUIZ PARTICIPATION
        // =====================================================

        const quizParticipation =
            await adminRepository.getQuizParticipation();


        // =====================================================
        // CATEGORY DISTRIBUTION
        // =====================================================

        const categoryDistribution =
            await adminRepository.getCategoryDistribution();


        // =====================================================
        // FORMAT QUIZ PARTICIPATION
        // =====================================================

        const formattedQuizParticipation =
            quizParticipation.map(
                (quiz) => ({

                    quizId: quiz.id,

                    quizTitle: quiz.title,

                    participants:
                        quiz._count.attempts,

                })
            );


        // =====================================================
        // FORMAT CATEGORY DISTRIBUTION
        // =====================================================

        const formattedCategoryDistribution =
            categoryDistribution.map(
                (category) => ({

                    categoryId: category.id,

                    categoryName: category.name,

                    quizCount:
                        category._count.quizzes,

                })
            );


        // =====================================================
        // FORMAT RECENT STUDENTS
        // =====================================================

        const formattedRecentStudents =
            recentStudents.map(
                (student) => ({

                    id: student.id,

                    firstName:
                        student.firstName,

                    lastName:
                        student.lastName,

                    email:
                        student.email,

                    profileImage:
                        student.profileImage,

                    isActive:
                        student.isActive,

                    createdAt:
                        student.createdAt,

                })
            );


        // =====================================================
        // FORMAT RECENT QUIZZES
        // =====================================================

        const formattedRecentQuizzes =
            recentQuizzes.map(
                (quiz) => ({

                    id: quiz.id,

                    title: quiz.title,

                    difficulty:
                        quiz.difficulty,

                    duration:
                        quiz.duration,

                    totalMarks:
                        quiz.totalMarks,

                    passingMarks:
                        quiz.passingMarks,

                    isPublished:
                        quiz.isPublished,

                    category:
                        quiz.category,

                    questionCount:
                        quiz._count.questions,

                    attemptCount:
                        quiz._count.attempts,

                    createdAt:
                        quiz.createdAt,

                })
            );


        // =====================================================
        // FINAL DASHBOARD RESPONSE
        // =====================================================

        return {

            statistics: {

                totalStudents,

                activeStudents,

                totalQuizzes,

                publishedQuizzes,

                draftQuizzes,

                totalCategories,

                activeCategories,

                totalQuestions,

                completedAttempts,

                inProgressAttempts,

                passedAttempts,

                failedAttempts,

                averageScore,

                averagePercentage,

                passRate,

                failRate,

            },


            charts: {

                quizParticipation:
                    formattedQuizParticipation,

                categoryDistribution:
                    formattedCategoryDistribution,

            },


            recent: {

                students:
                    formattedRecentStudents,

                quizzes:
                    formattedRecentQuizzes,

            },

        };

    }
    // =========================================================
// GET ALL STUDENTS
// =========================================================

async getStudents({
    search = "",
    status = "ALL",
    verified = "ALL",
} = {}) {


    const [
        totalStudents,
        activeStudents,
        inactiveStudents,
        verifiedStudents,
    ] = await Promise.all([

        adminRepository.countStudents(),

        adminRepository.countActiveStudents(),

        adminRepository.countInactiveStudents(),

        adminRepository.countVerifiedStudents(),

    ]);


    const students =
        await adminRepository.findAllStudents({

            search,

            status,

            verified,

        });


    const formattedStudents =
        students.map((student) => ({

            id: student.id,

            firstName:
                student.firstName,

            lastName:
                student.lastName,

            fullName:
                `${student.firstName} ${student.lastName}`,

            email:
                student.email,

            phone:
                student.phone,

            dateOfBirth:
                student.dateOfBirth,

            profileImage:
                student.profileImage,

            isActive:
                student.isActive,

            isVerified:
                student.isVerified,

            createdAt:
                student.createdAt,

            updatedAt:
                student.updatedAt,

            attemptCount:
                student._count.attempts,

        }));


    return {

        statistics: {

            totalStudents,

            activeStudents,

            inactiveStudents,

            verifiedStudents,

        },

        students:
            formattedStudents,

    };

}


// =========================================================
// GET STUDENT BY ID
// =========================================================

async getStudentById(id) {

    const student =
        await adminRepository.findStudentById(id);


    if (!student) {

        throw new ApiError(
            404,
            "Student not found."
        );

    }


    const completedAttempts =
        student.attempts.filter(
            (attempt) =>
                attempt.status === "COMPLETED"
        );


    let totalScore = 0;

    let passedAttempts = 0;

    let failedAttempts = 0;


    for (
        const attempt
        of completedAttempts
    ) {

        const score =
            Number(attempt.score || 0);

        const passingMarks =
            Number(
                attempt.quiz?.passingMarks || 0
            );


        totalScore += score;


        if (
            score >= passingMarks
        ) {

            passedAttempts++;

        } else {

            failedAttempts++;

        }

    }


    const averageScore =
        completedAttempts.length > 0
            ? Number(
                (
                    totalScore /
                    completedAttempts.length
                ).toFixed(2)
            )
            : 0;


    return {

        student: {

            id:
                student.id,

            firstName:
                student.firstName,

            lastName:
                student.lastName,

            fullName:
                `${student.firstName} ${student.lastName}`,

            email:
                student.email,

            phone:
                student.phone,

            dateOfBirth:
                student.dateOfBirth,

            profileImage:
                student.profileImage,

            isActive:
                student.isActive,

            isVerified:
                student.isVerified,

            createdAt:
                student.createdAt,

        },


        statistics: {

            totalAttempts:
                student.attempts.length,

            completedAttempts:
                completedAttempts.length,

            inProgressAttempts:
                student.attempts.length -
                completedAttempts.length,

            passedAttempts,

            failedAttempts,

            averageScore,

        },


        recentAttempts:
            student.attempts.slice(0, 10),

    };

}

}

export default new AdminService();