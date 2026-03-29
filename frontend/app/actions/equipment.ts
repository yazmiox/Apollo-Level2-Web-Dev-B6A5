"use server"

import slugify from "slugify";
import httpClient from "../lib/httpClient";

export const getUploadUrl = async (data: { fileName: string; contentType: string; size: number }) => {
  try {
    const response = await httpClient.post(`/equipment/upload-url`, data);
    return response;
  } catch (error: any) {
    console.error("Error getting upload URL:", error);
    return { success: false, message: error.message || "Failed to get upload URL" };
  }
};

export const createEquipment = async (data: any) => {
  try {
    const slug = slugify(data.name, {
      lower: true,
      strict: true,
    });

    const response = await httpClient.post(`/equipment`, {
      ...data,
      slug,
    });
    return response;
  } catch (error: any) {
    console.error("Error creating equipment:", error);
    return { success: false, message: error.message || "Failed to create equipment" };
  }
};

export const getAllEquipments = async (params: any = {}) => {
  try {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) searchParams.append(key, String(value));
    });

    const queryString = searchParams.toString();
    const url = `/equipment${queryString ? `?${queryString}` : ""}`;

    const response = await httpClient.get(url);
    if (response.success) {
      return response;
    }
    return { success: false, data: [], metadata: { total: 0, page: 1, limit: 9, totalPages: 0 } };
  } catch (error: any) {
    console.error("Error getting equipments:", error);
    return { success: false, data: [], metadata: { total: 0, page: 1, limit: 9, totalPages: 0 } };
  }
};

export const getAllCategories = async () => {
  try {
    const response = await httpClient.get(`/categories`);
    return response.success ? response.data : [];
  } catch (error: any) {
    console.error("Error getting categories:", error);
    return [];
  }
};

export const getEquipmentBySlug = async (slug: string) => {
  try {
    const response = await httpClient.get(`/equipment/${slug}`);
    return response;
  } catch (error: any) {
    console.error("Error getting equipment by slug:", error);
    return null;
  }
};

export const getTestimonials = async () => {
  try {
    const response = await httpClient.get(`/reviews/testimonial`);
    return response.success ? response.data : [];
  } catch (error: any) {
    console.error("Error getting testimonials:", error);
    return [];
  }
};
