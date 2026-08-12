import categoryRepository from "../repositories/category.repository.js";
import ApiError from "../utils/ApiError.js";

class CategoryService {

    async createCategory(data) {

        const existing = await categoryRepository.findByName(data.name);

        if (existing) {
            throw new ApiError(409, "Category already exists.");
        }

        return await categoryRepository.create(data);
    }

    async getAllCategories() {
        return await categoryRepository.findAll();
    }

    async getCategoryById(id) {

        const category = await categoryRepository.findById(id);

        if (!category) {
            throw new ApiError(404, "Category not found.");
        }

        return category;
    }

    async updateCategory(id, data) {

        await this.getCategoryById(id);

        return await categoryRepository.update(id, data);
    }

    async deleteCategory(id) {

        await this.getCategoryById(id);

        return await categoryRepository.delete(id);
    }

}

export default new CategoryService();