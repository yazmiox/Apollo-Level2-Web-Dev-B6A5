"use server"

import slugify from "slugify";
import httpClient from "../lib/httpClient";
import { Category } from "../types";

type CreateCategoryInput = {
    name: string;
    description: string
}

export const createCategory = async (data: CreateCategoryInput) => {
    try {
        const slug = slugify(data.name, {
            lower: true,
            strict: true
        });
        const response = await httpClient.post("/categories", {
            ...data,
            slug
        });
        return response;
    } catch (error: any) {
        return { success: false as const, message: error?.message || "Something went wrong" };
    }
}

export const getAllCategories = async (q?: string) => {
    try {
        const url = q ? `/categories?q=${q}` : "/categories";
        const response = await httpClient.get<Category[]>(url);
        return response;
    } catch (error: any) {
        return { success: false as const, message: error?.message || "Something went wrong" };
    }
}

export const getCategory = async (slug: string) => {
    try {
        const response = await httpClient.get(`/categories/${slug}`);
        return response;
    } catch (error: any) {
        return { success: false as const, message: error?.message || "Something went wrong" };
    }
}

export const updateCategory = async (id: string, data: CreateCategoryInput) => {
    try {
        const slug = slugify(data.name, {
            lower: true,
            strict: true
        });
        const response = await httpClient.patch(`/categories/${id}`, {
            ...data,
            slug
        });
        return response;
    } catch (error: any) {
        return { success: false as const, message: error?.message || "Something went wrong" };
    }
}

export const deleteCategory = async (id: string) => {
    try {
        const response = await httpClient.delete(`/categories/${id}`);
        return response;
    } catch (error: any) {
        return { success: false as const, message: error?.message || "Something went wrong" };
    }
}