import { BookingStatus } from "../../generated/prisma/enums";
import prisma from "../../lib/prisma";
import { ApiError } from "../../utils/ApiError";
import { CreateReviewInput, UpdateReviewInput } from "./review.schema";

export const getReviewsByEquipmentId = async (equipmentId: string) => {
  return (prisma as any).review.findMany({
    where: { equipmentId },
    include: {
      user: {
        select: {
          name: true,
          image: true,
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  });
};

export const getTestimonials = async (limit: number = 3) => {
  return (prisma as any).review.findMany({
    where: {
      rating: { gte: 4 },
    },
    include: {
      user: {
        select: {
          name: true,
          image: true,
        },
      },
    },
    orderBy: [
      { rating: "desc" },
      { updatedAt: "desc" },
    ],
    take: limit,
  });
};

export const createReview = async (userId: string, data: CreateReviewInput) => {
  // Verify that the booking belongs to the user and is COMPLETED (RETURNED in our schema)
  const booking = await prisma.booking.findUnique({
    where: { id: data.bookingId },
  });

  if (!booking || booking.userId !== userId) {
    throw new ApiError(404, "Booking not found");
  }

  if (booking.status !== BookingStatus.RETURNED) {
    throw new ApiError(400, "You can only review a booking after it has been returned");
  }

  // Check if review already exists
  const existingReview = await prisma.review.findUnique({
    where: { bookingId: data.bookingId },
  });

  if (existingReview) {
    throw new ApiError(400, "You have already reviewed this booking");
  }

  return prisma.review.create({
    data: {
      userId,
      bookingId: data.bookingId,
      equipmentId: booking.equipmentId,
      rating: data.rating,
      comment: data.comment,
    },
  });
};

export const updateReview = async (userId: string, id: string, data: UpdateReviewInput) => {
  const review = await prisma.review.findUnique({
    where: { id },
  });

  if (!review || review.userId !== userId) {
    throw new ApiError(404, "Review not found or unauthorized");
  }

  return prisma.review.update({
    where: { id },
    data,
  });
};

export const deleteReview = async (userId: string, id: string) => {
  const review = await prisma.review.findUnique({
    where: { id },
  });

  if (!review || review.userId !== userId) {
    throw new ApiError(404, "Review not found or unauthorized");
  }

  return prisma.review.delete({
    where: { id },
  });
};
