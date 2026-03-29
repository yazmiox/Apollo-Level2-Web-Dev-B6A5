import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import EquipmentListSkeleton from "./_components/EquipmentListSkeleton";

export default function EquipmentLoading() {
  return (
    <>
      <Navbar />

      {/* ── Page Header ── */}
      <div className="bg-[#111] pt-28 pb-12">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.15em] text-[#e8612e]">Catalog</p>
          <h1
            className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Browse Equipment
          </h1>
        </div>
      </div>

      {/* ── Filter Bar Skeleton ── */}
      <div className="sticky top-0 z-30 border-b border-[#e0dbd3] bg-white shadow-sm py-4">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            {/* Search Placeholder */}
            <div className="h-10 flex-1 animate-pulse rounded-[7px] border border-[#e0dbd3] bg-[#f9f8f6]" />
            
            {/* Status Filter Placeholder */}
            <div className="h-10 w-32 animate-pulse rounded-[7px] border border-[#e0dbd3] bg-[#f9f8f6]" />
            
            {/* Sort Filter Placeholder */}
            <div className="h-10 w-32 animate-pulse rounded-[7px] border border-[#e0dbd3] bg-[#f9f8f6]" />
          </div>

          {/* Category Pills Placeholder */}
          <div className="mt-4 flex gap-2 overflow-x-auto pb-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-8 w-24 shrink-0 animate-pulse rounded-full border border-[#e0dbd3] bg-white"
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Results Skeleton ── */}
      <EquipmentListSkeleton />

      <Footer />
    </>
  );
}
