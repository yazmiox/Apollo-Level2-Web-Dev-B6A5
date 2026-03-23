
export const getStats = async (role: "user" | "admin") => {
    if (role === "user") {
        return {
            pendingApprovals: 8,
            activeRentals: 14,
            customers: 3,
            monthlyRevenue: "$4,250"
        }
    }
    return {
        pendingApprovals: 8,
        activeRentals: 14,
        customers: 3,
        monthlyRevenue: "$4,250",
        pendingRequests: [
            {
                id: "req_1",
                user: {
                    name: "Sarah Jenkins"
                },
                equipment: {
                    name: "Sony FX6 Cinema Camera"
                },
                startDate: "2024-04-01T10:00:00.000Z",
                endDate: "2024-04-05T10:00:00.000Z",
                amount: "$170.00",
                status: "PENDING_APPROVAL"
            },
            {
                id: "req_2",
                user: {
                    name: "Michael Scott"
                },
                equipment: {
                    name: "Aputure 120D Mark II"
                },
                startDate: "2024-04-01T10:00:00.000Z",
                endDate: "2024-04-05T10:00:00.000Z",
                amount: "$170.00",
                status: "PENDING_APPROVAL"
            },
            {
                id: "req_3",
                user: {
                    name: "David Wallace"
                },
                equipment: {
                    name: "Full Podcast Studio Kit"
                },
                startDate: "2024-04-01T10:00:00.000Z",
                endDate: "2024-04-05T10:00:00.000Z",
                amount: "$170.00",
                status: "PENDING_APPROVAL"
            }
        ]
    }
}