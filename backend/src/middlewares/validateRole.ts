import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError";

export const validateRole = (role: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (req.user?.role !== role) {
            return next(new ApiError(403, "You do not have permission to perform this action"));
        }
        next();
    };
};