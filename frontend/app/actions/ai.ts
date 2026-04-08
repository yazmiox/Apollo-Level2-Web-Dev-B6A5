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
        if ((error as Error).name !== "AbortError") {
            console.error("Suggestions fetch error:", error);
        }
        return [];
    }
}
