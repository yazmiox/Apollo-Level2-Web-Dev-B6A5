import { headers } from "next/headers";
import { ApiResponse } from "../types";

export const API_URL = process.env.NEXT_PUBLIC_SERVER_URL + "/api";

const httpClient = {
    get: async <T>(url: string): Promise<ApiResponse<T>> => {
        const cookieHeader = (await headers()).get("cookie");
        const res = await fetch(`${API_URL}${url}`, {
            headers: {
                cookie: cookieHeader || ""
            }
        })
        const json = await res.json();
        return json;
    },
    post: async <T>(url: string, data: any): Promise<ApiResponse<T>> => {
        const cookieHeader = (await headers()).get("cookie");
        const res = await fetch(`${API_URL}${url}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                cookie: cookieHeader || ""
            },
            body: JSON.stringify(data)
        })
        const json = await res.json();
        return json;
    },
    patch: async <T>(url: string, data: any): Promise<ApiResponse<T>> => {
        const cookieHeader = (await headers()).get("cookie");
        const res = await fetch(`${API_URL}${url}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                cookie: cookieHeader || ""
            },
            body: JSON.stringify(data)
        })
        const json = await res.json();
        return json;
    },
    delete: async <T>(url: string): Promise<ApiResponse<T>> => {
        const cookieHeader = (await headers()).get("cookie");
        const res = await fetch(`${API_URL}${url}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                cookie: cookieHeader || ""
            }
        })
        const json = await res.json();
        return json;
    }
}

export default httpClient;