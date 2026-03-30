"use server"

import httpClient from "../lib/httpClient";
import { revalidatePath } from "next/cache";

export async function createReview(data: { bookingId: string; rating: number; comment?: string }) {
    try {
        const response = await httpClient.post("/reviews", data);
        revalidatePath("/dashboard/bookings");
        return response;
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

export async function updateReview(id: string, data: { rating?: number; comment?: string }) {
    try {
        const response = await httpClient.patch(`/reviews/${id}`, data);
        revalidatePath("/dashboard/bookings");
        return response;
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}