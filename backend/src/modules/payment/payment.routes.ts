import { Router } from "express";
import * as paymentController from "./payment.controller";
import { validateRole } from "../../middlewares/validateRole";

const router = Router();

// User routes
router.post("/checkout/:bookingId", validateRole("user"), paymentController.createCheckoutSession);
router.get("/my", validateRole("user"), paymentController.getMyPayments);
router.get("/booking/:bookingId", validateRole("user"), paymentController.getPaymentByBooking);

export default router;
