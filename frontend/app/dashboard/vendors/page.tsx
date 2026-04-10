import { getAllVendors } from "@/app/actions/vendor";
import SearchBox from "../_components/SearchBox";
import Image from "next/image";
import { Star, Package, Banknote, ShieldCheck } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminVendorsPage() {
  const response = await getAllVendors();
  const vendors = response.data || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-[#111]" style={{ fontFamily: "var(--font-display)" }}>
          Vendor Management
        </h1>
        <p className="mt-1 text-sm text-[#777]">
          Monitor partner performance and marketplace health.
        </p>
      </div>

      <div className="rounded-2xl border border-[#e0dbd3] bg-white shadow-sm overflow-hidden flex flex-col min-h-[500px]">
        <div className="border-b border-[#f0ece5] p-4 bg-[#f9f8f6] flex gap-4 items-center justify-between">
          <SearchBox placeholder="Search vendors..." />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[#555] whitespace-nowrap">
            <thead className="border-b border-[#f0ece5] bg-[#f9f8f6] text-xs font-bold uppercase tracking-wider text-[#888]">
              <tr>
                <th className="px-6 py-4">Vendor</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Listings</th>
                <th className="px-6 py-4">Avg Rating</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0ece5]">
              {vendors.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center text-sm font-semibold text-[#555]">
                    No vendors found.
                  </td>
                </tr>
              ) : (
                vendors.map((vendor) => (
                  <tr key={vendor.id} className="hover:bg-[#f9f8f6] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-9 w-9 overflow-hidden rounded-full border border-[#e0dbd3] bg-stone">
                          {vendor.image ? (
                            <Image src={vendor.image} alt={vendor.name} fill className="object-cover" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-[#f4f1ed] text-xs font-bold text-[#e8612e]">
                              {vendor.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-[#111]">{vendor.name}</span>
                          <span className="text-xs text-[#888]">{vendor.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-100 uppercase tracking-wider">
                        <ShieldCheck size={10} /> Verified
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 font-semibold text-[#111]">
                        <Package size={14} className="text-[#aaa]" />
                        {vendor.listingsCount}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 font-bold text-amber-500">
                        <Star size={14} className="fill-current" />
                        {vendor.avgRating.toFixed(1)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <button className="text-xs font-bold text-[#e8612e] hover:underline">
                         View Details
                       </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-auto border-t border-[#f0ece5] bg-[#f9f8f6] px-6 py-3">
          <p className="text-[11px] font-bold text-[#888] uppercase tracking-widest">
            {vendors.length} Active Marketplace Partners
          </p>
        </div>
      </div>
    </div>
  );
}
