export default function Loading() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex flex-col gap-1">
        <div className="h-9 w-48 animate-pulse rounded-lg bg-[#f0ece5]" />
        <div className="h-4 w-72 animate-pulse rounded-lg bg-[#f0ece5]" />
      </div>

      {/* Table Skeleton */}
      <div className="rounded-2xl border border-[#e0dbd3] bg-white shadow-sm overflow-hidden">
        
        {/* Toolbar Skeleton */}
        <div className="border-b border-[#f0ece5] p-4 bg-[#f9f8f6] flex gap-4">
          <div className="h-10 max-w-sm flex-1 animate-pulse rounded-[8px] bg-[#f0ece5]" />
        </div>

        {/* Table Head Skeleton */}
        <div className="border-b border-[#f0ece5] bg-[#f9f8f6] h-12 flex items-center px-6 gap-20">
            <div className="h-3 w-32 animate-pulse rounded bg-[#f0ece5]" />
            <div className="h-3 w-24 animate-pulse rounded bg-[#f0ece5]" />
            <div className="h-3 w-20 animate-pulse rounded bg-[#f0ece5]" />
            <div className="h-3 w-32 animate-pulse rounded bg-[#f0ece5]" />
        </div>

        {/* Rows Skeleton */}
        <div className="divide-y divide-[#f0ece5]">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex h-[72px] items-center px-6 gap-10">
              <div className="flex items-center gap-3 flex-1">
                <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-[#f0ece5]" />
                <div className="space-y-2">
                  <div className="h-3.5 w-32 animate-pulse rounded bg-[#f0ece5]" />
                  <div className="h-3 w-48 animate-pulse rounded bg-[#f0ece5]" />
                </div>
              </div>
              <div className="h-4 w-24 animate-pulse rounded bg-[#f0ece5]" />
              <div className="h-6 w-20 animate-pulse rounded-lg bg-[#f0ece5]" />
              <div className="h-4 w-32 animate-pulse rounded bg-[#f0ece5]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
