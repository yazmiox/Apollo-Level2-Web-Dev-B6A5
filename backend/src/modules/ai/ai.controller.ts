import { Request, Response } from "express";

import * as aiService from "./ai.service";
import * as aiChatService from "./ai.chat.service";

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

export const chatWithAssistant = async (req: Request, res: Response) => {
    const message = typeof req.body?.message === "string" ? req.body.message : "";
    const history = req.body?.history;

    if (!message.trim()) {
        return res.json({
            success: true,
            data: {
                reply: "Please type your question and I will help.",
                suggestions: [
                    { label: "Browse Equipment", href: "/equipment" },
                    { label: "My Bookings", href: "/dashboard/bookings" },
                ],
            },
        });
    }

    const chatResponse = await aiChatService.getChatAssistantReply(message, history);
    res.json({ success: true, data: chatResponse });
};
