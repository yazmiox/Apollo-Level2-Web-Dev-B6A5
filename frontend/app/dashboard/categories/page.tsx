import { getAllCategories } from "@/app/actions/category";
import SearchBox from "../_components/SearchBox";
import CategoryAddAction from "./_components/CategoryAddAction";
import CategoryActions from "./_components/CategoryActions";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const searchQuery = params.q || "";

  const categoriesRes = await getAllCategories(searchQuery);
  const categories = categoriesRes.data || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#111]" style={{ fontFamily: "var(--font-display)" }}>
            Category Management
          </h1>
          <p className="mt-1 text-sm text-[#777]">
            Create and organize categories for your equipment inventory.
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="rounded-2xl border border-stone-200 bg-white shadow-sm overflow-hidden flex flex-col min-h-[500px]">
        {/* Toolbar */}
        <div className="border-b border-stone-100 p-4 bg-stone-50 flex gap-4 items-center justify-between">
          <SearchBox placeholder="Search categories..." />
          <CategoryAddAction />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-stone-600 whitespace-nowrap">
            <thead className="border-b border-stone-100 bg-stone-50 text-xs font-bold uppercase tracking-wider text-stone-400">
              <tr>
                <th className="px-6 py-4">Category Name</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0ece5]">
              {categories.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-20 text-center text-sm font-semibold text-[#555]">
                    No categories found.
                  </td>
                </tr>
              ) : (
                categories.map((cat: any) => (
                  <tr key={cat.id} className="hover:bg-[#f9f8f6] transition-colors group">
                    <td className="px-6 py-4 font-bold text-[#111]">{cat.name}</td>
                    <td className="px-6 py-4">{cat.description}</td>
                    <td className="px-6 py-4 text-right">
                      <CategoryActions category={cat} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
