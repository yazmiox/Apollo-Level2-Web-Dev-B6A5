"use server"

import httpClient from "../lib/httpClient";
import { UserStats } from "../types";

export const getStats = async () => {
    const res = await httpClient.get<UserStats>("/stats");
    return res;
}