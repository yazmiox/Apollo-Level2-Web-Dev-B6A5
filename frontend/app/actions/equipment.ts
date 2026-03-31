"use server"

import slugify from "slugify";
import httpClient from "../lib/httpClient";
import { Equipment, EquipmentSearchParams } from "../types";

export const getUploadUrl = async (data: { fileName: string; contentType: string; size: number }) => {
  const response = await httpClient.post<{ uploadUrl: string; key: string }>(`/equipment/upload-url`, data);
  return response;
};

export const createEquipment = async (data: any) => {
  const slug = slugify(data.name, {
    lower: true,
    strict: true,
  });

  const response = await httpClient.post<Equipment>(`/equipment`, {
    ...data,
    slug,
  });
  return response;
};

export const getAllEquipments = async (params: EquipmentSearchParams = {}) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value) searchParams.append(key, String(value));
  });

  const queryString = searchParams.toString();
  const url = `/equipment${queryString ? `?${queryString}` : ""}`;

  const response = await httpClient.get<Equipment[]>(url);
  return response;
};

export const getEquipmentBySlug = async (slug: string) => {
  const response = await httpClient.get(`/equipment/${slug}`);
  return response;
};

export const getFeaturedEquipments = async () => {
  const response = await httpClient.get(`/equipment?isFeatured=true`);
  return response;
};

export const updateEquipment = async (id: string, data: any) => {
  const slug = data.name ? slugify(data.name, { lower: true, strict: true }) : undefined;
  const response = await httpClient.patch(`/equipment/${id}`, { ...data, slug });
  return response;
};

export const deleteEquipment = async (id: string) => {
  const response = await httpClient.delete(`/equipment/${id}`);
  return response
};

export const getTestimonials = async () => {
  const response = await httpClient.get(`/reviews/testimonial`);
  return response.success ? response.data : [];
};
