import { Router } from "express";
import * as paymentController from "./payment.controller";
import { validateRole } from "../../middlewares/validateRole";

const router = Router();

router.post("/checkout/:bookingId", validateRole("user"), paymentController.createCheckoutSession);

export default router;
