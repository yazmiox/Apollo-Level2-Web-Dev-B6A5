import cors from "cors";
import express from "express";
import { CLIENT_URL, PORT } from "./lib/env";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import cors from "cors";
import categoryRoutes from "./modules/category/category.routes";
import equipmentRoutes from "./modules/equipment/equipment.routes";
import bookingRoutes from "./modules/booking/booking.routes";
import paymentRoutes from "./modules/payment/payment.routes";
import { globalErrorHandler } from "./lib/error";
import { authenticate } from "./middlewares/auth";
import bookingRoutes from "./modules/booking/booking.routes";
import categoryRoutes from "./modules/category/category.routes";
import paymentRoutes from "./modules/payment/payment.routes";
import statsRoutes from "./modules/stats/stats.routes";

const app = express();

app.use(cors({
    origin: CLIENT_URL!,
    credentials: true
}))

app.all("/api/auth/{*any}", toNodeHandler(auth))
app.use(express.json())

app.use("/api/stats", authenticate, statsRoutes)
app.use("/api/categories", categoryRoutes)
app.use("/api/equipment", equipmentRoutes);
app.use("/api/bookings", authenticate, bookingRoutes);
app.use("/api/payment", authenticate, paymentRoutes);

app.use(globalErrorHandler)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});