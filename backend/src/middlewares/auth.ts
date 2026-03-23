import type { NextFunction, Request, Response } from "express";
import { auth } from "../lib/auth.js";
import { fromNodeHeaders } from "better-auth/node";

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers)
    })
    if (!session) {
        return res.status(401).json({
            success: false,
            data: null,
            message: "Unauthorized"
        })
    }
    req.user = session.user
    next()
}