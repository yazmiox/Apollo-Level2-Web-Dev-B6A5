import express from "express";
import { CLIENT_URL, PORT } from "./lib/env";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import cors from "cors";
import categoryRoutes from "./modules/category/category.routes";
import equipmentRoutes from "./modules/equipment/equipment.routes";
import bookingRoutes from "./modules/booking/booking.routes";
import paymentRoutes from "./modules/payment/payment.routes";
import { globalErrorHandler } from "./middlewares/error";
import { authenticate } from "./middlewares/auth";
import { handleStripeWebhook } from "./modules/payment/payment.controller";
import statsRoutes from "./modules/stats/stats.routes";
import customerRoutes from "./modules/customer/customer.routes";
import reviewRoutes from "./modules/review/review.routes";

const app = express();

app.use(cors({
    origin: CLIENT_URL!,
    credentials: true
}))

app.all("/api/auth/{*any}", toNodeHandler(auth))
app.post("/api/payment/webhook", express.raw({ type: "application/json" }), handleStripeWebhook)
app.use(express.json())

app.use("/api/stats", authenticate, statsRoutes)
app.use("/api/categories", categoryRoutes)
app.use("/api/equipment", equipmentRoutes);
app.use("/api/bookings", authenticate, bookingRoutes);
app.use("/api/payment", authenticate, paymentRoutes);
app.use("/api/customers", authenticate, customerRoutes);
app.use("/api/reviews", reviewRoutes);

app.use(globalErrorHandler)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});