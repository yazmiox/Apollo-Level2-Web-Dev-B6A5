import prisma from "../../lib/prisma";
import { ApiError } from "../../utils/ApiError";
import { CreateCategoryInput, UpdateCategoryInput } from "./category.schema";

export const getAllCategories = async (q?: string) => {
    const categories = await prisma.category.findMany({
        where: q ? {
            OR: [
                { name: { contains: q, mode: "insensitive" } },
                { description: { contains: q, mode: "insensitive" } },
            ]
        } : {}
    });
    return categories;
}

export const getCategoryBySlug = async (slug: string) => {
    const category = await prisma.category.findUnique({ where: { slug } });
    return category;
}

export const createCategory = async (data: CreateCategoryInput) => {
    const category = await prisma.category.create({ data });
    return category;
}

export const updateCategory = async (id: string, data: UpdateCategoryInput) => {
    const existingCategory = await prisma.category.findUnique({ where: { id } });
    if (!existingCategory) {
        throw new ApiError(404, "Category not found");
    }
    const category = await prisma.category.update({ where: { id }, data });
    return category;
}

export const deleteCategory = async (id: string) => {
    const existingCategory = await prisma.category.findUnique({ where: { id } });
    if (!existingCategory) {
        throw new ApiError(404, "Category not found");
    }
    await prisma.category.delete({ where: { id } });
}