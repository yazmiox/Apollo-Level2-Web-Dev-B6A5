"use server"

import httpClient from "../lib/httpClient";

export const getStats = async () => {
    const res = await httpClient.get("/stats");
    return res.data;
}