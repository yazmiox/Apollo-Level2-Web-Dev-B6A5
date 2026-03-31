import { getCustomers } from "@/app/actions/customer";
import SearchBox from "../_components/SearchBox";
import UserListClient from "./_components/UserListClient";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const response = await getCustomers();
  const customers = response.data || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-[#111]" style={{ fontFamily: "var(--font-display)" }}>
          Customers
        </h1>
        <p className="mt-1 text-sm text-[#777]">
          Manage user accounts and view customer metrics securely.
        </p>
      </div>

      <div className="rounded-2xl border border-[#e0dbd3] bg-white shadow-sm overflow-hidden flex flex-col min-h-[500px]">

        <div className="border-b border-[#f0ece5] p-4 bg-[#f9f8f6] flex gap-4 items-center justify-between">
          <SearchBox />
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[#555] whitespace-nowrap">
            <thead className="border-b border-[#f0ece5] bg-[#f9f8f6] text-xs font-bold uppercase tracking-wider text-[#888]">
              <tr>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Total Spent</th>
                <th className="px-6 py-4">Total Rentals</th>
                <th className="px-6 py-4">Joined Date</th>
              </tr>
            </thead>
            <UserListClient initialData={customers} />
          </table>
        </div>

        {/* Table Footer */}
        <div className="mt-auto border-t border-[#f0ece5] bg-[#f9f8f6] px-6 py-3">
          <p className="text-[11px] font-bold text-[#888] uppercase tracking-widest">
            Database Sync Active • Total Records: {customers.length}
          </p>
        </div>
      </div>
    </div>
  );
}
