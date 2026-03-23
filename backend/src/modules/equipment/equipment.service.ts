import prisma from "../../lib/prisma";
import { ApiError } from "../../utils/ApiError";
import { CreateEquipmentInput, UpdateEquipmentInput } from "./equipment.schema";

export const getAllEquipments = async (filters?: any) => {
    // Gotta implement filtering by status, category, etc. here
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

export const updateEquipment = async (id: string, data: UpdateEquipmentInput) => {
    const existing = await prisma.equipment.findUnique({ where: { id } });
    if (!existing) {
        throw new ApiError(404, "Equipment not found");
    }

    const updated = await prisma.equipment.update({
        where: { id },
        data: data
    });
    return updated;
}

export const deleteEquipment = async (id: string) => {
    const existing = await prisma.equipment.findUnique({ where: { id } });
    if (!existing) {
        throw new ApiError(404, "Equipment not found");
    }
    await prisma.equipment.delete({ where: { id } });
}
