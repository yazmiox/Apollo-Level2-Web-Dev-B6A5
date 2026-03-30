"use server"

import httpClient from "../lib/httpClient";

export const getAllCategories = async () => {
    const response = await httpClient.get("/categories");
    return response;
}