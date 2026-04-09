import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import { DEMO_ADMIN_EMAILS } from "../lib/env";

const WRITE_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

const demoAdminEmails = new Set(
    (DEMO_ADMIN_EMAILS ?? "")
        .split(",")
        .map((email) => email.trim().toLowerCase())
        .filter(Boolean)
);

export const validateRole = (role: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (req.user?.role !== role) {
            next(new ApiError(403, "You do not have permission to perform this action"));
            return;
        }

        // Demo admin accounts can read everything, but cannot perform write operations.
        const isWriteMethod = WRITE_METHODS.has(req.method.toUpperCase());
        const currentUserEmail = req.user?.email?.toLowerCase() ?? "";
        const isDemoAdmin = role === "admin" && demoAdminEmails.has(currentUserEmail);
        if (isDemoAdmin && isWriteMethod) {
            next(new ApiError(403, "Demo admin account is view-only. Write actions are disabled."));
            return;
        }

        next()
    };
};
