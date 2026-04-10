import { randomUUID } from "node:crypto";
import prisma from "../../lib/prisma";
import { getObjectUrl, getPutObjectUrl } from "../../lib/s3";
import { ApiError } from "../../utils/ApiError";
import {
    CreateEquipmentInput, UpdateEquipmentInput, CreateEquipmentImageUploadInput
} from "./equipment.schema";
import { extname } from "node:path";
import { EquipmentWhereInput } from "../../generated/prisma/models";
import { EquipmentStatus } from "../../generated/prisma/enums";

export const getAllEquipments = async (params: {
    q?: string,
    category?: string,
    status?: EquipmentStatus | "all",
    sort?: string,
    page?: number | string,
    limit?: number | string,
    isFeatured?: boolean,
    vendorId?: string,
} = {}) => {
    const pageNum = Number(params.page) || 1;
    const limitNum = Number(params.limit) || 9;
    const skip = (pageNum - 1) * limitNum;

    const { q, category, status, sort, isFeatured, vendorId } = params;

    const where: EquipmentWhereInput = {};

    if (q) {
        where.OR = [
            { name: { contains: q, mode: "insensitive" } },
            { category: { name: { contains: q, mode: "insensitive" } } },
        ];
    }

    if (isFeatured) {
        where.isFeatured = isFeatured;
    }

    if (vendorId) {
        where.vendorId = vendorId;
    }

    if (category && category !== "all") {
        const categoryData = await prisma.category.findUnique({ where: { slug: category } });
        where.categoryId = categoryData ? categoryData.id : "";
    }

    if (status && status !== "all") {
        where.status = status;
    }

    const orderBy: any = {};
    if (sort === "price-asc") orderBy.rentalRate = "asc";
    else if (sort === "price-desc") orderBy.rentalRate = "desc";
    else if (sort === "name-asc") orderBy.name = "asc";
    else orderBy.updatedAt = "desc";

    const [equipments, total, ratings] = await Promise.all([
        prisma.equipment.findMany({
            where,
            include: {
                category: true,
                vendor: { select: { id: true, name: true, image: true } },
                _count: { select: { reviews: true } }
            },
            orderBy,
            skip,
            take: limitNum,
        }),
        prisma.equipment.count({ where }),
        prisma.review.groupBy({
            by: ['equipmentId'],
            _avg: { rating: true }
        })
    ]);

    const equipmentsWithDetails = await Promise.all(
        equipments.map(async (e) => {
            const imageUrl = await getObjectUrl(e.imageKey);
            const avgRating = ratings.find(r => r.equipmentId === e.id)?._avg.rating || 0;
            return {
                ...e,
                imageUrl,
                rating: avgRating,
                reviewCount: e._count.reviews
            };
        })
    );

    return {
        data: equipmentsWithDetails,
        metadata: {
            total,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(total / limitNum)
        }
    };
}

export const getEquipmentBySlug = async (slug: string) => {
    const equipment = await prisma.equipment.findUnique({
        where: { slug },
        include: {
            category: true,
            vendor: { select: { id: true, name: true, image: true, createdAt: true } },
            _count: {
                select: { reviews: true }
            }
        }
    });

    if (!equipment) {
        throw new ApiError(404, "Equipment not found");
    }

    // Get vendor's listing count if equipment has a vendor
    let vendorListingCount = 0;
    if (equipment.vendorId) {
        vendorListingCount = await prisma.equipment.count({
            where: { vendorId: equipment.vendorId }
        });
    }

    const [ratingAggregate, reviews, equipmentImageUrl, relatedEquipments] = await Promise.all([
        prisma.review.aggregate({
            where: { equipmentId: equipment.id },
            _avg: { rating: true }
        }),
        prisma.review.findMany({
            where: { equipmentId: equipment.id },
            include: { user: { select: { name: true, image: true } } },
            orderBy: { createdAt: "desc" }
        }),
        getObjectUrl(equipment.imageKey),
        prisma.equipment.findMany({
            where: {
                categoryId: equipment.categoryId,
                NOT: { id: equipment.id },
            },
            take: 3,
            include: { category: true }
        })
    ]);

    const relatedWithUrls = await Promise.all(
        relatedEquipments.map(async (e) => ({
            ...e,
            imageUrl: await getObjectUrl(e.imageKey),
        }))
    );

    return {
        ...equipment,
        imageUrl: equipmentImageUrl,
        rating: ratingAggregate._avg.rating || 0,
        reviewCount: equipment._count.reviews,
        reviews,
        related: relatedWithUrls,
        vendorListingCount,
    };
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

export const createEquipment = async (data: CreateEquipmentInput & { vendorId?: string | null }) => {
    const category = await prisma.category.findUnique({ where: { id: data.categoryId } });
    if (!category) {
        throw new ApiError(400, "Invalid Category ID");
    }

    const equipment = await prisma.equipment.create({
        data: data as any
    });
    const equipmentImageUrl = await getObjectUrl(equipment.imageKey)
    return { ...equipment, imageUrl: equipmentImageUrl };
}

export const updateEquipment = async (id: string, data: UpdateEquipmentInput) => {
    const existing = await prisma.equipment.findUnique({ where: { id } });
    if (!existing) {
        throw new ApiError(404, "Equipment not found");
    }

    const updated = await prisma.equipment.update({
        where: { id },
        data: data as any
    });
    const equipmentImageUrl = await getObjectUrl(updated.imageKey)
    return { ...updated, imageUrl: equipmentImageUrl };
}

export const deleteEquipment = async (id: string) => {
    const existing = await prisma.equipment.findUnique({ where: { id } });
    if (!existing) {
        throw new ApiError(404, "Equipment not found");
    }
    await prisma.equipment.delete({ where: { id } });
}

/** Ensures a vendor owns the given equipment. Throws 403 if not. */
export const ensureVendorOwnership = async (equipmentId: string, vendorId: string) => {
    const equipment = await prisma.equipment.findUnique({ where: { id: equipmentId } });
    if (!equipment) {
        throw new ApiError(404, "Equipment not found");
    }
    if (equipment.vendorId !== vendorId) {
        throw new ApiError(403, "You can only manage your own equipment");
    }
}
