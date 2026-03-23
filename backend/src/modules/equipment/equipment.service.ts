import prisma from "../../lib/prisma";

export const getAllEquipments = async (filters?: any) => {
    const equipments = await prisma.equipment.findMany({
        where: filters,
        include: { category: true }
    });
    return equipments;
}