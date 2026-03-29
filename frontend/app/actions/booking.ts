"use server"

import httpClient from "../lib/httpClient"

export async function getMyBookings() {
    const res = await httpClient.get(`/bookings/my`)
    return res
}

export async function getAllBookings() {
    const res = await httpClient.get(`/bookings`)
    return res
}

export async function updateBookingStatus(bookingId: string, status: string) {
    const res = await httpClient.patch(`/bookings/${bookingId}/status`, { status })
    return res
}

export async function checkAvailability(data: { equipmentId: string, startDate: string, endDate: string }) {
    try {
        const res = await httpClient.post(`/bookings/availability`, data);
        return res;
    } catch (error: any) {
        console.error("Error checking availability:", error);
        return { success: false, message: error.message || "Failed to check availability" };
    }
}

export async function createBooking(data: any) {
    try {
        const res = await httpClient.post(`/bookings`, data);
        return res;
    } catch (error: any) {
        console.error("Error creating booking:", error);
        return { success: false, message: error.message || "Failed to create booking" };
    }
}