import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./prisma";
import { CLIENT_URL } from "./env";


export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true
    },
    user: {
        additionalFields: {
            role: {
                type: ["admin", "user"],
                defaultValue: "user",
                required: true,
                input: false
            }
        }
    },
    trustedOrigins: [CLIENT_URL!],
})