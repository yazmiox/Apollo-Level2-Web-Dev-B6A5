"use server"

import slugify from "slugify";
import httpClient from "../lib/httpClient";

type CreateCategoryInput = {
    name: string;
    description: string
}

export const createCategory = async (data: CreateCategoryInput) => {
    const slug = slugify(data.name, {
        lower: true,
        strict: true
    });
    const response = await httpClient.post("/categories", {
        ...data,
        slug
    });
    return response;
}

export const getAllCategories = async () => {
    const response = await httpClient.get("/categories");
    return response;
}

export const getCategory = async (slug: string) => {
    const response = await httpClient.get(`/categories/${slug}`);
    return response;
}

export const updateCategory = async (id: string, data: CreateCategoryInput) => {
    const slug = slugify(data.name, {
        lower: true,
        strict: true
    });
    const response = await httpClient.patch(`/categories/${id}`, {
        ...data,
        slug
    });
    return response;
}

export const deleteCategory = async (id: string) => {
    const response = await httpClient.delete(`/categories/${id}`);
    return response;
}