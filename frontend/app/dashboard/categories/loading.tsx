import { Search } from "lucide-react";

export default function AdminInventoryLoading() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <div className="h-9 w-64 animate-pulse rounded-lg bg-[#f0ece5]" />
          <div className="h-5 w-96 animate-pulse rounded-lg bg-[#f0ece5]" />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="rounded-2xl border border-[#e0dbd3] bg-white shadow-sm overflow-hidden flex flex-col min-h-[500px]">
        {/* Toolbar */}
        <div className="border-b border-[#f0ece5] p-4 bg-[#f9f8f6] flex gap-4 items-center justify-between">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#aaa]" size={16} />
            <div className="h-10 w-full rounded-[8px] border border-[#e0dbd3] bg-white px-4 py-2 pl-9" />
          </div>

          <div className="h-10 w-44 animate-pulse rounded-[8px] bg-[#f0ece5]" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="border-b border-[#f0ece5] bg-[#f9f8f6]">
              <tr>
                <th className="px-6 py-4"><div className="h-3 w-10 animate-pulse rounded bg-[#f0ece5]" /></th>
                <th className="px-6 py-4"><div className="h-3 w-32 animate-pulse rounded bg-[#f0ece5]" /></th>
                <th className="px-6 py-4"><div className="h-3 w-20 animate-pulse rounded bg-[#f0ece5]" /></th>
                <th className="px-6 py-4"><div className="h-3 w-20 animate-pulse rounded bg-[#f0ece5]" /></th>
                <th className="px-6 py-4"><div className="h-3 w-16 animate-pulse rounded bg-[#f0ece5]" /></th>
                <th className="px-6 py-4 text-right"><div className="ml-auto h-3 w-16 animate-pulse rounded bg-[#f0ece5]" /></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0ece5]">
              {[...Array(6)].map((_, i) => (
                <tr key={i} className="hover:bg-[#f9f8f6] transition-colors">
                  <td className="px-6 py-3">
                    <div className="h-10 w-10 animate-pulse rounded-[6px] border border-[#e0dbd3] bg-[#f4f1ed]" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-5 w-48 animate-pulse rounded bg-[#f0ece5]" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 w-24 animate-pulse rounded bg-[#f0ece5]" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 w-16 animate-pulse rounded bg-[#f0ece5]" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-6 w-20 animate-pulse rounded-full border border-[#f0ece5] bg-[#f9f8f6]" />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="h-8 w-8 animate-pulse rounded-md border border-[#e0dbd3] bg-white" />
                      <div className="h-8 w-8 animate-pulse rounded-md border border-[#e0dbd3] bg-white" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
