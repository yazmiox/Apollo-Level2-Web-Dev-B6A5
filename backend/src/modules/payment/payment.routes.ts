import { Router } from "express";
import * as paymentController from "./payment.controller";

const router = Router();

// User routes
router.post("/checkout/:bookingId", paymentController.createCheckoutSession);
router.get("/my", paymentController.getMyPayments);
router.get("/booking/:bookingId", paymentController.getPaymentByBooking);

export default router;
