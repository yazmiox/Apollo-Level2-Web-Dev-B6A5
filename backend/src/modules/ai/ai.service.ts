import prisma from "../../lib/prisma";
import groq from "../../lib/ai";

type SuggestionType = "item" | "category";

export type SearchSuggestion = {
    title: string;
    type: SuggestionType;
    slug: string;
};

type ContextItem = {
    name: string;
    slug: string;
    category: string | null | undefined;
};

type ContextCategory = {
    name: string;
    slug: string;
};

const sanitizeSuggestionList = (input: unknown): SearchSuggestion[] => {
    if (!Array.isArray(input)) return [];

    const unique = new Set<string>();
    const suggestions: SearchSuggestion[] = [];

    for (const entry of input) {
        if (!entry || typeof entry !== "object") continue;

        const title = typeof (entry as { title?: unknown }).title === "string"
            ? (entry as { title: string }).title.trim()
            : "";
        const type = typeof (entry as { type?: unknown }).type === "string"
            ? (entry as { type: string }).type.trim().toLowerCase()
            : "";
        const slug = typeof (entry as { slug?: unknown }).slug === "string"
            ? (entry as { slug: string }).slug.trim()
            : "";

        if (!title || !slug || (type !== "item" && type !== "category")) continue;

        const dedupeKey = `${type}:${slug}`;
        if (unique.has(dedupeKey)) continue;
        unique.add(dedupeKey);

        suggestions.push({ title, type: type as SuggestionType, slug });
        if (suggestions.length === 5) break;
    }

    return suggestions;
};

const parseAiSuggestions = (text: string): SearchSuggestion[] => {
    const cleaned = text.replace(/```json|```/g, "").trim();
    if (!cleaned) return [];

    try {
        return sanitizeSuggestionList(JSON.parse(cleaned));
    } catch {
        const firstBracket = cleaned.indexOf("[");
        const lastBracket = cleaned.lastIndexOf("]");

        if (firstBracket === -1 || lastBracket === -1 || lastBracket <= firstBracket) {
            return [];
        }

        const jsonSlice = cleaned.slice(firstBracket, lastBracket + 1);

        try {
            return sanitizeSuggestionList(JSON.parse(jsonSlice));
        } catch {
            return [];
        }
    }
};

const getFallbackSuggestions = (
    q: string,
    items: ContextItem[],
    categories: ContextCategory[]
): SearchSuggestion[] => {
    const normalizedQuery = q.trim().toLowerCase();

    const matchedCategories = categories
        .filter((category) => category.name.toLowerCase().includes(normalizedQuery))
        .slice(0, 3)
        .map<SearchSuggestion>((category) => ({
            title: category.name,
            type: "category",
            slug: category.slug,
        }));

    const matchedItems = items
        .filter((item) =>
            item.name.toLowerCase().includes(normalizedQuery) ||
            (item.category ?? "").toLowerCase().includes(normalizedQuery)
        )
        .slice(0, 5)
        .map<SearchSuggestion>((item) => ({
            title: item.name,
            type: "item",
            slug: item.slug,
        }));

    const popularFallback = [
        ...categories.slice(0, 2).map<SearchSuggestion>((category) => ({
            title: category.name,
            type: "category",
            slug: category.slug,
        })),
        ...items.slice(0, 3).map<SearchSuggestion>((item) => ({
            title: item.name,
            type: "item",
            slug: item.slug,
        })),
    ];

    return sanitizeSuggestionList(
        normalizedQuery ? [...matchedCategories, ...matchedItems] : popularFallback
    );
};

export const getSearchSuggestions = async (q: string) => {
    const normalizedQuery = q.trim();
    if (normalizedQuery.length < 2) return [];

    // 1. Fetch available equipment names and categories for context
    const [equipments, categories] = await Promise.all([
        prisma.equipment.findMany({
            select: { name: true, slug: true, category: { select: { name: true } } },
            where: { status: "AVAILABLE" },
            take: 60
        }),
        prisma.category.findMany({
            select: { name: true, slug: true }
        })
    ]);

    const contextItems: ContextItem[] = equipments.map((equipment) => ({
        name: equipment.name,
        slug: equipment.slug,
        category: equipment.category?.name,
    }));
    const contextCategories: ContextCategory[] = categories.map((category) => ({
        name: category.name,
        slug: category.slug,
    }));

    const context = {
        items: contextItems,
        categories: contextCategories,
    };

    // 2. Prepare the prompt for structured JSON output
    const prompt = `
        You are the search assistant for "EquipFlow", an equipment rental platform.
        Current Inventory Context (Items & Categories): ${JSON.stringify(context)}
        
        User Query: "${normalizedQuery}"
        
        Tasks:
        1. Suggest up to 5 relevant items or categories from the context.
        2. Only suggest entries that exist in the provided context.
        3. Prefer exact/close matches first.
        
        Return ONLY a JSON array. No markdown.
        Format: [{"title": "Name", "type": "item|category", "slug": "slug"}]
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

        const text = response.choices[0]?.message?.content ?? "[]";
        const aiSuggestions = parseAiSuggestions(text);
        if (aiSuggestions.length > 0) return aiSuggestions;

        return getFallbackSuggestions(normalizedQuery, contextItems, contextCategories);
    } catch (error) {
        return getFallbackSuggestions(normalizedQuery, contextItems, contextCategories);
    }
}
