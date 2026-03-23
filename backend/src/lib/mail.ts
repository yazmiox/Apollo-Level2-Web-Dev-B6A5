import nodemailer from "nodemailer"
import { EMAIL, EMAIL_APP_PASS } from "./env"
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: EMAIL,
        pass: EMAIL_APP_PASS
    }
})

export async function sendEmail({ to, subject, text }: { to: string, subject: string, text: string }) {
    await transporter.sendMail({
        from: EMAIL,
        to,
        subject,
        text
    })
}