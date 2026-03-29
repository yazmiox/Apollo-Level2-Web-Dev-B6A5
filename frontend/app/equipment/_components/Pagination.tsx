"use client";

import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTransition } from "react";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
}

export default function Pagination({ totalPages, currentPage }: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  return (
    <div className="mt-10 flex items-center justify-center gap-2">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1 || isPending}
        className="flex h-9 w-9 items-center justify-center rounded-md border border-[#e0dbd3] bg-white text-[#555] hover:bg-[#f9f8f6] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {isPending ? <Loader2 size={16} className="animate-spin" /> : <ChevronLeft size={16} />}
      </button>
      
      <div className="flex items-center gap-1">
        {Array.from({ length: totalPages }).map((_, i) => {
          const p = i + 1;
          return (
            <button
              key={i}
              onClick={() => handlePageChange(p)}
              disabled={isPending}
              className={`flex h-9 w-9 items-center justify-center rounded-md text-sm font-semibold transition-all ${
                currentPage === p
                  ? "bg-[#e8612e] text-white"
                  : "border border-[#e0dbd3] bg-white text-[#555] hover:bg-[#f9f8f6] disabled:opacity-50"
              }`}
            >
              {p}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages || isPending}
        className="flex h-9 w-9 items-center justify-center rounded-md border border-[#e0dbd3] bg-white text-[#555] hover:bg-[#f9f8f6] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {isPending ? <Loader2 size={16} className="animate-spin" /> : <ChevronRight size={16} />}
      </button>
    </div>
  );
}
