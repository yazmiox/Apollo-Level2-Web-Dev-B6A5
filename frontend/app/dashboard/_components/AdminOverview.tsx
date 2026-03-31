"use client";

import { formatDateShort } from "@/app/utils";
import { ArrowRight, Banknote, Box, Calendar, Check, ChevronRight, Clock, Loader2, UserCheck, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { updateBookingStatus } from "../../actions/booking";

export default function AdminOverview({ stats }: { stats: any }) {
  const [pendingRequests, setPendingRequests] = useState(stats.pendingRequests);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleStatusChange = async (id: string, status: string) => {
    setLoadingId(id + "_" + status);

    const response = await updateBookingStatus(id, status);

    setLoadingId(null);
    if (!response.success) {
      toast.error(response.message);
      return;
    }

    setPendingRequests((prev: any[]) =>
      prev.map((req) => (req.id === id ? { ...req, status } : req))
    );

    toast.success(`Booking ${status.toLowerCase().replace("_", " ")} successfully`);
  };

  const statsArr = [
    { label: "Pending Approvals", value: stats.pendingApprovals, icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Active Rentals", value: stats.activeRentals, icon: Box, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Customers", value: stats.customers, icon: UserCheck, color: "text-purple-500", bg: "bg-purple-500/10" },
    { label: "Monthly Revenue", value: stats.monthlyRevenue, icon: Banknote, color: "text-green-500", bg: "bg-green-500/10" },
  ];

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-[#111]" style={{ fontFamily: "var(--font-display)" }}>
          System Overview
        </h1>
        <p className="mt-1 text-sm text-[#777]">
          Monitor your inventory, bookings, and revenue at a glance.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statsArr.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rounded-2xl border border-[#e0dbd3] bg-white p-5 shadow-sm">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#f9f8f6]">
                <Icon size={20} className={stat.color} />
              </div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#888]">{stat.label}</p>
              <p className="mt-1 text-2xl font-extrabold text-[#111]" style={{ fontFamily: "var(--font-display)" }}>{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">

        {/* Pending Requests Block */}
        <div className="rounded-2xl border border-[#e0dbd3] bg-white shadow-sm overflow-hidden flex flex-col">
          <div className="border-b border-[#f0ece5] flex items-center justify-between px-6 py-5">
            <div>
              <h2 className="text-base font-bold text-[#111]" style={{ fontFamily: "var(--font-display)" }}>
                Action Required
              </h2>
              <p className="text-xs text-[#888] mt-0.5">Booking requests awaiting your approval.</p>
            </div>
            <Link href="/dashboard/bookings" className="text-xs font-bold text-[#e8612e] hover:underline">
              View All
            </Link>
          </div>
          <div className="divide-y divide-[#f0ece5] flex-1">
            {pendingRequests.length === 0 ? (
              <div className="flex items-center justify-center h-24">
                <p className="text-sm text-[#888]">No pending requests</p>
              </div>
            ) :
              pendingRequests.map((req: any) => (
                <div key={req.id} className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 gap-4">
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-bold text-[#111]">{req.equipment.name}</p>
                    <div className="flex items-center gap-2 text-xs font-medium text-[#777]">
                      <span className="text-[#111]">{req.user.name}</span>
                      <span>•</span>
                      <div className="flex items-center gap-1.5 text-[#555] font-medium">
                        <Calendar size={13} className="text-[#aaa]" />
                        {formatDateShort(req.startDate)} <ChevronRight size={12} className="text-[#ccc] mx-0.5" /> {formatDateShort(req.endDate)}
                      </div>
                      <span>•</span>
                      <span className="font-bold text-[#e8612e]">{req.amount}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {req.status === "PENDING_APPROVAL" ? (
                      <>
                        <button
                          disabled={loadingId !== null}
                          onClick={() => handleStatusChange(req.id, "REJECTED")}
                          className="flex items-center gap-1.5 rounded-[6px] border border-[#e0dbd3] bg-white px-3 py-1.5 text-xs font-bold text-red-600 transition-all hover:bg-red-50 hover:border-red-200 active:scale-95 disabled:pointer-events-none disabled:opacity-75"
                        >
                          {loadingId === req.id + "_REJECTED" ? <Loader2 size={14} className="animate-spin" /> : <X size={14} />}
                          Reject
                        </button>
                        <button
                          disabled={loadingId !== null}
                          onClick={() => handleStatusChange(req.id, "AWAITING_PAYMENT")}
                          className="flex items-center gap-1.5 rounded-[6px] bg-[#111] px-3 py-1.5 text-xs font-bold text-white transition-all hover:bg-[#333] active:scale-95 shadow-sm disabled:pointer-events-none disabled:opacity-75"
                        >
                          {loadingId === req.id + "_AWAITING_PAYMENT" ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                          Approve
                        </button>
                      </>
                    ) : req.status === "REJECTED" ? (
                      <div className="flex items-center gap-1.5 rounded-full bg-red-50/50 px-3 py-1 text-[11px] font-bold text-red-600 border border-red-100/50">
                        <X size={14} className="bg-red-600 text-white rounded-full p-0.5" /> Rejected
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 rounded-full bg-green-50/50 px-3 py-1 text-[11px] font-bold text-green-600 border border-green-100/50">
                        <Check size={14} className="bg-green-600 text-white rounded-full p-0.5" /> Approved
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-2xl border border-[#e0dbd3] bg-white p-6 shadow-sm h-fit">
          <h2 className="mb-4 text-base font-bold text-[#111]" style={{ fontFamily: "var(--font-display)" }}>
            Quick Actions
          </h2>
          <div className="flex flex-col gap-3">
            <Link href="/dashboard/inventory" className="group flex items-center justify-between rounded-xl border border-[#e0dbd3] bg-[#f9f8f6] p-4 hover:border-[#e8612e]/30 hover:bg-[#fdf5f2] transition-colors">
              <div>
                <p className="text-sm font-bold text-[#111]">Inventory</p>
                <p className="text-xs text-[#777]">Manage your inventory</p>
              </div>
              <ArrowRight size={16} className="text-[#aaa] group-hover:text-[#e8612e] group-hover:translate-x-1 transition-all" />
            </Link>
            <Link href="/dashboard/users" className="group flex items-center justify-between rounded-xl border border-[#e0dbd3] bg-[#f9f8f6] p-4 hover:border-[#e8612e]/30 hover:bg-[#fdf5f2] transition-colors">
              <div>
                <p className="text-sm font-bold text-[#111]">Customers</p>
                <p className="text-xs text-[#777]">Manage your customers</p>
              </div>
              <ArrowRight size={16} className="text-[#aaa] group-hover:text-[#e8612e] group-hover:translate-x-1 transition-all" />
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
