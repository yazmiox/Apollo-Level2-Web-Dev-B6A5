export default function EquipmentListSkeleton() {
  const skeletonItems = Array.from({ length: 6 });

  return (
    <main className="min-h-screen bg-stone py-10">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        {/* Result count placeholder */}
        <div className="mb-6 flex items-center gap-2">
          <div className="h-4 w-40 animate-pulse rounded bg-[#e0dbd3]" />
        </div>

        {/* Grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {skeletonItems.map((_, i) => (
            <div
              key={i}
              className="flex flex-col overflow-hidden rounded-xl border border-[#e0dbd3] bg-white transition-all duration-300"
            >
              {/* Photo placeholder */}
              <div className="h-52 animate-pulse bg-[#f0ece5]" />

              {/* Body */}
              <div className="flex flex-1 flex-col p-5">
                <div className="mb-3 flex items-center justify-between">
                  <div className="h-3 w-16 animate-pulse rounded bg-[#e0dbd3]" />
                  <div className="h-4 w-12 animate-pulse rounded bg-[#f0ece5]" />
                </div>

                {/* Title */}
                <div className="mb-3 h-5 w-3/4 animate-pulse rounded bg-[#e0dbd3]" />

                {/* Description lines */}
                <div className="mb-2 h-3 w-full animate-pulse rounded bg-[#f0ece5]" />
                <div className="mb-5 h-3 w-5/6 animate-pulse rounded bg-[#f0ece5]" />

                {/* Meta row */}
                <div className="mb-6 flex gap-3">
                  <div className="h-3 w-20 animate-pulse rounded bg-[#f0ece5]" />
                  <div className="h-3 w-16 animate-pulse rounded bg-[#f0ece5]" />
                </div>

                {/* Price + CTA */}
                <div className="flex items-center justify-between border-t border-[#f0ece5] pt-4">
                  <div className="flex items-baseline gap-1">
                    <div className="h-6 w-12 animate-pulse rounded bg-[#e0dbd3]" />
                    <div className="h-3 w-6 animate-pulse rounded bg-[#f0ece5]" />
                  </div>
                  <div className="h-8 w-24 animate-pulse rounded-[7px] bg-[#f0ece5]" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
