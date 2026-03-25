import { randomUUID } from "node:crypto";
import prisma from "../../lib/prisma";
import { getPutObjectUrl } from "../../lib/s3";
import { ApiError } from "../../utils/ApiError";
import {
    CreateEquipmentInput, UpdateEquipmentInput, CreateEquipmentImageUploadInput
} from "./equipment.schema";
import { extname } from "node:path";

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

export const createEquipmentImageUpload = async (data: CreateEquipmentImageUploadInput) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/avif"];

    if (!allowedTypes.includes(data.contentType)) {
        throw new ApiError(400, "Invalid image type");
    }

    if (data.size > 5 * 1024 * 1024) {
        throw new ApiError(400, "Image must be 5MB or smaller");
    }

    const extensionMap: Record<string, string> = {
        "image/jpeg": ".jpg",
        "image/png": ".png",
        "image/webp": ".webp",
        "image/avif": ".avif",
    };

    const extension = extname(data.fileName) || extensionMap[data.contentType] || "";
    const key = `equipment/${randomUUID()}${extension}`;

    const uploadUrl = await getPutObjectUrl({
        Key: key,
        ContentType: data.contentType,
    });

    return { key, uploadUrl };
};

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
