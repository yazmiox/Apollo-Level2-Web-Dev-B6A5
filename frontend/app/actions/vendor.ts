"use server"

import httpClient from "../lib/httpClient";
import { Vendor } from "../types";

export const getAllVendors = async () => {
  try {
    const response = await httpClient.get<Vendor[]>(`/vendors`);
    return response;
  } catch (error: any) {
    return { success: false, message: error?.message || "Something went wrong" };
  }
};

export const getVendorById = async (id: string) => {
  try {
    const response = await httpClient.get<Vendor>(`/vendors/${id}`);
    return response;
  } catch (error: any) {
    return { success: false, message: error?.message || "Something went wrong" };
  }
};
