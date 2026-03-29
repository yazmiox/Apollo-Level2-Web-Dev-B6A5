import { Suspense } from "react";
import { getAllCategories } from "../actions/equipment";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import EquipmentFilters from "./_components/EquipmentFilters";
import EquipmentList from "./_components/EquipmentList";
import EquipmentListSkeleton from "./_components/EquipmentListSkeleton";

export default async function EquipmentPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams
  const categories = await getAllCategories();
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

      {/* ── Filter Bar ── */}
      <div className="sticky top-0 z-30 border-b border-[#e0dbd3] bg-white shadow-sm">
        <EquipmentFilters categories={categories} />
      </div>

      {/* ── Results ── */}
      <Suspense key={JSON.stringify(params)} fallback={<EquipmentListSkeleton />}>
        <EquipmentList searchParams={params} />
      </Suspense>

      <Footer />
    </>
  );
}
