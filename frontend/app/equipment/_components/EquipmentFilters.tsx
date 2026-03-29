"use client";

import { Search, Loader2 } from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTransition, useEffect, useState } from "react";

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

  const [q, setQ] = useState(searchParams.get("q") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "all");
  const [status, setStatus] = useState(searchParams.get("status") || "all");
  const [sort, setSort] = useState(searchParams.get("sort") || "default");

  // Sync state with URL when it changes (back/forward navigation)
  useEffect(() => {
    setQ(searchParams.get("q") || "");
    setCategory(searchParams.get("category") || "all");
    setStatus(searchParams.get("status") || "all");
    setSort(searchParams.get("sort") || "default");
  }, [searchParams]);

  const updateParams = (updates: Record<string, string>) => {
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
  };

  // Debounced search for the text input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (q !== (searchParams.get("q") || "")) {
        updateParams({ q });
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [q]);

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
            onChange={(e) => setQ(e.target.value)}
            className="w-full rounded-[7px] border border-[#e0dbd3] bg-[#f9f8f6] py-2.5 pl-9 pr-4 text-sm text-[#111] placeholder-[#aaa] outline-none focus:border-[#e8612e] focus:ring-1 focus:ring-[#e8612e]/30 transition-all"
          />
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
