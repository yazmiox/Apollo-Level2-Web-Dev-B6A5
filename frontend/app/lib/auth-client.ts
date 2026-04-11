import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
    baseURL: "https://equipflow-frontend.vercel.app"
})