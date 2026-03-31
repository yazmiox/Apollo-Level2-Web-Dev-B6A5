"use server"

import slugify from "slugify";
import httpClient from "../lib/httpClient";
import { Equipment, EquipmentSearchParams } from "../types";

export const getUploadUrl = async (data: { fileName: string; contentType: string; size: number }) => {
  try {
    const response = await httpClient.post<{ uploadUrl: string; key: string }>(`/equipment/upload-url`, data);
    return response;
  } catch (error: any) {
    return { success: false, message: error?.message || "Something went wrong" };
  }
};

export const createEquipment = async (data: any) => {
  try {
    const slug = slugify(data.name, {
      lower: true,
      strict: true,
    });

    const response = await httpClient.post<Equipment>(`/equipment`, {
      ...data,
      slug,
    });
    return response;
  } catch (error: any) {
    return { success: false, message: error?.message || "Something went wrong" };
  }
};

export const getAllEquipments = async (params: EquipmentSearchParams = {}) => {
  try {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value) searchParams.append(key, String(value));
    });

    const queryString = searchParams.toString();
    const url = `/equipment${queryString ? `?${queryString}` : ""}`;

    const response = await httpClient.get<Equipment[]>(url);
    return response;
  } catch (error: any) {
    return { success: false, message: error?.message || "Something went wrong" };
  }
};

export const getEquipmentBySlug = async (slug: string) => {
  try {
    const response = await httpClient.get(`/equipment/${slug}`);
    return response;
  } catch (error: any) {
    return { success: false, message: error?.message || "Something went wrong" };
  }
};

export const getFeaturedEquipments = async () => {
  try {
    const response = await httpClient.get(`/equipment?isFeatured=true`);
    return response;
  } catch (error: any) {
    return { success: false, message: error?.message || "Something went wrong" };
  }
};

export const updateEquipment = async (id: string, data: any) => {
  try {
    const slug = data.name ? slugify(data.name, { lower: true, strict: true }) : undefined;
    const response = await httpClient.patch(`/equipment/${id}`, { ...data, slug });
    return response;
  } catch (error: any) {
    return { success: false, message: error?.message || "Something went wrong" };
  }
};

export const deleteEquipment = async (id: string) => {
  try {
    const response = await httpClient.delete(`/equipment/${id}`);
    return response;
  } catch (error: any) {
    return { success: false, message: error?.message || "Something went wrong" };
  }
};

export const getTestimonials = async () => {
  try {
    const response = await httpClient.get(`/reviews/testimonial`);
    return response.success ? response.data : [];
  } catch (error: any) {
    return [];
  }
};
