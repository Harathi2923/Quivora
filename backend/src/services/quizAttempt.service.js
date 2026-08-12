import quizAttemptRepository
    from "../repositories/quizAttempt.repository.js";

import quizRepository
    from "../repositories/quiz.repository.js";

import ApiError
    from "../utils/ApiError.js";


class QuizAttemptService {


    // =========================================================
    // START QUIZ
    // =========================================================

    async startQuiz(
        studentId,
        quizId
    ) {

        const quiz =
            await quizRepository.findById(
                quizId
            );


        if (!quiz) {

            throw new ApiError(
                404,
                "Quiz not found."
            );

        }


        if (!quiz.isPublished) {

            throw new ApiError(
                400,
                "Quiz is not published."
            );

        }


        // -----------------------------------------------------
        // ONE ATTEMPT PER QUIZ
        // -----------------------------------------------------

        const existingAttempt =
            await quizAttemptRepository
                .findByStudentAndQuiz(
                    studentId,
                    quizId
                );


        if (existingAttempt) {

            throw new ApiError(
                400,
                "You have already attempted this quiz. Only one attempt is allowed."
            );

        }


        // -----------------------------------------------------
        // CREATE ATTEMPT
        // -----------------------------------------------------

        const attempt =
            await quizAttemptRepository.create({

                studentId,

                quizId,

            });


        return {

            attemptId:
                attempt.id,

            startedAt:
                attempt.startedAt,

            duration:
                quiz.duration,

        };

    }


    // =========================================================
    // GET QUIZ QUESTIONS
    // =========================================================

    async getQuizQuestions(
        studentId,
        attemptId
    ) {

        const attempt =
            await quizAttemptRepository
                .findByIdWithQuestions(
                    attemptId
                );


        if (!attempt) {

            throw new ApiError(
                404,
                "Quiz attempt not found."
            );

        }


        if (
            attempt.studentId !==
            studentId
        ) {

            throw new ApiError(
                403,
                "You are not authorized to access this quiz attempt."
            );

        }


        if (
            attempt.status !==
            "IN_PROGRESS"
        ) {

            throw new ApiError(
                400,
                "This quiz attempt has already been completed."
            );

        }


        return {

            attemptId:
                attempt.id,

            quizId:
                attempt.quiz.id,

            title:
                attempt.quiz.title,

            duration:
                attempt.quiz.duration,

            questions:

                attempt.quiz.questions.map(
                    (question) => ({

                        id:
                            question.id,

                        questionText:
                            question.questionText,

                        optionA:
                            question.optionA,

                        optionB:
                            question.optionB,

                        optionC:
                            question.optionC,

                        optionD:
                            question.optionD,

                    })
                ),

        };

    }


    // =========================================================
    // SUBMIT QUIZ
    // =========================================================

    async submitQuiz(
        studentId,
        attemptId,
        answers
    ) {

        const attempt =
            await quizAttemptRepository
                .findByIdWithQuestions(
                    attemptId
                );


        if (!attempt) {

            throw new ApiError(
                404,
                "Quiz attempt not found."
            );

        }


        if (
            attempt.studentId !==
            studentId
        ) {

            throw new ApiError(
                403,
                "You are not authorized to submit this quiz attempt."
            );

        }


        if (
            attempt.status !==
            "IN_PROGRESS"
        ) {

            throw new ApiError(
                400,
                "This quiz has already been submitted."
            );

        }


        if (
            !Array.isArray(answers) ||
            answers.length === 0
        ) {

            throw new ApiError(
                400,
                "At least one answer is required."
            );

        }


        let score = 0;

        let correctCount = 0;

        let wrongCount = 0;


        const studentAnswers = [];


        // -----------------------------------------------------
        // CHECK ANSWERS
        // -----------------------------------------------------

        for (
            const answer of answers
        ) {

            const question =
                attempt.quiz.questions.find(

                    (q) =>
                        q.id ===
                        answer.questionId

                );


            if (!question) {

                throw new ApiError(
                    400,
                    `Invalid question ID: ${answer.questionId}`
                );

            }


            const isCorrect =
                question.correctAnswer ===
                answer.selectedAnswer;


            let marksAwarded = 0;


            if (isCorrect) {

                marksAwarded =
                    question.marks;

                score +=
                    question.marks;

                correctCount++;

            } else {

                wrongCount++;


                if (
                    attempt.quiz
                        .negativeMarking
                ) {

                    marksAwarded =
                        -attempt.quiz
                            .negativeMarks;

                    score +=
                        marksAwarded;

                }

            }


            studentAnswers.push({

                attemptId:
                    attempt.id,

                questionId:
                    question.id,

                selectedAnswer:
                    answer.selectedAnswer,

                isCorrect,

                marksAwarded,

            });

        }


        // -----------------------------------------------------
        // PREVENT NEGATIVE SCORE
        // -----------------------------------------------------

        if (score < 0) {

            score = 0;

        }


        // -----------------------------------------------------
        // QUESTION COUNTS
        // -----------------------------------------------------

        const totalQuestions =
            attempt.quiz.questions.length;


        const unansweredCount =
            totalQuestions -
            answers.length;


        // -----------------------------------------------------
        // TIME
        // -----------------------------------------------------

        const submittedAt =
            new Date();


        const startedAt =
            new Date(
                attempt.startedAt
            );


        const timeTaken =
            Math.floor(

                (
                    submittedAt.getTime() -
                    startedAt.getTime()

                ) / 1000

            );


        const allowedTime =
            attempt.quiz.duration *
            60;


        const gracePeriod = 5;


        if (
            timeTaken >
            allowedTime +
            gracePeriod
        ) {

            throw new ApiError(
                400,
                "Quiz time has expired. Your submission cannot be accepted."
            );

        }


        // -----------------------------------------------------
        // SAVE ANSWERS
        // -----------------------------------------------------

        await quizAttemptRepository
            .createAnswers(
                studentAnswers
            );


        // -----------------------------------------------------
        // COMPLETE ATTEMPT
        // -----------------------------------------------------

        const updatedAttempt =
            await quizAttemptRepository
                .update(

                    attempt.id,

                    {

                        score,

                        status:
                            "COMPLETED",

                        submittedAt,

                        timeTaken,

                    }

                );


        // -----------------------------------------------------
        // PASS / FAIL
        // -----------------------------------------------------

        const passed =
            score >=
            attempt.quiz.passingMarks;


        return {

            attemptId:
                updatedAttempt.id,

            quizId:
                attempt.quiz.id,

            quizTitle:
                attempt.quiz.title,

            totalMarks:
                attempt.quiz.totalMarks,

            score,

            passingMarks:
                attempt.quiz.passingMarks,

            result:
                passed
                    ? "PASS"
                    : "FAIL",

            totalQuestions,

            answeredQuestions:
                answers.length,

            unansweredQuestions:
                unansweredCount,

            correctAnswers:
                correctCount,

            wrongAnswers:
                wrongCount,

            timeTaken,

            submittedAt,

        };

    }


    // =========================================================
    // GET SINGLE RESULT
    // =========================================================

   
    async getResult(studentId, attemptId) {

    const attempt =
        await quizAttemptRepository.findCompletedAttempt(
            attemptId
        );

    if (!attempt) {
        throw new ApiError(
            404,
            "Quiz attempt not found."
        );
    }


    // =====================================================
    // CHECK STUDENT OWNERSHIP
    // =====================================================

    if (attempt.studentId !== studentId) {

        throw new ApiError(
            403,
            "You are not authorized to view this result."
        );

    }


    // =====================================================
    // CHECK COMPLETED STATUS
    // =====================================================

    if (attempt.status !== "COMPLETED") {

        throw new ApiError(
            400,
            "Quiz has not been submitted yet."
        );

    }


    // =====================================================
    // PASS / FAIL
    // =====================================================

    const passed =
        Number(attempt.score || 0) >=
        Number(attempt.quiz.passingMarks || 0);


    // =====================================================
    // CREATE ANSWER MAP
    // =====================================================

    const answerMap = new Map();

    for (const answer of attempt.studentAnswers) {

        answerMap.set(
            answer.questionId,
            answer
        );

    }


    // =====================================================
    // QUESTION REVIEW
    // =====================================================

    const questions =
        attempt.quiz.questions.map(
            (question, index) => {

                const studentAnswer =
                    answerMap.get(question.id);


                // -----------------------------------------
                // UNANSWERED QUESTION
                // -----------------------------------------

                if (!studentAnswer) {

                    return {

                        questionNumber: index + 1,

                        questionId: question.id,

                        questionText:
                            question.questionText,

                        optionA:
                            question.optionA,

                        optionB:
                            question.optionB,

                        optionC:
                            question.optionC,

                        optionD:
                            question.optionD,

                        yourAnswer: null,

                        correctAnswer:
                            question.correctAnswer,

                        isCorrect: false,

                        answered: false,

                        marksAwarded: 0,

                        marks:
                            question.marks,

                    };

                }


                // -----------------------------------------
                // ANSWERED QUESTION
                // -----------------------------------------

                return {

                    questionNumber: index + 1,

                    questionId: question.id,

                    questionText:
                        question.questionText,

                    optionA:
                        question.optionA,

                    optionB:
                        question.optionB,

                    optionC:
                        question.optionC,

                    optionD:
                        question.optionD,

                    yourAnswer:
                        studentAnswer.selectedAnswer,

                    correctAnswer:
                        question.correctAnswer,

                    isCorrect:
                        studentAnswer.isCorrect,

                    answered: true,

                    marksAwarded:
                        studentAnswer.marksAwarded,

                    marks:
                        question.marks,

                };

            }
        );


    // =====================================================
    // FINAL RESULT
    // =====================================================

    return {

        attemptId:
            attempt.id,

        quizId:
            attempt.quiz.id,

        quizTitle:
            attempt.quiz.title,

        description:
            attempt.quiz.description,

        totalMarks:
            attempt.quiz.totalMarks,

        score:
            attempt.score,

        passingMarks:
            attempt.quiz.passingMarks,

        result:
            passed
                ? "PASS"
                : "FAIL",

        submittedAt:
            attempt.submittedAt,

        timeTaken:
            attempt.timeTaken,

        totalQuestions:
            questions.length,

        answeredQuestions:
            questions.filter(
                (question) =>
                    question.answered
            ).length,

        unansweredQuestions:
            questions.filter(
                (question) =>
                    !question.answered
            ).length,

        correctAnswers:
            questions.filter(
                (question) =>
                    question.isCorrect
            ).length,

        wrongAnswers:
            questions.filter(
                (question) =>
                    question.answered &&
                    !question.isCorrect
            ).length,

        questions,

    };
}


    // =========================================================
    // STUDENT DASHBOARD
    // =========================================================

    async getStudentDashboard(
        studentId
    ) {

        return await quizAttemptRepository
            .getStudentDashboard(
                studentId
            );

    }


    // =========================================================
    // STUDENT RESULT HISTORY
    //
    // One result per quiz.
    // Latest completed result wins.
    //
    // Pagination is applied AFTER unique quizzes are created.
    // =========================================================

    async getStudentResults(
        studentId,
        page = 1,
        limit = 6
    ) {

        page =
            Math.max(
                Number(page) || 1,
                1
            );


        limit =
            Math.min(
                Math.max(
                    Number(limit) || 6,
                    1
                ),
                20
            );


        const attempts =
            await quizAttemptRepository
                .getStudentCompletedResults(
                    studentId
                );


        // -----------------------------------------------------
        // KEEP ONLY LATEST RESULT FOR EACH QUIZ
        // -----------------------------------------------------

        const latestByQuiz =
            new Map();


        for (
            const attempt of attempts
        ) {

            if (
                !latestByQuiz.has(
                    attempt.quizId
                )
            ) {

                latestByQuiz.set(
                    attempt.quizId,
                    attempt
                );

            }

        }


        const uniqueResults =
            Array.from(
                latestByQuiz.values()
            );


        // -----------------------------------------------------
        // PAGINATION
        // -----------------------------------------------------

        const totalResults =
            uniqueResults.length;


        const totalPages =
            Math.ceil(
                totalResults /
                limit
            );


        const safePage =
            Math.min(
                page,
                Math.max(
                    totalPages,
                    1
                )
            );


        const startIndex =
            (
                safePage -
                1
            ) * limit;


        const paginatedResults =
            uniqueResults.slice(

                startIndex,

                startIndex +
                limit

            );


        // -----------------------------------------------------
        // FORMAT RESULTS
        // -----------------------------------------------------

        const results =
            paginatedResults.map(
                (attempt) => {

                    const score =
                        Number(
                            attempt.score ||
                            0
                        );


                    const passingMarks =
                        Number(
                            attempt.quiz
                                .passingMarks ||
                            0
                        );


                    return {

                        attemptId:
                            attempt.id,

                        quizId:
                            attempt.quizId,

                        quizTitle:
                            attempt.quiz.title,

                        description:
                            attempt.quiz
                                .description,

                        totalMarks:
                            attempt.quiz
                                .totalMarks,

                        score,

                        passingMarks,

                        result:
                            score >=
                            passingMarks
                                ? "PASS"
                                : "FAIL",

                        submittedAt:
                            attempt.submittedAt,

                        timeTaken:
                            attempt.timeTaken,

                    };

                }
            );


        return {

            results,

            pagination: {

                currentPage:
                    safePage,

                totalPages,

                totalResults,

                pageSize:
                    limit,

                hasNextPage:
                    safePage <
                    totalPages,

                hasPreviousPage:
                    safePage > 1,

            },

        };

    }

}


export default new QuizAttemptService();