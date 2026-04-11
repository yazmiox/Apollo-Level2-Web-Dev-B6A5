import prisma from "../../lib/prisma";
import groq from "../../lib/ai";
import {
    CHAT_FAQS,
    DEFAULT_CHAT_SUGGESTIONS,
    ChatFaqEntry,
    ChatQuickAction,
} from "./ai.chat.config";

export type ChatRole = "user" | "assistant";

export type ChatHistoryMessage = {
    role: ChatRole;
    content: string;
};

export type ChatAssistantResponse = {
    reply: string;
    suggestions: ChatQuickAction[];
};

const sanitizeHistory = (history: unknown): ChatHistoryMessage[] => {
    if (!Array.isArray(history)) return [];

    return history
        .filter((item): item is ChatHistoryMessage => {
            if (!item || typeof item !== "object") return false;
            const role = (item as { role?: unknown }).role;
            const content = (item as { content?: unknown }).content;
            return (
                (role === "user" || role === "assistant") &&
                typeof content === "string" &&
                content.trim().length > 0
            );
        })
        .map((item) => ({
            role: item.role,
            content: item.content.trim().slice(0, 500),
        }))
        .slice(-8);
};

const findRelevantFaqs = (message: string): ChatFaqEntry[] => {
    const query = message.toLowerCase();

    const scored = CHAT_FAQS.map((faq) => {
        const questionMatch = faq.question.toLowerCase().includes(query) ? 3 : 0;
        const tagMatches = faq.tags.reduce((score, tag) => {
            return score + (query.includes(tag.toLowerCase()) ? 2 : 0);
        }, 0);
        return { faq, score: questionMatch + tagMatches };
    })
        .filter((entry) => entry.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
        .map((entry) => entry.faq);

    return scored;
};

const parseAssistantJson = (text: string): ChatAssistantResponse | null => {
    const cleaned = text.replace(/```json|```/g, "").trim();
    if (!cleaned) return null;

    const tryParse = (value: string): ChatAssistantResponse | null => {
        try {
            const parsed = JSON.parse(value) as {
                reply?: unknown;
                suggestions?: unknown;
            };

            if (typeof parsed.reply !== "string" || !parsed.reply.trim()) return null;

            const suggestions = Array.isArray(parsed.suggestions)
                ? parsed.suggestions
                    .filter((item): item is ChatQuickAction => {
                        if (!item || typeof item !== "object") return false;
                        const label = (item as { label?: unknown }).label;
                        const href = (item as { href?: unknown }).href;
                        return (
                            typeof label === "string" &&
                            label.trim().length > 0 &&
                            typeof href === "string" &&
                            href.startsWith("/")
                        );
                    })
                    .slice(0, 3)
                : [];

            return {
                reply: parsed.reply.trim(),
                suggestions: suggestions.length > 0 ? suggestions : DEFAULT_CHAT_SUGGESTIONS,
            };
        } catch {
            return null;
        }
    };

    const parsedClean = tryParse(cleaned);
    if (parsedClean) return parsedClean;

    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start === -1 || end === -1 || end <= start) return null;

    return tryParse(cleaned.slice(start, end + 1));
};

const getFallbackResponse = (message: string): ChatAssistantResponse => {
    const relevantFaqs = findRelevantFaqs(message);
    if (relevantFaqs.length > 0) {
        return {
            reply: relevantFaqs[0].answer,
            suggestions: relevantFaqs[0].suggestions ?? DEFAULT_CHAT_SUGGESTIONS,
        };
    }

    return {
        reply:
            "I can help with booking steps, equipment search, payment, returns, and account questions. Ask me something like 'How do I book a camera?'",
        suggestions: DEFAULT_CHAT_SUGGESTIONS,
    };
};

export const getChatAssistantReply = async (
    message: string,
    historyInput: unknown
): Promise<ChatAssistantResponse> => {
    const normalizedMessage = message.trim();
    if (!normalizedMessage) {
        return {
            reply: "Please type your question and I will help.",
            suggestions: DEFAULT_CHAT_SUGGESTIONS,
        };
    }

    const history = sanitizeHistory(historyInput);
    const relevantFaqs = findRelevantFaqs(normalizedMessage);

    const [categories, items] = await Promise.all([
        prisma.category.findMany({
            select: { name: true, slug: true },
            take: 10,
        }),
        prisma.equipment.findMany({
            where: { status: "AVAILABLE" },
            select: { name: true, slug: true, category: { select: { name: true } } },
            take: 16,
        }),
    ]);

    const prompt = `
You are EquipFlow Assistant.
Your job is to answer user questions about booking, equipment, payment, returns, and account guidance.

Rules:
1. Be concise and practical.
2. Prefer using FAQ context when relevant.
3. Only mention equipment/categories from provided catalog context.
4. If uncertain, say what you do know and suggest a helpful next action.
5. Output ONLY valid JSON.

FAQ Context:
${JSON.stringify(relevantFaqs.length > 0 ? relevantFaqs : CHAT_FAQS.slice(0, 3))}

Catalog Context:
${JSON.stringify({
        categories,
        items: items.map((item) => ({
            name: item.name,
            slug: item.slug,
            category: item.category?.name ?? null,
        })),
    })}

Conversation History:
${JSON.stringify(history)}

User Message:
"${normalizedMessage}"

Return JSON in this exact format:
{
  "reply": "assistant response text",
  "suggestions": [
    { "label": "Browse Equipment", "href": "/equipment" }
  ]
}
`;

    try {
        const response = await groq.chat.completions.create({
            model: "openai/gpt-oss-120b",
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
        });

        const text = response.choices[0]?.message?.content ?? "";
        const parsed = parseAssistantJson(text);
        if (parsed) return parsed;

        return getFallbackResponse(normalizedMessage);
    } catch (error) {
        return getFallbackResponse(normalizedMessage);
    }
};

