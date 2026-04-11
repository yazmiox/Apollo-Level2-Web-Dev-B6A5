import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import { flattenError, ZodError } from "zod";
import { Prisma } from "../generated/prisma/client";

export const globalErrorHandler = (error: Error | ApiError | ZodError, req: Request, res: Response, next: NextFunction) => {
    let statusCode = 500
    let message = "Internal Server Error"
    let validationErrors = {}

    if (error instanceof ApiError) {

        statusCode = error.statusCode
        message = error.message

    } else if (error instanceof ZodError) {

        statusCode = 400
        message = "Input validation failed. Please check your input."
        validationErrors = flattenError(error).fieldErrors

    } else if (error instanceof Prisma.PrismaClientUnknownRequestError ||
        error instanceof Prisma.PrismaClientKnownRequestError ||
        error instanceof Prisma.PrismaClientValidationError
    ) {

        statusCode = 400
        message = "A database error occurred while processing your request."
    }

    res.status(statusCode).json({
        success: false,
        data: null,
        message: message,
        ...(validationErrors && { validationErrors })
    })
};
