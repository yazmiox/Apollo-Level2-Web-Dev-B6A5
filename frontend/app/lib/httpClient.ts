import { headers } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_SERVER_URL + "/api";

const httpClient = {
    get: async (url: string) => {
        const cookieHeader = (await headers()).get("cookie");
        const res = await fetch(`${API_URL}${url}`, {
            headers: {
                cookie: cookieHeader || ""
            }
        })
        const json = await res.json();
        if (!res.ok) throw new Error(json.message || "Failed to fetch");
        return json;
    },
    post: async (url: string, data: any) => {
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
        if (!res.ok) throw new Error(json.message || "Failed to create");
        return json;
    },
    patch: async (url: string, data: any) => {
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
        if (!res.ok) throw new Error(json.message || "Failed to update");
        return json;
    },
    delete: async (url: string) => {
        const cookieHeader = (await headers()).get("cookie");
        const res = await fetch(`${API_URL}${url}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                cookie: cookieHeader || ""
            }
        })
        const json = await res.json();
        if (!res.ok) throw new Error(json.message || "Failed to delete");
        return json;
    }
}

export default httpClient;