import questionRepository from "../repositories/question.repository.js";
import quizRepository from "../repositories/quiz.repository.js";
import ApiError from "../utils/ApiError.js";


class QuestionService {


    // ============================================================
    // CREATE ONE QUESTION
    // ============================================================

    async createQuestion(data) {

        const quiz =
            await quizRepository.findById(
                data.quizId
            );


        if (!quiz) {

            throw new ApiError(
                404,
                "Quiz not found."
            );

        }


        return await questionRepository.create(
            data
        );

    }


    // ============================================================
    // CREATE MULTIPLE QUESTIONS
    // ============================================================

    async createManyQuestions(questions) {

        if (
            !Array.isArray(questions) ||
            questions.length === 0
        ) {

            throw new ApiError(
                400,
                "Questions array is required."
            );

        }


        // --------------------------------------------------------
        // Validate every question
        // --------------------------------------------------------

        for (const question of questions) {

            if (!question.quizId) {

                throw new ApiError(
                    400,
                    "quizId is required for every question."
                );

            }

            if (!question.questionText) {

                throw new ApiError(
                    400,
                    "questionText is required for every question."
                );

            }

            if (!question.optionA) {

                throw new ApiError(
                    400,
                    "optionA is required for every question."
                );

            }

            if (!question.optionB) {

                throw new ApiError(
                    400,
                    "optionB is required for every question."
                );

            }

            if (!question.optionC) {

                throw new ApiError(
                    400,
                    "optionC is required for every question."
                );

            }

            if (!question.optionD) {

                throw new ApiError(
                    400,
                    "optionD is required for every question."
                );

            }

            if (
                !["A", "B", "C", "D"].includes(
                    question.correctAnswer
                )
            ) {

                throw new ApiError(
                    400,
                    "correctAnswer must be A, B, C or D."
                );

            }

            if (
                question.marks === undefined ||
                question.marks === null
            ) {

                throw new ApiError(
                    400,
                    "marks is required for every question."
                );

            }

        }


        // --------------------------------------------------------
        // Get unique quiz IDs
        // --------------------------------------------------------

        const quizIds = [
            ...new Set(
                questions.map(
                    (question) =>
                        question.quizId
                )
            ),
        ];


        // --------------------------------------------------------
        // Check quizzes exist
        // --------------------------------------------------------

        for (const quizId of quizIds) {

            const quiz =
                await quizRepository.findById(
                    quizId
                );


            if (!quiz) {

                throw new ApiError(
                    404,
                    `Quiz not found: ${quizId}`
                );

            }

        }


        // --------------------------------------------------------
        // Insert all questions
        // --------------------------------------------------------

        return await questionRepository.createMany(
            questions
        );

    }


    // ============================================================
    // GET ALL QUESTIONS
    // ============================================================

    async getAllQuestions() {

        return await questionRepository.findAll();

    }


    // ============================================================
    // GET QUESTION BY ID
    // ============================================================

    async getQuestionById(id) {

        const question =
            await questionRepository.findById(
                id
            );


        if (!question) {

            throw new ApiError(
                404,
                "Question not found."
            );

        }


        return question;

    }


    // ============================================================
    // UPDATE QUESTION
    // ============================================================

    async updateQuestion(id, data) {

        await this.getQuestionById(id);


        return await questionRepository.update(
            id,
            data
        );

    }


    // ============================================================
    // DELETE QUESTION
    // ============================================================

    async deleteQuestion(id) {

        await this.getQuestionById(id);


        return await questionRepository.delete(
            id
        );

    }


    // ============================================================
    // RESTORE QUESTION
    // ============================================================

    async restoreQuestion(id) {

        const question =
            await questionRepository.findByIdIncludingDeleted(
                id
            );


        if (!question) {

            throw new ApiError(
                404,
                "Question not found."
            );

        }


        if (!question.isDeleted) {

            throw new ApiError(
                400,
                "Question is already active."
            );

        }


        return await questionRepository.restore(
            id
        );

    }

}


export default new QuestionService();