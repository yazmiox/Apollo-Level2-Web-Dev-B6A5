"use client";

import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, useTransition, useEffect } from "react";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
}

export default function Pagination({ totalPages, currentPage }: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [pendingPage, setPendingPage] = useState<number | "prev" | "next" | null>(null);

  const handlePageChange = (page: number | "prev" | "next") => {
    let targetPage: number;
    if (page === "prev") targetPage = currentPage - 1;
    else if (page === "next") targetPage = currentPage + 1;
    else targetPage = page;

    if (targetPage < 1 || targetPage > totalPages || targetPage === currentPage) return;

    setPendingPage(page);
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", targetPage.toString());

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  // Reset pending state when transition completes
  useEffect(() => {
    if (!isPending) setPendingPage(null);
  }, [isPending]);

  return (
    <div className="mt-10 flex items-center justify-center gap-2">
      <button
        onClick={() => handlePageChange("prev")}
        disabled={currentPage === 1 || isPending}
        className="flex h-9 w-9 items-center justify-center rounded-md border border-[#e0dbd3] bg-white text-[#555] hover:bg-[#f9f8f6] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {isPending && pendingPage === "prev" ? <Loader2 size={16} className="animate-spin" /> : <ChevronLeft size={16} />}
      </button>

      <div className="flex items-center gap-1">
        {Array.from({ length: totalPages }).map((_, i) => {
          const p = i + 1;
          const isCurrentPending = isPending && pendingPage === p;

          return (
            <button
              key={i}
              onClick={() => handlePageChange(p)}
              disabled={isPending}
              className={`flex h-9 w-9 items-center justify-center rounded-md text-sm font-semibold transition-all ${currentPage === p
                  ? "bg-[#e8612e] text-white"
                  : "border border-[#e0dbd3] bg-white text-[#555] hover:bg-[#f9f8f6] disabled:opacity-50"
                }`}
            >
              {isCurrentPending ? <Loader2 size={16} className="animate-spin" /> : p}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => handlePageChange("next")}
        disabled={currentPage === totalPages || isPending}
        className="flex h-9 w-9 items-center justify-center rounded-md border border-[#e0dbd3] bg-white text-[#555] hover:bg-[#f9f8f6] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {isPending && pendingPage === "next" ? <Loader2 size={16} className="animate-spin" /> : <ChevronRight size={16} />}
      </button>
    </div>
  );
}
