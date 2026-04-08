import { Request, Response } from "express";

import * as aiService from "./ai.service";

export const getSuggestions = async (req: Request, res: Response) => {
    const queryFromParams = typeof req.query.q === "string" ? req.query.q : "";
    const queryFromBody = typeof req.body?.q === "string" ? req.body.q : "";
    const q = queryFromParams || queryFromBody;

    if (!q.trim()) {
        return res.json({ success: true, data: [] });
    }

    const suggestions = await aiService.getSearchSuggestions(q);
    res.json({ success: true, data: suggestions });
};
