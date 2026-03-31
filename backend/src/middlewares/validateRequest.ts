import { NextFunction, Request, Response } from "express";
import { ZodType } from "zod";

export const validateRequest = (schema: ZodType) =>
    async (req: Request, res: Response, next: NextFunction) => {
        const result = await schema.safeParseAsync(req.body)
        if (!result.success) {
            next(result.error)
        } else {
            req.body = result.data
            next()
        }
    };
