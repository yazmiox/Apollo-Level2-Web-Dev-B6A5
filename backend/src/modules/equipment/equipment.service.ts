import prisma from "../../lib/prisma";
import { ApiError } from "../../utils/ApiError";
import { CreateEquipmentInput } from "./equipment.schema";

export const getAllEquipments = async (filters?: any) => {
    const equipments = await prisma.equipment.findMany({
        where: filters,
        include: { category: true }
    });
    return equipments;
}

export const getEquipmentBySlug = async (slug: string) => {
    const equipment = await prisma.equipment.findUnique({
        where: { slug },
        include: { category: true }
    });
    return equipment;
}

export const createEquipment = async (data: CreateEquipmentInput) => {
    const category = await prisma.category.findUnique({ where: { id: data.categoryId } });
    if (!category) {
        throw new ApiError(400, "Invalid Category ID");
    }

    const equipment = await prisma.equipment.create({
        data: data
    });
    return equipment;
}