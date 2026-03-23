import cors from "cors";
import express from "express";
import { CLIENT_URL, PORT } from "./lib/env";
import { globalErrorHandler } from "./lib/error";
import categoryRoutes from "./modules/category/category.routes";

const app = express();

app.use(cors({
    origin: CLIENT_URL!,
    credentials: true
}))

app.use(express.json())
app.use("/api/categories", categoryRoutes)

app.use(globalErrorHandler)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});