import { Request } from "express"
import prisma from "../../lib/prisma"
import { stripe } from "../../lib/stripe"
import { ApiError } from "../../utils/ApiError"
import { CLIENT_URL, STRIPE_WEBHOOK_SECRET } from "../../lib/env"

export const createCheckoutSession = async (userId: string, bookingId: string) => {
    const booking = await prisma.booking.findUnique({
        where: {
            id: bookingId,
            userId
        },
        include: {
            equipment: true
        }
    })

    if (!booking) throw new ApiError(404, "Booking not found")
    if (booking.status !== "AWAITING_PAYMENT") throw new ApiError(400, "Booking is not ready for payment")

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
            {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: booking.equipment.name,
                    },
                    unit_amount: Number(booking.amount) * 100,
                },
                quantity: 1,
            },
        ],
        metadata: {
            bookingId: booking.id,
            userId
        },
        mode: "payment",
        success_url: `${CLIENT_URL}/success`,
        cancel_url: `${CLIENT_URL}/cancel`,
        client_reference_id: booking.id
    })

    await prisma.payment.create({
        data: {
            bookingId: booking.id,
            userId,
            amount: booking.amount,
            status: "PENDING",
            stripeCheckoutSessionId: session.id,
            stripePaymentIntentId: session.payment_intent as string,
        }
    })
    return { url: session.url }
}

export const handleStripeWebhook = async (req: Request) => {
    const signature = req.headers["stripe-signature"]
    if (!signature) throw new ApiError(400, "Invalid signature")
    const event = stripe.webhooks.constructEvent(req.body, signature, STRIPE_WEBHOOK_SECRET!)

    if (event.type === "checkout.session.completed") {
        await prisma.$transaction(async (tx) => {
            await tx.booking.update({
                where: {
                    id: event.data.object.metadata?.bookingId,
                    userId: event.data.object.metadata?.userId
                },
                data: {
                    status: "CONFIRMED"
                }
            })
            await tx.payment.update({
                where: {
                    stripeCheckoutSessionId: event.data.object.id
                },
                data: {
                    status: "SUCCEEDED"
                }
            })

        })
    }
    return event
}