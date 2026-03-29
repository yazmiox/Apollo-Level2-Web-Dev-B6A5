export default function TestimonialsSkeleton() {
  const dummyItems = Array.from({ length: 3 });

  return (
    <section className="bg-[#1a1a1a] py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mb-14">
          <div className="mb-3 h-3 w-24 animate-pulse rounded bg-white/5" />
          <div className="h-10 w-64 animate-pulse rounded bg-white/5 sm:h-12 sm:w-80" />
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {dummyItems.map((_, i) => (
            <div
              key={i}
              className="flex flex-col rounded-xl border border-white/5 bg-[#111] p-7 transition-colors"
            >
              {/* Stars placeholder */}
              <div className="mb-5 flex gap-1">
                {[...Array(5)].map((_, j) => (
                  <div key={j} className="h-3 w-3 animate-pulse rounded-full bg-white/5" />
                ))}
              </div>

              {/* Quote text placeholder */}
              <div className="mb-2 h-3 w-full animate-pulse rounded bg-white/5" />
              <div className="mb-2 h-3 w-full animate-pulse rounded bg-white/5" />
              <div className="mb-7 h-3 w-4/5 animate-pulse rounded bg-white/5" />

              <div className="flex items-center gap-3">
                <div className="h-9 w-9 animate-pulse rounded-full bg-white/5" />
                <div className="space-y-2">
                  <div className="h-3 w-20 animate-pulse rounded bg-white/5" />
                  <div className="h-2 w-16 animate-pulse rounded bg-white/5 opacity-50" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
