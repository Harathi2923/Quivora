import prisma from "../prisma/client.js";

class CategoryRepository {

    async create(data) {
        return await prisma.category.create({
            data,
        });
    }

    async findAll() {
        return await prisma.category.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });
    }

    async findById(id) {
        return await prisma.category.findUnique({
            where: { id },
        });
    }

    async findByName(name) {
        return await prisma.category.findUnique({
            where: { name },
        });
    }

    async update(id, data) {
        return await prisma.category.update({
            where: { id },
            data,
        });
    }

    async delete(id) {
        return await prisma.category.delete({
            where: { id },
        });
    }

}

export default new CategoryRepository();