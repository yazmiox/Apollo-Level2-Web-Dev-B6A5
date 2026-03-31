import { Request, Response, NextFunction } from "express";
import * as reviewService from "./review.service";
import { createReviewSchema, updateReviewSchema } from "./review.schema";

export const getReviewsByEquipmentId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reviews = await reviewService.getReviewsByEquipmentId(req.params.equipmentId as string);
    res.json({ success: true, message: "Reviews fetched successfully", data: reviews });
  } catch (error) {
    next(error);
  }
};

export const getTestimonials = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reviews = await reviewService.getTestimonials(3);
    res.json({ success: true, message: "Testimonials fetched successfully", data: reviews });
  } catch (error) {
    next(error);
  }
};

export const createReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = createReviewSchema.parse(req.body);
    const review = await reviewService.createReview(req.user.id, data);
    res.status(201).json({ success: true, data: review, message: "Review submitted successfully" });
  } catch (error) {
    next(error);
  }
};

export const updateReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = updateReviewSchema.parse(req.body);
    const review = await reviewService.updateReview(req.user.id, req.params.id as string, data);
    res.json({ success: true, data: review, message: "Review updated successfully" });
  } catch (error) {
    next(error);
  }
};

export const deleteReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await reviewService.deleteReview(req.user.id, req.params.id as string);
    res.json({ success: true, message: "Review deleted successfully", data: null });
  } catch (error) {
    next(error);
  }
};
