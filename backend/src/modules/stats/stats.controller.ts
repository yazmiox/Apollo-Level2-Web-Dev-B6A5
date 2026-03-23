import { Request, Response } from "express";
import { getStats } from "./stats.service";

export const getStatsController = async (req: Request, res: Response) => {
    const stats = await getStats(req.user.role);
    res.json({ success: true, data: stats })
}