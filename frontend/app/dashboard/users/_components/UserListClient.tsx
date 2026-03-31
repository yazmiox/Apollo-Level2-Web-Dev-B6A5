"use client";

import { CustomerStats } from "@/app/types";
import { useSearchParams } from "next/navigation";

export default function UserListClient({ initialData }: { initialData: CustomerStats[] }) {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  // Perform filtering locally for better performance with small-medium datasets
  const filteredCustomers = initialData.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.email.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <tbody className="divide-y divide-[#f0ece5]">
      {filteredCustomers.length === 0 ? (
        <tr>
          <td colSpan={4} className="py-20 text-center text-sm font-semibold text-[#555]">
            No customers match your search criteria.
          </td>
        </tr>
      ) : (
        filteredCustomers.map((user) => (
          <tr key={user.id} className="hover:bg-[#f9f8f6] transition-colors group">
            <td className="px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#111] text-[10px] font-bold text-white uppercase tracking-wider">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-[#111] leading-none mb-1">{user.name}</p>
                  <p className="text-xs text-[#777] font-medium leading-none">{user.email}</p>
                </div>
              </div>
            </td>
            <td className="px-6 py-4 font-bold text-[#111]">
              ${user.totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </td>
            <td className="px-6 py-4">
              <span className="inline-flex items-center justify-center rounded-md bg-[#f4f1ed] px-2.5 py-1 text-[11px] font-bold text-[#555] border border-[#e0dbd3]">
                {user.totalRentals} Rentals
              </span>
            </td>
            <td className="px-6 py-4 text-[#777] font-medium">
              {new Date(user.joined).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </td>
          </tr>
        ))
      )}
    </tbody>
  );
}
