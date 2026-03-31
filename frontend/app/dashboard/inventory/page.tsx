import { getAllCategories } from "@/app/actions/category";
import { getAllEquipments } from "@/app/actions/equipment";
import SearchBox from "../_components/SearchBox";
import InventoryAddAction from "./_components/InventoryAddAction";
import EquipmentActions from "./_components/EquipmentActions";
import Pagination from "../../equipment/_components/Pagination";
import Image from "next/image";

export const dynamic = "force-dynamic";

const CONDITION_LABELS: Record<string, string> = {
  NEW: "New",
  LIKE_NEW: "Like New",
  GOOD: "Good",
  FAIR: "Fair",
  POOR: "Poor",
};

export default async function AdminInventoryPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const params = await searchParams;
  const searchQuery = params.q || "";
  const page = Number(params.page) || 1;

  const [categoriesRes, equipmentsRes] = await Promise.all([
    getAllCategories(),
    getAllEquipments({ q: searchQuery, page, limit: 10 })
  ]);

  const categories = categoriesRes.data || [];
  const equipments = equipmentsRes.data || [];
  const paginationMetadata = equipmentsRes.metadata || { totalPages: 1, page: 1 };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#111]" style={{ fontFamily: "var(--font-display)" }}>
            Inventory Management
          </h1>
          <p className="mt-1 text-sm text-[#777]">
            Add, update, or remove equipment from your catalog.
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="rounded-2xl border border-stone-200 bg-white shadow-sm overflow-hidden flex flex-col min-h-[500px]">
        {/* Toolbar */}
        <div className="border-b border-stone-100 p-4 bg-stone-50 flex gap-4 items-center justify-between">
          <SearchBox placeholder="Search equipment..." />
          <InventoryAddAction categories={categories} />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-stone-600 whitespace-nowrap">
            <thead className="border-b border-stone-100 bg-stone-50 text-xs font-bold uppercase tracking-wider text-stone-400">
              <tr>
                <th className="px-6 py-4">Image</th>
                <th className="px-6 py-4">Equipment Name</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Condition</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0ece5]">
              {equipments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-20 text-center text-sm font-semibold text-[#555]">
                    No equipment found matching search query.
                  </td>
                </tr>
              ) : (
                equipments.map((item: any) => (
                  <tr key={item.id} className="hover:bg-[#f9f8f6] transition-colors group">
                    <td className="px-6 py-3">
                      <div className="relative h-10 w-10 overflow-hidden rounded-[6px] border border-[#e0dbd3] bg-stone">
                        {item.imageUrl && (
                          <Image
                            src={item.imageUrl}
                            alt={item.name}
                            fill
                            className="object-cover"
                            unoptimized={item.imageUrl.startsWith('http')}
                          />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-[#111]">{item.name}</td>
                    <td className="px-6 py-4">{item.category?.name || "Uncategorized"}</td>
                    <td className="px-6 py-4 font-medium text-[#111]">
                      {CONDITION_LABELS[item.condition] ?? item.condition}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex w-fit rounded-full px-2.5 py-1 text-[11px] font-bold tracking-wide border ${item.status === "AVAILABLE" ? "bg-green-500/10 text-green-700 border-green-500/20" :
                        item.status === "MAINTENANCE" ? "bg-yellow-500/10 text-yellow-700 border-yellow-500/20" :
                          "bg-slate-500/10 text-slate-700 border-slate-500/20"
                        }`}>
                        {item.status.charAt(0) + item.status.slice(1).toLowerCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <EquipmentActions equipment={item} categories={categories} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {paginationMetadata.totalPages > 1 && (
        <Pagination
          totalPages={paginationMetadata.totalPages}
          currentPage={page}
        />
      )}
    </div>
  );
}
