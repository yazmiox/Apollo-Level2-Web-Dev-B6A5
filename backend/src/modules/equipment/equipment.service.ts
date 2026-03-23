import prisma from "../../lib/prisma";

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