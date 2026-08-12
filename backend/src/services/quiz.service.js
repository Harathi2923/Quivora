import quizRepository from "../repositories/quiz.repository.js";
import categoryRepository from "../repositories/category.repository.js";
import ApiError from "../utils/ApiError.js";

class QuizService {

    async createQuiz(data) {

        const category = await categoryRepository.findById(data.categoryId);

        if (!category) {
            throw new ApiError(404, "Category not found.");
        }

        return await quizRepository.create(data);
    }

    async getAllQuizzes() {
        return await quizRepository.findAll();
    }

    async getQuizById(id) {

        const quiz = await quizRepository.findById(id);

        if (!quiz) {
            throw new ApiError(404, "Quiz not found.");
        }

        return quiz;
    }

    async updateQuiz(id, data) {

        await this.getQuizById(id);

        return await quizRepository.update(id, data);
    }

    async deleteQuiz(id) {

        await this.getQuizById(id);

        return await quizRepository.delete(id);
    }
}

export default new QuizService();