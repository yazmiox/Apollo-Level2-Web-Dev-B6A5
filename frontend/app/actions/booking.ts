"use server"

import httpClient from "../lib/httpClient"

export async function updateBookingStatus(bookingId: string, status: string) {
    const res = await httpClient.patch(`/bookings/${bookingId}/status`, { status })
    return res
}