export default function BookingsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* ── Header Area ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <div className="h-9 w-48 bg-[#f0ece5] rounded-lg"></div>
          <div className="h-4 w-64 bg-[#f0ece5] rounded-md"></div>
        </div>

        {/* Filter Tabs Placeholder */}
        <div className="h-11 w-64 bg-[#f9f8f6] border border-[#e0dbd3] rounded-[9px]"></div>
      </div>

      {/* ── Main List Container ── */}
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="flex flex-col gap-5 rounded-2xl border border-[#e0dbd3] bg-white p-5 shadow-sm"
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-5">
              {/* Image Preview Placeholder */}
              <div className="h-24 w-full shrink-0 rounded-xl bg-[#f4f1ed] sm:w-32"></div>

              {/* Name and Info Placeholder */}
              <div className="flex flex-1 flex-col gap-3">
                <div className="h-5 w-48 bg-[#f0ece5] rounded-md"></div>
                <div className="flex flex-wrap gap-4">
                  <div className="h-4 w-32 bg-[#f4f1ed] rounded-md"></div>
                  <div className="h-4 w-32 bg-[#f4f1ed] rounded-md"></div>
                </div>
              </div>

              {/* Status Badge Placeholder */}
              <div className="flex flex-col items-center justify-center min-w-[120px]">
                <div className="h-6 w-24 bg-[#f4f1ed] rounded-full"></div>
              </div>

              {/* Actions and Price Placeholder */}
              <div className="flex shrink-0 flex-col items-end gap-3 min-w-[140px]">
                <div className="h-7 w-20 bg-[#f0ece5] rounded-md"></div>
                <div className="h-9 w-28 bg-[#f9f8f6] border border-[#e0dbd3] rounded-lg"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}