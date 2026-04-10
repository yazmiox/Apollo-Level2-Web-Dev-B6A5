import prisma from "../../lib/prisma";

export const getStats = async (role: string, userId?: string) => {
    // ── User Stats ──
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

    // ── Vendor Stats ──
    if (role === "vendor" && userId) {
        const [
            totalListings,
            activeListings,
            totalBookingsOnMyGear,
            activeRentals,
            pendingApprovals,
            earningsData,
            pendingRequests
        ] = await Promise.all([
            prisma.equipment.count({ where: { vendorId: userId } }),
            prisma.equipment.count({ where: { vendorId: userId, status: "AVAILABLE" } }),
            prisma.booking.count({
                where: { equipment: { vendorId: userId } }
            }),
            prisma.booking.count({
                where: {
                    equipment: { vendorId: userId },
                    status: { in: ["CONFIRMED", "ACTIVE"] }
                }
            }),
            prisma.booking.count({
                where: {
                    equipment: { vendorId: userId },
                    status: "PENDING_APPROVAL"
                }
            }),
            prisma.payment.aggregate({
                where: {
                    status: "SUCCEEDED",
                    booking: { equipment: { vendorId: userId } }
                },
                _sum: { amount: true }
            }),
            prisma.booking.findMany({
                where: { 
                    equipment: { vendorId: userId },
                    status: "PENDING_APPROVAL" 
                },
                include: {
                    user: { select: { name: true } },
                    equipment: { select: { name: true } }
                },
                orderBy: { updatedAt: "desc" },
                take: 5
            })
        ]);

        return {
            totalListings,
            activeListings,
            totalBookings: totalBookingsOnMyGear,
            activeRentals,
            pendingApprovals,
            totalEarnings: `$${Number(earningsData._sum.amount || 0).toLocaleString()}`,
            pendingRequests: (pendingRequests as any[]).map(req => ({
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

    // ── Admin Stats ──
    const [
        pendingApprovals,
        activeRentals,
        customersCount,
        vendorsCount,
        totalEquipment,
        monthlyRevenueData,
        pendingRequests
    ] = await Promise.all([
        prisma.booking.count({
            where: { status: "PENDING_APPROVAL" }
        }),
        prisma.booking.count({
            where: { status: { in: ["CONFIRMED", "ACTIVE"] } }
        }),
        prisma.user.count({ where: { role: "user" } }),
        prisma.user.count({ where: { role: "vendor" } }),
        prisma.equipment.count(),
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
            orderBy: { updatedAt: "desc" },
            take: 5
        })
    ]);

    return {
        pendingApprovals,
        activeRentals,
        customers: customersCount,
        vendors: vendorsCount,
        totalEquipment,
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