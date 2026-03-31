import prisma from "../../lib/prisma";

export const getStats = async (role: string, userId?: string) => {
    if (role === "user" && userId) {
        const [
            totalSpentData,
            activeRentals,
            pendingApprovals,
            pendingPayments,
            totalBookings,
            latestApprovedBooking
        ] = await Promise.all([
            prisma.payment.aggregate({
                where: {
                    userId,
                    status: "SUCCEEDED"
                },
                _sum: {
                    amount: true
                }
            }),
            prisma.booking.count({
                where: {
                    userId,
                    status: {
                        in: ["CONFIRMED", "ACTIVE"]
                    }
                }
            }),
            prisma.booking.count({
                where: {
                    userId,
                    status: "PENDING_APPROVAL"
                }
            }),
            prisma.booking.count({
                where: {
                    userId,
                    status: "AWAITING_PAYMENT"
                }
            }),
            prisma.booking.count({
                where: {
                    userId
                }
            }),
            prisma.booking.findFirst({
                where: {
                    userId,
                    status: "AWAITING_PAYMENT"
                },
                include: {
                    equipment: {
                        select: { name: true }
                    }
                },
                orderBy: {
                    updatedAt: "desc"
                }
            })
        ]);

        return {
            pendingApprovals,
            activeRentals,
            pendingPayments,
            totalBookings,
            latestApprovedBookingName: latestApprovedBooking?.equipment?.name || null,
            totalSpent: `$${Number(totalSpentData._sum.amount || 0).toLocaleString()}`,
        };
    }
    const [
        pendingApprovals,
        activeRentals,
        customersCount,
        monthlyRevenueData,
        pendingRequests
    ] = await Promise.all([
        prisma.booking.count({
            where: { status: "PENDING_APPROVAL" }
        }),
        prisma.booking.count({
            where: { status: { in: ["CONFIRMED", "ACTIVE"] } }
        }),
        prisma.booking.groupBy({
            by: ["userId"],
        }).then(groups => groups.length),
        prisma.payment.aggregate({
            where: {
                status: "SUCCEEDED",
                createdAt: {
                    gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
                }
            },
            _sum: { amount: true }
        }),
        prisma.booking.findMany({
            where: { status: "PENDING_APPROVAL" },
            include: {
                user: { select: { name: true } },
                equipment: { select: { name: true } }
            },
            orderBy: { createdAt: "desc" },
            take: 5
        })
    ]);

    return {
        pendingApprovals,
        activeRentals,
        customers: customersCount,
        monthlyRevenue: `$${Number(monthlyRevenueData._sum.amount || 0).toLocaleString()}`,
        pendingRequests: pendingRequests.map(req => ({
            id: req.id,
            user: { name: req.user.name },
            equipment: { name: req.equipment.name },
            startDate: req.startDate.toISOString(),
            endDate: req.endDate.toISOString(),
            amount: `$${Number(req.amount).toLocaleString()}`,
            status: req.status
        }))
    };
}