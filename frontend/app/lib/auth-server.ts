import "server-only";
import { headers } from "next/headers";

export async function getSession() {
    try {
        const cookieHeader = (await headers()).get("cookie");

        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/get-session`, {
            headers: { cookie: cookieHeader || "" },
            credentials: "include",
            next: { revalidate: 0 },
        });

        if (!res.ok) return null;
        return res.json();
    } catch {
        return null;
    }
}