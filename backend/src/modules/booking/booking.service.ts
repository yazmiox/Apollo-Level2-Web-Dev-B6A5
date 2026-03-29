import { BookingStatus, EquipmentStatus } from "../../generated/prisma/enums";
import prisma from "../../lib/prisma";
import { getObjectUrl } from "../../lib/s3";
import { ApiError } from "../../utils/ApiError";
import { CheckAvailabilityInput, CreateBookingInput } from "./booking.schema";

const BLOCKING_BOOKING_STATUSES: BookingStatus[] = [
    BookingStatus.PENDING_APPROVAL,
    BookingStatus.AWAITING_PAYMENT,
    BookingStatus.CONFIRMED,
    BookingStatus.ACTIVE,
];

const ALLOWED_STATUS_TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
    [BookingStatus.PENDING_APPROVAL]: [BookingStatus.AWAITING_PAYMENT, BookingStatus.REJECTED, BookingStatus.CANCELLED],
    [BookingStatus.AWAITING_PAYMENT]: [BookingStatus.CANCELLED],
    [BookingStatus.CONFIRMED]: [BookingStatus.ACTIVE, BookingStatus.CANCELLED],
    [BookingStatus.ACTIVE]: [BookingStatus.RETURNED],
    [BookingStatus.RETURNED]: [],
    [BookingStatus.REJECTED]: [],
    [BookingStatus.CANCELLED]: [],
};

const findOverlappingBooking = async (equipmentId: string, start: Date, end: Date) => {
    return prisma.booking.findFirst({
        where: {
            equipmentId,
            status: { in: BLOCKING_BOOKING_STATUSES },
            startDate: { lt: end },
            endDate: { gt: start },
        },
    });
};

const calculateBookingAmount = (rentalRate: number, start: Date, end: Date) => {
    const durationInMs = end.getTime() - start.getTime();
    const durationDays = Math.max(1, Math.ceil(durationInMs / (1000 * 60 * 60 * 24)));

    return rentalRate * durationDays;
};

export const getAllBookings = async (filters: Record<string, unknown> = {}) => {
    const bookings = await prisma.booking.findMany({
        where: filters,
        include: {
            user: true,
            equipment: true,
            payment: true,
            review: true,
        }
    });

    return Promise.all(
        bookings.map(async (booking) => {
            const imageUrl = booking.equipment?.imageKey
                ? await getObjectUrl(booking.equipment.imageKey)
                : null;

            return {
                ...booking,
                equipment: booking.equipment
                    ? {
                        ...booking.equipment,
                        imageUrl,
                    }
                    : null,
            };
        })
    );
};

export const getBookingById = async (id: string) => {
    const booking = await prisma.booking.findUnique({
        where: { id },
        include: {
            user: true,
            equipment: true,
            payment: true,
            review: true,
        }
    });

    if (!booking) return null;

    const imageUrl = booking.equipment?.imageKey
        ? await getObjectUrl(booking.equipment.imageKey)
        : null;

    return {
        ...booking,
        equipment: booking.equipment
            ? {
                ...booking.equipment,
                imageUrl,
            }
            : null,
    };
};

export const checkAvailability = async (data: CheckAvailabilityInput) => {
    const equipment = await prisma.equipment.findUnique({
        where: { id: data.equipmentId },
    });

    if (!equipment) {
        throw new ApiError(404, "Equipment not found");
    }

    if (equipment.status !== EquipmentStatus.AVAILABLE) {
        return {
            available: false,
            reason: `Equipment is currently ${equipment.status.toLowerCase()}`,
        };
    }

    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    const overlapping = await findOverlappingBooking(data.equipmentId, start, end);

    return {
        available: !overlapping,
        conflict: overlapping ? {
            startDate: overlapping.startDate,
            endDate: overlapping.endDate,
        } : null,
    };
};

export const createBooking = async (userId: string, data: CreateBookingInput) => {
    const equipment = await prisma.equipment.findUnique({
        where: { id: data.equipmentId },
    });

    if (!equipment) {
        throw new ApiError(404, "Equipment not found");
    }

    const availability = await checkAvailability(data);
    if (!availability.available) {
        throw new ApiError(400, availability.reason || "Equipment is already booked for these dates");
    }

    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    const amount = calculateBookingAmount(Number(equipment.rentalRate), start, end);

    return prisma.booking.create({
        data: {
            userId,
            equipmentId: data.equipmentId,
            startDate: start,
            endDate: end,
            amount,
            notes: data.notes,
            status: BookingStatus.PENDING_APPROVAL,
        }
    });
};

export const updateBookingStatus = async (id: string, nextStatus: BookingStatus, adminId?: string) => {
    const booking = await prisma.booking.findUnique({
        where: { id },
    });

    if (!booking) {
        throw new ApiError(404, "Booking not found");
    }

    const allowedStatuses = ALLOWED_STATUS_TRANSITIONS[booking.status];
    if (!allowedStatuses.includes(nextStatus)) {
        throw new ApiError(400, `Cannot change booking from ${booking.status} to ${nextStatus}`);
    }

    const data: {
        status: BookingStatus;
        approvedByAdminId?: string;
        approvedAt?: Date;
    } = {
        status: nextStatus,
    };

    if (nextStatus === BookingStatus.AWAITING_PAYMENT) {
        if (!adminId) {
            throw new ApiError(401, "Unauthorized");
        }

        data.approvedByAdminId = adminId;
        data.approvedAt = new Date();
    }

    // We will send email here

    return prisma.booking.update({
        where: { id },
        data,
    });
};

export const confirmBookingAfterPayment = async (bookingId: string) => {
    const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
    });

    if (!booking) {
        throw new ApiError(404, "Booking not found");
    }

    if (booking.status !== BookingStatus.AWAITING_PAYMENT) {
        throw new ApiError(400, "Booking is not awaiting payment");
    }

    return prisma.booking.update({
        where: { id: bookingId },
        data: {
            status: BookingStatus.CONFIRMED,
        },
    });
};