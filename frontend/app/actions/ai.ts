export type AiSuggestionType = "item" | "category";

export interface AiSuggestion {
    title: string;
    type: AiSuggestionType;
    slug: string;
}

type AiSuggestionResponse = {
    success?: boolean;
    data?: AiSuggestion[];
};

export type AiChatRole = "user" | "assistant";

export type AiChatHistoryMessage = {
    role: AiChatRole;
    content: string;
};

export type AiChatQuickAction = {
    label: string;
    href: string;
};

export type AiChatResponse = {
    reply: string;
    suggestions: AiChatQuickAction[];
};

type AiChatApiResponse = {
    success?: boolean;
    data?: AiChatResponse;
};

export async function getAiSuggestions(query: string, signal?: AbortSignal): Promise<AiSuggestion[]> {
    const normalizedQuery = query.trim();
    if (normalizedQuery.length < 2) return [];

    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
    if (!serverUrl) return [];

    try {
        const response = await fetch(
            `${serverUrl}/api/ai/suggestions?q=${encodeURIComponent(normalizedQuery)}`,
            {
                method: "GET",
                signal,
            }
        );

        if (!response.ok) return [];

        const data = (await response.json()) as AiSuggestionResponse;
        if (!data.success || !Array.isArray(data.data)) return [];

        return data.data
            .filter((item) =>
                item &&
                typeof item.title === "string" &&
                typeof item.slug === "string" &&
                (item.type === "item" || item.type === "category")
            )
            .slice(0, 5);
    } catch (error) {
        return [];
    }
}

export async function sendAiChatMessage(
    message: string,
    history: AiChatHistoryMessage[],
    signal?: AbortSignal
): Promise<AiChatResponse> {
    const normalizedMessage = message.trim();
    if (!normalizedMessage) {
        return {
            reply: "Please type your question and I will help.",
            suggestions: [],
        };
    }

    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
    if (!serverUrl) {
        return {
            reply: "Chat service is not configured yet. Please set NEXT_PUBLIC_SERVER_URL.",
            suggestions: [],
        };
    }

    try {
        const response = await fetch(`${serverUrl}/api/ai/chat`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                message: normalizedMessage,
                history: history.slice(-8),
            }),
            signal,
        });

        if (!response.ok) {
            return {
                reply: "I couldn't connect right now. Please try again in a moment.",
                suggestions: [],
            };
        }

        const data = (await response.json()) as AiChatApiResponse;
        if (!data.success || !data.data || typeof data.data.reply !== "string") {
            return {
                reply: "I couldn't generate a response this time. Please ask again.",
                suggestions: [],
            };
        }

        return {
            reply: data.data.reply,
            suggestions: Array.isArray(data.data.suggestions) ? data.data.suggestions.slice(0, 3) : [],
        };
    } catch (error) {
        return {
            reply: "Something went wrong while contacting the assistant. Please try again.",
            suggestions: [],
        };
    }
}
