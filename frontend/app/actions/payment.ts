"use server"

import httpClient from "../lib/httpClient";

export async function createCheckoutSession(bookingId: string) {
    const response = await httpClient.post<{ url: string }>(`/payment/checkout/${bookingId}`, {});
    return response;
}
