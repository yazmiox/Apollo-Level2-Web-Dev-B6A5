"use client";

import { formatDateShort } from "@/app/utils";
import { Calendar, ChevronRight, Search } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import BookingActions from "./BookingActions";

export default function AdminBookings({ initialBookings }: { initialBookings: any[] }) {
  const [bookings, setBookings] = useState(initialBookings)
  const [filter, setFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBookings = bookings?.filter(b => {
    const matchesFilter = filter === "ALL" ? true : b.status === filter;
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = b.user.name.toLowerCase().includes(searchLower) ||
      b.user.email.toLowerCase().includes(searchLower) ||
      b.equipment.name.toLowerCase().includes(searchLower);
    return matchesFilter && matchesSearch;
  });

  const handleStatusUpdate = (bookingId: string, newStatus: string) => {
    setBookings(prev => prev.map(booking =>
      booking.id === bookingId ? { ...booking, status: newStatus } : booking
    ));
  };

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
            Booking Approvals
          </h1>
          <p className="mt-1 text-sm text-[#777]">
            Review, approve, or reject incoming rental requests.
          </p>
        </div>

        <div className="flex items-center gap-1 rounded-[8px] bg-[#f9f8f6] p-1 border border-[#e0dbd3]">
          {["ALL", "PENDING_APPROVAL", "AWAITING_PAYMENT", "ACTIVE"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`whitespace-nowrap rounded-[6px] px-4 py-2 text-[13px] font-semibold transition-all ${filter === f ? "bg-white text-[#111] shadow-sm border border-[#e0dbd3]" : "text-[#777] hover:text-[#111]"
                }`}
            >
              {f === "ALL" ? "All Bookings"
                : f === "PENDING_APPROVAL" ? "Needs Review"
                  : f === "AWAITING_PAYMENT" ? "Awaiting Deposit"
                    : "Active"}
            </button>
          ))}
        </div>
      </div>

      {/* Main Table Container */}
      <div className="rounded-2xl border border-[#e0dbd3] bg-white shadow-sm overflow-hidden flex flex-col items-stretch">

        {/* Toolbar row */}
        <div className="border-b border-[#f0ece5] p-4 bg-[#f9f8f6] flex items-center justify-between">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#aaa]" size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by customer name, email, or item..."
              className="w-full rounded-[8px] border border-[#e0dbd3] bg-white px-4 py-2 pl-9 text-[13px] text-[#111] placeholder:text-[#aaa] outline-none transition-all focus:border-[#e8612e] focus:ring-1 focus:ring-[#e8612e]/30"
            />
          </div>
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
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0ece5] text-[13px] text-[#444]">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-24 text-center">
                    <div className="flex flex-col items-center justify-center opacity-60">
                      <Search size={32} className="mb-3 text-[#aaa]" />
                      <p className="text-sm font-semibold text-[#555]">No bookings found.</p>
                      <p className="text-xs text-[#888] mt-1">Try adjusting your filters or search query.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredBookings.map((req) => (
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
                          <Image src={req.equipment.imageUrl} alt={req.equipment.name} fill className="object-cover" />
                        </div>
                        <span className="font-semibold text-[#111]">{req.equipment.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-[#555] font-medium">
                        <Calendar size={13} className="text-[#aaa]" />
                        {formatDateShort(req.startDate)} <ChevronRight size={12} className="text-[#ccc] mx-0.5" /> {formatDateShort(req.endDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-[#111]">
                      ${req.amount}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(req.status)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <BookingActions role={req.user.role} bookingId={req.id} currentStatus={req.status} onStatusUpdate={handleStatusUpdate} />
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
