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