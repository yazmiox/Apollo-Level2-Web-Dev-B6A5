"use client";

import { Search, Loader2 } from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTransition, useEffect, useState } from "react";

interface SearchBoxProps {
  placeholder?: string;
}

export default function SearchBox({ placeholder = "Search..." }: SearchBoxProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [value, setValue] = useState(searchParams.get("q") || "");

  // Debounce search update to URL
  useEffect(() => {
    const currentQ = searchParams.get("q") || "";
    // Avoid redundant transitions if the value hasn't actually changed
    if (value === currentQ) return;

    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set("q", value);
      } else {
        params.delete("q");
      }
      // Reset page to 1 on new search
      params.delete("page");

      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
      });
    }, 400);

    return () => clearTimeout(timer);
  }, [value, pathname, router, searchParams]);

  return (
    <div className="relative max-w-sm flex-1">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#aaa]">
        {isPending ? (
          <Loader2 className="animate-spin" size={16} />
        ) : (
          <Search size={16} />
        )}
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-[8px] border border-[#e0dbd3] bg-white px-4 py-2 pl-9 text-sm text-[#111] outline-none transition-all focus:border-[#e8612e] focus:ring-1 focus:ring-[#e8612e]/30"
      />
    </div>
  );
}
