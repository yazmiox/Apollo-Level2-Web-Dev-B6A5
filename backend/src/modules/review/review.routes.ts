import { Router } from "express";
import * as reviewController from "./review.controller";
import { authenticate } from "../../middlewares/auth";

const router = Router();

// Publicly accessible reviews for specific equipment
router.get("/equipment/:equipmentId", reviewController.getReviewsByEquipmentId);
router.get("/testimonial", reviewController.getTestimonials);

// Protected reviewer actions
router.post("/", authenticate, reviewController.createReview);
router.patch("/:id", authenticate, reviewController.updateReview);
router.delete("/:id", authenticate, reviewController.deleteReview);

export default router;
