"use server"

import slugify from "slugify";
import httpClient from "../lib/httpClient";

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

export const getTestimonials = async () => {
  try {
    const response = await httpClient.get(`/reviews/testimonial`);
    return response.success ? response.data : [];
  } catch (error: any) {
    console.error("Error getting testimonials:", error);
    return [];
  }
};
