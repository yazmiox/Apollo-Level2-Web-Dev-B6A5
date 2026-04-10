import { formatDateShort } from "@/app/utils";
import { Calendar, ChevronRight } from "lucide-react";
import { Booking } from "@/app/types";
import Image from "next/image";
import BookingActions from "./BookingActions";
import SearchBox from "./SearchBox";

export default function AdminBookings({ 
  initialBookings, 
  role = "admin" 
}: { 
  initialBookings: Booking[], 
  role?: "admin" | "vendor" 
}) {
  const isAdmin = role === "admin";
  const isVendor = role === "vendor";

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING_APPROVAL":
        return <span className="inline-flex w-fit rounded-full bg-amber-500/10 px-2.5 py-1 text-[11px] font-bold tracking-wide text-amber-700 border border-amber-500/20">Needs Review</span>;
      case "AWAITING_PAYMENT":
        return <span className="inline-flex w-fit rounded-full bg-orange-500/10 px-2.5 py-1 text-[11px] font-bold tracking-wide text-orange-700 border border-orange-500/20">Awaiting Deposit</span>;
      case "CONFIRMED":
        return <span className="inline-flex w-fit rounded-full bg-blue-500/10 px-2.5 py-1 text-[11px] font-bold tracking-wide text-blue-700 border border-blue-500/20">Confirmed</span>;
      case "ACTIVE":
        return <span className="inline-flex w-fit rounded-full bg-blue-500/10 px-2.5 py-1 text-[11px] font-bold tracking-wide text-blue-700 border border-blue-500/20">Active Rental</span>;
      case "RETURNED":
        return <span className="inline-flex w-fit rounded-full bg-green-500/10 px-2.5 py-1 text-[11px] font-bold tracking-wide text-green-700 border border-green-500/20">Completed</span>;
      case "CANCELLED":
        return <span className="inline-flex w-fit rounded-full bg-red-500/10 px-2.5 py-1 text-[11px] font-bold tracking-wide text-red-700 border border-red-500/20">Cancelled</span>;
      case "REJECTED":
        return <span className="inline-flex w-fit rounded-full bg-red-500/10 px-2.5 py-1 text-[11px] font-bold tracking-wide text-red-700 border border-red-500/20">Rejected</span>;
      default:
        return null;
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Area */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#111]" style={{ fontFamily: "var(--font-display)" }}>
            {isAdmin ? "Booking Approvals" : "My Received Bookings"}
          </h1>
          <p className="mt-1 text-sm text-[#777]">
            {isAdmin 
              ? "Review, approve, or reject incoming rental requests across the platform."
              : "Manage rental requests for your equipment listings."
            }
          </p>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="rounded-2xl border border-[#e0dbd3] bg-white shadow-sm overflow-hidden flex flex-col items-stretch">

        {/* Toolbar row */}
        <div className="border-b border-[#f0ece5] p-4 bg-[#f9f8f6] flex items-center justify-between">
          <SearchBox placeholder="Search by customer, email, or item..." />
        </div>

        {/* Table itself */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="border-b border-[#f0ece5] bg-white text-[11px] font-bold uppercase tracking-wider text-[#888]">
              <tr>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Equipment</th>
                <th className="px-6 py-4">Rental Period</th>
                <th className="px-6 py-4 text-right">Amount</th>
                <th className="px-6 py-4">Status</th>
                {(isAdmin || isVendor) && <th className="px-6 py-4 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0ece5] text-[13px] text-[#444]">
              {initialBookings.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 6 : 5} className="py-24 text-center">
                    <p className="text-sm font-semibold text-[#555]">No bookings found.</p>
                  </td>
                </tr>
              ) : (
                initialBookings.map((req) => (
                  <tr key={req.id} className="hover:bg-[#f9f8f6] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-[#111]">{req.user.name}</span>
                        <span className="text-xs text-[#777]">{req.user.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-[6px] border border-[#e0dbd3] bg-[#f4f1ed]">
                          {req.equipment.imageUrl && (
                            <Image src={req.equipment.imageUrl} alt={req.equipment.name} fill className="object-cover" />
                          )}
                        </div>
                        <span className="font-semibold text-[#111]">{req.equipment.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-[#555] font-medium">
                        <Calendar className="text-[#aaa]" size={13} />
                        {formatDateShort(req.startDate)} <ChevronRight size={12} className="text-[#ccc] mx-0.5" /> {formatDateShort(req.endDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-[#111]">
                      ${req.amount}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(req.status)}
                    </td>
                    {(isAdmin || isVendor) && (
                      <td className="px-6 py-4 text-right">
                        <BookingActions bookingId={req.id} currentStatus={req.status} />
                      </td>
                    )}
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
