import { z } from "zod";
import { BookingStatus } from "../../generated/prisma/enums";

const dateRangeSchema = z.object({
    equipmentId: z.string({
        error: "Equipment ID is required",
    }),
    startDate: z.iso.datetime("Invalid start date format"),
    endDate: z.iso.datetime("Invalid end date format"),
}).refine((data) => new Date(data.startDate) < new Date(data.endDate), {
    message: "End date must be after start date",
    path: ["endDate"],
});

export const createBookingSchema = z.object({
    equipmentId: z.string({
        error: "Equipment ID is required",
    }),
    startDate: z.iso.datetime("Invalid start date format"),
    endDate: z.iso.datetime("Invalid end date format"),
    notes: z.string().max(500, "Notes cannot exceed 500 characters").optional().nullable(),
}).refine((data) => new Date(data.startDate) < new Date(data.endDate), {
    message: "End date must be after start date",
    path: ["endDate"],
});

export const updateBookingStatusSchema = z.object({
    status: z.enum(BookingStatus, {
        error: "Invalid status value",
    }),
});

export const checkAvailabilitySchema = dateRangeSchema;

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type CheckAvailabilityInput = z.infer<typeof checkAvailabilitySchema>;
export type UpdateBookingStatusInput = z.infer<typeof updateBookingStatusSchema>;
