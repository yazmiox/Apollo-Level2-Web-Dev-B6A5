"use server"

import httpClient from "../lib/httpClient"

import { ApiResponse, Booking } from "../types"

export async function getMyBookings(params: { q?: string; status?: string } = {}) {
    const searchParams = new URLSearchParams();
    if (params.q) searchParams.set("q", params.q);
    if (params.status) searchParams.set("status", params.status);
    
    const queryString = searchParams.toString();
    const url = `/bookings/my${queryString ? `?${queryString}` : ""}`;

    const res = await httpClient.get<Booking[]>(url)
    return res as ApiResponse<Booking[]>
}

export async function getAllBookings(params: { q?: string; status?: string } = {}) {
    const searchParams = new URLSearchParams();
    if (params.q) searchParams.set("q", params.q);
    if (params.status) searchParams.set("status", params.status);
    
    const queryString = searchParams.toString();
    const url = `/bookings${queryString ? `?${queryString}` : ""}`;

    const res = await httpClient.get<Booking[]>(url)
    return res as ApiResponse<Booking[]>
}

export async function updateBookingStatus(bookingId: string, status: string) {
    const res = await httpClient.patch(`/bookings/${bookingId}/status`, { status })
    return res
}

export async function checkAvailability(data: { equipmentId: string, startDate: string, endDate: string }) {
    const res = await httpClient.post(`/bookings/availability`, data);
    return res;
}

export async function createBooking(data: any) {
    const res = await httpClient.post(`/bookings`, data);
    return res;
}