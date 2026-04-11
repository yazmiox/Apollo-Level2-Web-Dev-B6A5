import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./prisma";
import { CLIENT_URL, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from "./env";
import { sendEmail } from "./mail";
import { waitUntil } from "@vercel/functions";


export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    socialProviders: {
        google: {
            clientId: GOOGLE_CLIENT_ID!,
            clientSecret: GOOGLE_CLIENT_SECRET!,
        },
    },
    user: {
        additionalFields: {
            role: {
                type: "string",
                defaultValue: "user",
                input: true
            }
        }
    },
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,
        sendResetPassword: async ({ user, url, token }, request) => {
            waitUntil(
                sendEmail({
                    to: user.email,
                    subject: "Reset your password",
                    text: `Click the link to reset your password: ${url}`
                })
            )
        }
    },
    emailVerification: {
        sendVerificationEmail: async ({ user, url, token }, request) => {
            const verificationUrl = `${CLIENT_URL}/verify-email?token=${token}`
            waitUntil(
                sendEmail({
                    to: user.email,
                    subject: "Verify your email",
                    text: `Click the link to verify your email: ${verificationUrl}`
                })
            )
        },
        sendOnSignIn: true,
        sendOnSignUp: true,
        autoSignInAfterVerification: true
    },
    trustedOrigins: [CLIENT_URL!],
})