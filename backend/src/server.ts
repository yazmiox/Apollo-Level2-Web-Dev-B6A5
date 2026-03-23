import express from "express";
import { PORT } from "./lib/env";

const app = express();

app.get("/", (req, res) => {
    res.send("Server is running");
})
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});