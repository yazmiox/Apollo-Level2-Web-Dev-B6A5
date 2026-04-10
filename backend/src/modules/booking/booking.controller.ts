import { Request, Response, NextFunction } from "express";
import * as bookingService from "./booking.service";
import { ApiError } from "../../utils/ApiError";

export const checkAvailability = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const availability = await bookingService.checkAvailability(req.body);
        res.status(200).json({ success: true, message: "Availability checked successfully", data: availability });
    } catch (error) {
        next(error);
    }
}

export const getMyBookings = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user?.id;
        if (!userId) throw new ApiError(401, "Unauthorized");

        const { q, status } = req.query;

        const bookings = await bookingService.getAllBookings({ userId, q: q as string, status: status as string });
        res.status(200).json({ success: true, message: "Bookings fetched successfully", data: bookings });
    } catch (error) {
        next(error);
    }
}

export const getAllBookings = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { q, status } = req.query;
        const bookings = await bookingService.getAllBookings({ q: q as string, status: status as string });
        res.status(200).json({ success: true, message: "Bookings fetched successfully", data: bookings });
    } catch (error) {
        next(error);
    }
}

// Vendor sees only bookings for their own equipment
export const getVendorBookings = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const vendorId = req.user?.id;
        if (!vendorId) throw new ApiError(401, "Unauthorized");

        const { q, status } = req.query;
        const bookings = await bookingService.getAllBookings({ vendorId, q: q as string, status: status as string });
        res.status(200).json({ success: true, message: "Vendor bookings fetched successfully", data: bookings });
    } catch (error) {
        next(error);
    }
}

export const createBooking = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user?.id;
        const booking = await bookingService.createBooking(userId, req.body);
        res.status(201).json({ success: true, message: "Booking created successfully", data: booking });
    } catch (error) {
        next(error);
    }
}

export const updateBookingStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const userId = (req as any).user?.id;
        const role = (req as any).user?.role;

        const booking = await bookingService.updateBookingStatus(id as string, status, userId, role);
        res.status(200).json({ success: true, message: "Booking status updated successfully", data: booking });
    } catch (error) {
        next(error);
    }
}
