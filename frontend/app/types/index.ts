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