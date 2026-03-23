import express from "express";
import { CLIENT_URL, PORT } from "./lib/env";
import cors from "cors";
import categoryRoutes from "./modules/category/category.routes";
import bookingRoutes from "./modules/booking/booking.routes";
import paymentRoutes from "./modules/payment/payment.routes";
import { globalErrorHandler } from "./lib/error";
import { authenticate } from "./middlewares/auth";

const app = express();

app.use(cors({
    origin: CLIENT_URL!,
    credentials: true
}))

app.use(express.json())

app.use("/api/categories", categoryRoutes)
app.use("/api/bookings", authenticate, bookingRoutes);
app.use("/api/payment", authenticate, paymentRoutes);

app.use(globalErrorHandler)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});