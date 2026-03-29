export default function FeaturedEquipmentsSkeleton() {
  const dummyItems = Array.from({ length: 3 });

  return (
    <section className="bg-[#111] py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mb-12 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 h-3 w-24 animate-pulse rounded bg-white/5" />
            <div className="h-10 w-64 animate-pulse rounded bg-white/5 sm:h-12 sm:w-80" />
          </div>
          <div className="h-10 w-28 animate-pulse rounded-[7px] bg-white/5" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {dummyItems.map((_, i) => (
            <div
              key={i}
              className="flex flex-col overflow-hidden rounded-xl border border-white/5 bg-[#1a1a1a]"
            >
              {/* Photo placeholder */}
              <div className="h-48 animate-pulse bg-white/5" />

              {/* Body */}
              <div className="p-5">
                <div className="mb-2 h-2.5 w-16 animate-pulse rounded bg-white/5" />
                <div className="mb-3 h-5 w-3/4 animate-pulse rounded bg-white/5" />
                <div className="space-y-2 mb-5">
                   <div className="h-3 w-full animate-pulse rounded bg-white/5" />
                   <div className="h-3 w-5/6 animate-pulse rounded bg-white/5" />
                </div>

                <div className="flex items-center justify-between border-t border-white/5 pt-4">
                  <div className="flex items-center gap-1">
                    <div className="h-6 w-12 animate-pulse rounded bg-white/5" />
                    <div className="h-3 w-6 animate-pulse rounded bg-white/5 opacity-50" />
                  </div>
                  <div className="h-6 w-20 animate-pulse rounded-md bg-white/5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
