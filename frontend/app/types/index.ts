import { useSearchParams } from "next/navigation";

export type ApiResponse<T> = {
    success: boolean;
    message: string;
    data?: T;
    validationErrors?: Record<string, string[]>;
    metadata?: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }
}

export type EquipmentSearchParams = {
    q?: string;
    category?: string;
    status?: string;
    sort?: string;
    page?: number;
    limit?: number;
    isFeatured?: boolean;
}

export type Category = {
    id: string;
    name: string;
    slug: string;
    description: string;
    itemsCount: number;
}

export type Equipment = {
    id: string;
    name: string;
    slug: string;
    brand: string;
    modelName: string;
    description: string;
    location: string;
    imageKey: string;
    imageUrl?: string;
    condition: string;
    status: string;
    rentalRate: number;
    includedItems: string[];
    specifications: any;
    categoryId: string;
    category?: Category;
    isFeatured: boolean;
}

export interface CustomerStats {
    id: string;
    name: string;
    email: string;
    totalSpent: number;
    totalRentals: number;
    joined: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
}

export interface Booking {
    id: string;
    startDate: string;
    endDate: string;
    amount: number;
    status: string;
    user: User;
    equipment: Equipment & { imageUrl?: string | null };
    payment?: any;
    review?: any;
}

export interface UserStats {
    pendingApprovals: number;
    activeRentals: number;
    pendingPayments: number;
    totalBookings: number;
    latestApprovedBookingName: string | null;
    totalSpent: string;
}