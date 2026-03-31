import { NextFunction, Request, Response } from "express"
import * as paymentService from "./payment.service"


export const createCheckoutSession = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user.id;
        const { bookingId } = req.params;
        const session = await paymentService.createCheckoutSession(userId, bookingId as string);
        res.status(200).json({ success: true, message: "Checkout session created successfully", data: session });
    } catch (error) {
        next(error)
    }
}

export const handleStripeWebhook = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await paymentService.handleStripeWebhook(req)
        res.status(200);
    } catch (error) {
        next(error)
    }
}