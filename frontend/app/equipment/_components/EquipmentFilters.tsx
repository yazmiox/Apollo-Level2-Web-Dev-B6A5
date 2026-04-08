"use client";

import { Search, Loader2, Package, Tag } from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTransition, useEffect, useRef, useState, useCallback } from "react";
import { AiSuggestion, getAiSuggestions } from "@/app/actions/ai";

interface Category {
  id: string;
  name: string;
  slug: string
}

interface EquipmentFiltersProps {
  categories: Category[];
}

const STATUSES = [
  { value: "all", label: "All Statuses" },
  { value: "AVAILABLE", label: "Available" },
  { value: "MAINTENANCE", label: "Maintenance" },
  { value: "DAMAGED", label: "Damaged" },
  { value: "ARCHIVED", label: "Archived" },
];

const SORT_OPTIONS = [
  { value: "default", label: "Default Sort" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A → Z" },
];

export default function EquipmentFilters({ categories }: EquipmentFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const blurTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [q, setQ] = useState(searchParams.get("q") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "all");
  const [status, setStatus] = useState(searchParams.get("status") || "all");
  const [sort, setSort] = useState(searchParams.get("sort") || "default");
  const [suggestions, setSuggestions] = useState<AiSuggestion[]>([]);
  const [isSuggestionsLoading, setIsSuggestionsLoading] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);

  // Sync state with URL when it changes (back/forward navigation)
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setQ(searchParams.get("q") || "");
    setCategory(searchParams.get("category") || "all");
    setStatus(searchParams.get("status") || "all");
    setSort(searchParams.get("sort") || "default");
  }, [searchParams]);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    return () => {
      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current);
      }
    };
  }, []);

  const updateParams = useCallback((updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());

    // Reset to page 1 on any filter change
    params.delete("page");

    Object.entries(updates).forEach(([key, value]) => {
      if (value && value !== "all" && value !== "default") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  }, [pathname, router, searchParams, startTransition]);

  const handleSuggestionSelect = (suggestion: AiSuggestion) => {
    setIsSearchFocused(false);
    setSuggestions([]);
    setActiveSuggestionIndex(-1);

    if (suggestion.type === "item") {
      setQ(suggestion.title);
      router.push(`/equipment/${suggestion.slug}`);
      return;
    }

    setQ("");
    setCategory(suggestion.slug);
    updateParams({ q: "", category: suggestion.slug });
  };

  // Debounced search for the text input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (q !== (searchParams.get("q") || "")) {
        updateParams({ q });
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [q, searchParams, updateParams]);

  // Debounced AI suggestions on user input
  useEffect(() => {
    const normalizedQuery = q.trim();

    if (normalizedQuery.length < 2) {
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setIsSuggestionsLoading(true);
      const results = await getAiSuggestions(normalizedQuery, controller.signal);
      setSuggestions(results);
      setActiveSuggestionIndex(-1);
      setIsSuggestionsLoading(false);
    }, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [q]);

  const showSuggestions =
    isSearchFocused && q.trim().length > 1 && (isSuggestionsLoading || suggestions.length > 0);

  return (
    <div className="mx-auto max-w-7xl px-5 lg:px-8">
      <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:gap-4">

        {/* Search */}
        <div className="relative flex-1">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#aaa]">
            {isPending ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <Search size={16} />
            )}
          </div>
          <input
            type="text"
            placeholder="Search equipment, brand..."
            value={q}
            onChange={(e) => {
              const nextValue = e.target.value;
              setQ(nextValue);

              if (nextValue.trim().length < 2) {
                setSuggestions([]);
                setActiveSuggestionIndex(-1);
                setIsSuggestionsLoading(false);
              }
            }}
            onFocus={() => {
              if (blurTimeoutRef.current) {
                clearTimeout(blurTimeoutRef.current);
              }
              setIsSearchFocused(true);
            }}
            onBlur={() => {
              blurTimeoutRef.current = setTimeout(() => {
                setIsSearchFocused(false);
                setActiveSuggestionIndex(-1);
              }, 120);
            }}
            onKeyDown={(e) => {
              if (!showSuggestions || suggestions.length === 0) return;

              if (e.key === "ArrowDown") {
                e.preventDefault();
                setActiveSuggestionIndex((prev) => (prev + 1) % suggestions.length);
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setActiveSuggestionIndex((prev) => (prev <= 0 ? suggestions.length - 1 : prev - 1));
              } else if (e.key === "Enter" && activeSuggestionIndex >= 0) {
                e.preventDefault();
                handleSuggestionSelect(suggestions[activeSuggestionIndex]);
              } else if (e.key === "Escape") {
                setIsSearchFocused(false);
                setActiveSuggestionIndex(-1);
              }
            }}
            className="w-full rounded-[7px] border border-[#e0dbd3] bg-[#f9f8f6] py-2.5 pl-9 pr-4 text-sm text-[#111] placeholder-[#aaa] outline-none focus:border-[#e8612e] focus:ring-1 focus:ring-[#e8612e]/30 transition-all"
          />

          {showSuggestions && (
            <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-[#e0dbd3] bg-white shadow-xl">
              {isSuggestionsLoading ? (
                <div className="flex items-center gap-2 px-4 py-3 text-xs font-medium text-[#777]">
                  <Loader2 size={14} className="animate-spin" />
                  Finding smart suggestions...
                </div>
              ) : (
                <div className="py-1">
                  {suggestions.map((suggestion, index) => {
                    const isActive = index === activeSuggestionIndex;
                    return (
                      <button
                        key={`${suggestion.type}-${suggestion.slug}`}
                        type="button"
                        onMouseDown={(event) => event.preventDefault()}
                        onMouseEnter={() => setActiveSuggestionIndex(index)}
                        onClick={() => handleSuggestionSelect(suggestion)}
                        className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors ${isActive
                          ? "bg-[#fff1ea] text-[#111]"
                          : "text-[#555] hover:bg-[#f9f8f6]"
                          }`}
                      >
                        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#f3eee7] text-[#7a6f63]">
                          {suggestion.type === "item" ? <Package size={14} /> : <Tag size={14} />}
                        </span>
                        <span className="flex-1 text-sm font-medium">{suggestion.title}</span>
                        <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#aaa]">
                          {suggestion.type}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Status Filter */}
        <select
          value={status}
          onChange={(e) => {
            const val = e.target.value;
            setStatus(val);
            updateParams({ status: val });
          }}
          className="rounded-[7px] border border-[#e0dbd3] bg-[#f9f8f6] px-3 py-2.5 text-sm text-[#444] outline-none focus:border-[#e8612e] transition-all"
        >
          {STATUSES.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>

        {/* Sort */}
        <select
          value={sort}
          onChange={(e) => {
            const val = e.target.value;
            setSort(val);
            updateParams({ sort: val });
          }}
          className="rounded-[7px] border border-[#e0dbd3] bg-[#f9f8f6] px-3 py-2.5 text-sm text-[#444] outline-none focus:border-[#e8612e] transition-all"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* Category pills */}
      <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
        <button
          onClick={() => {
            setCategory("all");
            updateParams({ category: "all" });
          }}
          className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${category === "all"
            ? "bg-[#e8612e] text-white"
            : "border border-[#e0dbd3] bg-white text-[#666] hover:border-[#e8612e]/40 hover:text-[#e8612e]"
            }`}
        >
          All Categories
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              setCategory(cat.slug);
              updateParams({ category: cat.slug });
            }}
            className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${category === cat.slug
              ? "bg-[#e8612e] text-white"
              : "border border-[#e0dbd3] bg-white text-[#666] hover:border-[#e8612e]/40 hover:text-[#e8612e]"
              }`}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
}
