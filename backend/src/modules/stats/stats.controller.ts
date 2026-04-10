import { Request, Response } from "express";
import { getStats } from "./stats.service";

export const getStatsController = async (req: Request, res: Response, next: any) => {
    try {
        const stats = await getStats(req.user.role, req.user.id);
        res.json({ success: true, message: "Stats fetched successfully", data: stats })
    } catch (error) {
        next(error)
    }
}