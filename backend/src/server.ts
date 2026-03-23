import cors from "cors";
import express from "express";
import { CLIENT_URL, PORT } from "./lib/env";
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

app.use(express.json())

app.use("/api/stats", authenticate, statsRoutes)
app.use("/api/categories", categoryRoutes)
app.use("/api/bookings", authenticate, bookingRoutes);
app.use("/api/payment", authenticate, paymentRoutes);

app.use(globalErrorHandler)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});