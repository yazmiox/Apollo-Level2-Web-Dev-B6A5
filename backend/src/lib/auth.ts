import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./prisma";
import { CLIENT_URL } from "./env";
import { sendEmail } from "./mail";


export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
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
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,
        sendResetPassword: async ({ user, url, token }, request) => {
            console.log(url)

            void sendEmail({
                to: user.email,
                subject: "Reset your password",
                text: `Click the link to reset your password: ${url}`
            })
        }
    },
    emailVerification: {
        sendVerificationEmail: async ({ user, url, token }, request) => {
            const verificationUrl = `${CLIENT_URL}/verify-email?token=${token}`
            console.log(verificationUrl)

            void sendEmail({
                to: user.email,
                subject: "Verify your email",
                text: `Click the link to verify your email: ${verificationUrl}`
            })
        },
        sendOnSignIn: true,
        sendOnSignUp: true,
        autoSignInAfterVerification: true
    },
    trustedOrigins: [CLIENT_URL!],
})