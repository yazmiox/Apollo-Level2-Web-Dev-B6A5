import { Router, Request, Response, NextFunction } from "express";
import prisma from "../../lib/prisma";
import { ApiError } from "../../utils/ApiError";

const router = Router();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.user?.role !== "admin") {
            throw new ApiError(403, "Only admins can access customer data");
        }

        const users = await prisma.user.findMany({
            where: { role: "user" },
            include: {
                payments: {
                    where: { status: "SUCCEEDED" },
                    select: { amount: true }
                },
                _count: {
                    select: { bookings: true }
                }
            },
            orderBy: { updatedAt: "desc" }
        });

        const customers = users.map((user) => ({
            id: user.id,
            name: user.name,
            email: user.email,
            totalSpent: user.payments.reduce((sum, p) => sum + Number(p.amount), 0),
            totalRentals: user._count.bookings,
            joined: user.createdAt.toISOString()
        }));

        res.status(200).json({ success: true, message: "Customers fetched successfully", data: customers });
    } catch (error) {
        next(error);
    }
});

export default router;
