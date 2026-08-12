import leaderboardRepository from "../repositories/leaderboard.repository.js";
import quizRepository from "../repositories/quiz.repository.js";
import ApiError from "../utils/ApiError.js";


class LeaderboardService {


    // ============================================================
    // GET LEADERBOARD FOR ONE QUIZ
    // ============================================================

    async getLeaderboard(
        quizId,
        studentId,
        role,
        page = 1,
        limit = 10
    ) {

        const quiz =
            await quizRepository.findById(quizId);


        if (!quiz) {

            throw new ApiError(
                404,
                "Quiz not found."
            );

        }


        // ========================================================
        // STUDENT PARTICIPATION CHECK
        // ========================================================

        if (role === "STUDENT") {

            const studentAttempt =
                await leaderboardRepository.findStudentAttempt(
                    studentId,
                    quizId
                );


            if (!studentAttempt) {

                throw new ApiError(
                    403,
                    "You have not participated in this quiz."
                );

            }

        }


        // ========================================================
        // GET COMPLETED ATTEMPTS
        // ========================================================

        const attempts =
            await leaderboardRepository
                .findCompletedAttemptsByQuiz(
                    quizId
                );


        // ========================================================
        // KEEP BEST ATTEMPT PER STUDENT
        //
        // This also protects us because your database currently
        // contains old duplicate attempts from testing.
        // ========================================================

        const bestAttemptsByStudent =
            new Map();


        for (const attempt of attempts) {

            const existing =
                bestAttemptsByStudent.get(
                    attempt.studentId
                );


            if (!existing) {

                bestAttemptsByStudent.set(
                    attempt.studentId,
                    attempt
                );

                continue;

            }


            if (
                Number(attempt.score) >
                Number(existing.score)
            ) {

                bestAttemptsByStudent.set(
                    attempt.studentId,
                    attempt
                );

            } else if (

                Number(attempt.score) ===
                Number(existing.score)

                &&

                Number(attempt.timeTaken || 0) <
                Number(existing.timeTaken || 0)

            ) {

                bestAttemptsByStudent.set(
                    attempt.studentId,
                    attempt
                );

            }

        }


        // ========================================================
        // SORT FINAL LEADERBOARD
        // ========================================================

        const uniqueAttempts =
            Array.from(
                bestAttemptsByStudent.values()
            );


        uniqueAttempts.sort((a, b) => {

            if (
                Number(b.score) !==
                Number(a.score)
            ) {

                return (
                    Number(b.score) -
                    Number(a.score)
                );

            }


            return (
                Number(a.timeTaken || 0) -
                Number(b.timeTaken || 0)
            );

        });


        // ========================================================
        // TOTAL PARTICIPANTS
        // ========================================================

        const totalParticipants =
            uniqueAttempts.length;


        // ========================================================
        // FIND CURRENT STUDENT RANK
        // ========================================================

        const studentIndex =
            uniqueAttempts.findIndex(
                (attempt) =>
                    attempt.studentId === studentId
            );


        const myRank =
            studentIndex === -1
                ? null
                : studentIndex + 1;


        const myAttempt =
            studentIndex === -1
                ? null
                : uniqueAttempts[studentIndex];


        // ========================================================
        // PAGINATION
        // ========================================================

        const safePage =
            Math.max(
                Number(page) || 1,
                1
            );


        const safeLimit =
            Math.min(
                Math.max(
                    Number(limit) || 10,
                    1
                ),
                50
            );


        const totalPages =
            Math.max(
                Math.ceil(
                    totalParticipants /
                    safeLimit
                ),
                1
            );


        const currentPage =
            Math.min(
                safePage,
                totalPages
            );


        const startIndex =
            (currentPage - 1) *
            safeLimit;


        const paginatedAttempts =
            uniqueAttempts.slice(
                startIndex,
                startIndex + safeLimit
            );


        // ========================================================
        // GET STUDENT INFORMATION
        // ========================================================

        const studentIds =
            paginatedAttempts.map(
                (attempt) =>
                    attempt.studentId
            );


        // Make sure current student is also available
        // when calculating/displaying their information.

        if (
            studentId &&
            !studentIds.includes(studentId)
        ) {

            studentIds.push(studentId);

        }


        const users =
            await leaderboardRepository.findUsersByIds(
                studentIds
            );


        const userMap =
            new Map(
                users.map(
                    (user) => [
                        user.id,
                        user,
                    ]
                )
            );


        // ========================================================
        // CREATE LEADERBOARD RESPONSE
        // ========================================================

        const leaderboard =
            paginatedAttempts.map(
                (attempt) => {

                    const student =
                        userMap.get(
                            attempt.studentId
                        );


                    return {

                        rank:
                            uniqueAttempts.findIndex(
                                (item) =>
                                    item.studentId ===
                                    attempt.studentId
                            ) + 1,

                        studentId:
                            attempt.studentId,

                        firstName:
                            student?.firstName || "",

                        lastName:
                            student?.lastName || "",

                        email:
                            student?.email || "",

                        score:
                            Number(
                                attempt.score || 0
                            ),

                        totalMarks:
                            Number(
                                quiz.totalMarks || 0
                            ),

                        submittedAt:
                            attempt.submittedAt,

                        timeTaken:
                            Number(
                                attempt.timeTaken || 0
                            ),

                        isCurrentStudent:
                            attempt.studentId ===
                            studentId,

                    };

                }
            );


        // ========================================================
        // FINAL RESPONSE
        // ========================================================

        return {

            quizId:
                quiz.id,

            quizTitle:
                quiz.title,

            description:
                quiz.description,

            totalMarks:
                quiz.totalMarks,

            passingMarks:
                quiz.passingMarks,

            participants:
                totalParticipants,

            myRank,

            myScore:
                myAttempt
                    ? Number(
                        myAttempt.score || 0
                    )
                    : null,

            myTimeTaken:
                myAttempt
                    ? Number(
                        myAttempt.timeTaken || 0
                    )
                    : null,

            leaderboard,

            pagination: {

                currentPage,

                totalPages,

                totalResults:
                    totalParticipants,

                pageSize:
                    safeLimit,

                hasNextPage:
                    currentPage <
                    totalPages,

                hasPreviousPage:
                    currentPage > 1,

            },

        };

    }


    // ============================================================
    // GET QUIZZES PARTICIPATED BY CURRENT STUDENT
    // ============================================================

    async getMyLeaderboards(studentId) {

        const attempts =
            await leaderboardRepository
                .findCompletedQuizzesByStudent(
                    studentId
                );


        // ========================================================
        // UNIQUE QUIZZES
        // ========================================================

        const uniqueQuizMap =
            new Map();


        for (const attempt of attempts) {

            if (
                !uniqueQuizMap.has(
                    attempt.quizId
                )
            ) {

                uniqueQuizMap.set(
                    attempt.quizId,
                    attempt.quiz
                );

            }

        }


        const quizzes =
            Array.from(
                uniqueQuizMap.values()
            );


        // ========================================================
        // CREATE CARD DATA
        // ========================================================

        const leaderboardCards = [];


        for (const quiz of quizzes) {

            const leaderboard =
                await this.getLeaderboard(
                    quiz.id,
                    studentId,
                    "STUDENT",
                    1,
                    10
                );


            leaderboardCards.push({

                quizId:
                    quiz.id,

                quizTitle:
                    quiz.title,

                description:
                    quiz.description,

                totalMarks:
                    quiz.totalMarks,

                passingMarks:
                    quiz.passingMarks,

                duration:
                    quiz.duration,

                participants:
                    leaderboard.participants,

                myRank:
                    leaderboard.myRank,

                myScore:
                    leaderboard.myScore,

                myTimeTaken:
                    leaderboard.myTimeTaken,

            });

        }


        return {

            quizzes:
                leaderboardCards,

            totalQuizzes:
                leaderboardCards.length,

        };

    }

}


export default new LeaderboardService();