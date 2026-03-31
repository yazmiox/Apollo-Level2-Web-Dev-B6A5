"use server"

import httpClient from "../lib/httpClient";
import { CustomerStats } from "../types";

export const getCustomers = async () => {
    try {
        const response = await httpClient.get<CustomerStats[]>("/customers");
        return response;
    } catch (error) {
        console.error("Error fetching customers:", error);
        return { success: false, data: [], message: "Failed to fetch customers" };
    }
}
