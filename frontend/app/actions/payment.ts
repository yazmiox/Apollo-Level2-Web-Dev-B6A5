"use server"

import httpClient from "../lib/httpClient";

export async function createCheckoutSession(bookingId: string) {
    try {
        const response = await httpClient.post(`/payment/checkout/${bookingId}`, {});
        return response;
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}
