import "dotenv/config"

export const {
    PORT,
    DATABASE_URL,
    DIRECT_URL,
    CLIENT_URL,
    STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET
} = process.env
