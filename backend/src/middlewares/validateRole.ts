import { Request, Response, NextFunction } from "express";

/**
 * Middleware factory that validates user roles.
 * Usage: validateRole("admin") or validateRole("admin", "vendor")
 */
export const validateRole = (...allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const userRole = req.user?.role;

        if (!userRole || !allowedRoles.includes(userRole)) {
            res.status(403).json({
                success: false,
                message: "You don't have permission to access this resource",
            });
            return;
        }

        next();
    };
};
