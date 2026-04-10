import { Router } from "express";
import * as bookingController from "./booking.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { checkAvailabilitySchema, createBookingSchema, updateBookingStatusSchema } from "./booking.schema";
import { validateRole } from "../../middlewares/validateRole";

const router = Router();

// User routes
router.get("/my", validateRole("user"), bookingController.getMyBookings);
router.post("/availability", validateRole("user"), validateRequest(checkAvailabilitySchema), bookingController.checkAvailability);
router.post("/", validateRole("user"), validateRequest(createBookingSchema), bookingController.createBooking);

// Vendor routes — see bookings for their own equipment
router.get("/vendor/me", validateRole("vendor"), bookingController.getVendorBookings);

// Admin/Vendor routes — manage status
router.get("/", validateRole("admin"), bookingController.getAllBookings);
router.patch("/:id/status", validateRole("admin", "vendor"), validateRequest(updateBookingStatusSchema), bookingController.updateBookingStatus);

export default router;