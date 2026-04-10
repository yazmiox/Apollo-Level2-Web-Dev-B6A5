import { Router, Request, Response, NextFunction } from "express";
import prisma from "../../lib/prisma";
import { ApiError } from "../../utils/ApiError";
import { getObjectUrl } from "../../lib/s3";

const router = Router();

// Public: List all vendors with their listing counts and ratings
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const vendors = await prisma.user.findMany({
            where: { role: "vendor" },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                createdAt: true,
                _count: { select: { vendorEquipments: true } },
            },
            orderBy: { createdAt: "asc" },
        });

        // Get average ratings for each vendor's equipment
        const vendorStats = await Promise.all(
            vendors.map(async (vendor) => {
                const avgRating = await prisma.review.aggregate({
                    where: { equipment: { vendorId: vendor.id } },
                    _avg: { rating: true },
                    _count: { rating: true },
                });

                return {
                    id: vendor.id,
                    name: vendor.name,
                    email: vendor.email,
                    image: vendor.image,
                    createdAt: vendor.createdAt,
                    totalListings: vendor._count.vendorEquipments,
                    avgRating: avgRating._avg.rating || 0,
                    totalReviews: avgRating._count.rating,
                };
            })
        );

        res.status(200).json({ success: true, message: "Vendors fetched successfully", data: vendorStats });
    } catch (error) {
        next(error);
    }
});

// Public: Get vendor profile with their equipment listings
router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const vendor = await prisma.user.findUnique({
            where: { id, role: "vendor" },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                createdAt: true,
            },
        });

        if (!vendor) {
            throw new ApiError(404, "Vendor not found");
        }

        const [equipments, avgRating, totalReviews] = await Promise.all([
            prisma.equipment.findMany({
                where: { vendorId: id },
                include: {
                    category: true,
                    _count: { select: { reviews: true } },
                },
                orderBy: { updatedAt: "desc" },
            }),
            prisma.review.aggregate({
                where: { equipment: { vendorId: id } },
                _avg: { rating: true },
            }),
            prisma.review.count({
                where: { equipment: { vendorId: id } },
            }),
        ]);

        const equipmentsWithUrls = await Promise.all(
            equipments.map(async (e) => ({
                ...e,
                imageUrl: await getObjectUrl(e.imageKey),
            }))
        );

        res.status(200).json({
            success: true,
            message: "Vendor profile fetched successfully",
            data: {
                ...vendor,
                totalListings: equipments.length,
                avgRating: avgRating._avg.rating || 0,
                totalReviews,
                equipments: equipmentsWithUrls,
            },
        });
    } catch (error) {
        next(error);
    }
});

export default router;
