"use client";

import { formatDateShort } from "@/app/utils";
import { ArrowRight, Banknote, Box, Calendar, Check, ChevronRight, Clock, Loader2, Package, UserCheck, Wrench, X, Store } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { toast } from "sonner";
import { updateBookingStatus } from "../../actions/booking";

type PendingRequest = {
  id: string;
  user: { name: string };
  equipment: { name: string };
  startDate: string;
  endDate: string;
  amount: string;
  status: string;
};

type AdminStats = {
  pendingApprovals: number;
  activeRentals: number;
  totalEquipment?: number;
  totalListings?: number;
  activeListings?: number;
  totalEarnings?: string;
  maintenanceCount?: number;
  customers?: number;
  vendors?: number;
  monthlyRevenue?: string;
  pendingRequests: PendingRequest[];
};

const PIE_COLORS = ["#f59e0b", "#22c55e", "#ef4444"];

const parseCurrencyToNumber = (value: string) => {
  const normalized = Number(value.replace(/[^0-9.-]+/g, ""));
  return Number.isFinite(normalized) ? normalized : 0;
};

export default function AdminOverview({ stats, role = "admin" }: { stats: any; role?: string }) {
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>(stats?.pendingRequests ?? []);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  if (!stats) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#e0dbd3] bg-white text-center p-8">
        <div className="mb-4 rounded-full bg-red-50 p-4">
          <Loader2 className="h-8 w-8 text-red-400 animate-spin" />
        </div>
        <h3 className="text-lg font-bold text-[#111]">Loading Dashboard Data...</h3>
        <p className="mt-1 text-sm text-[#777]">If this persists, please try refreshing the page or check your connection.</p>
      </div>
    );
  }

  const isAdmin = role === "admin";
  const isVendor = role === "vendor";

  const handleStatusChange = async (id: string, status: string) => {
    setLoadingId(id + "_" + status);

    const response = await updateBookingStatus(id, status);

    setLoadingId(null);
    if (!response.success) {
      toast.error(response.message);
      return;
    }

    setPendingRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status } : req))
    );

    toast.success(`Booking ${status.toLowerCase().replace("_", " ")} successfully`);
  };

  // Admin stats vs Vendor stats
  const statsArr = isAdmin
    ? [
        { label: "Pending Approvals", value: stats.pendingApprovals, icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
        { label: "Active Rentals", value: stats.activeRentals, icon: Box, color: "text-blue-500", bg: "bg-blue-500/10" },
        { label: "Vendors", value: stats.vendors ?? 0, icon: Store, color: "text-emerald-500", bg: "bg-emerald-500/10" },
        { label: "Monthly Revenue", value: stats.monthlyRevenue ?? "$0", icon: Banknote, color: "text-green-500", bg: "bg-green-500/10" },
      ]
    : [
        { label: "My Pending Gear", value: stats.pendingApprovals ?? 0, icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
        { label: "Active Rentals", value: stats.activeRentals ?? 0, icon: Box, color: "text-blue-500", bg: "bg-blue-500/10" },
        { label: "Total Listings", value: stats.totalListings ?? 0, icon: Package, color: "text-indigo-500", bg: "bg-indigo-500/10" },
        { label: "Total Earnings", value: stats.totalEarnings ?? "$0", icon: Banknote, color: "text-emerald-500", bg: "bg-emerald-500/10" },
      ];

  const operationalBarData = useMemo(() => ([
    { name: "Pending", value: stats.pendingApprovals || 0 },
    { name: "Active", value: stats.activeRentals || 0 },
    ...(isAdmin
      ? [{ name: "Revenue", value: parseCurrencyToNumber(stats.monthlyRevenue || "0") }]
      : [{ name: "Earnings", value: parseCurrencyToNumber(stats.totalEarnings || "0") }]
    ),
  ]), [stats.pendingApprovals, stats.activeRentals, stats.monthlyRevenue, stats.totalEarnings, isAdmin]);

  const requestAmountLineData = useMemo(() => {
    const points = (pendingRequests || [])
      .slice(0, 6)
      .map((req) => ({
        label: formatDateShort(req.startDate),
        amount: parseCurrencyToNumber(req.amount),
      }))
      .reverse();

    return points.length > 0 ? points : [{ label: "No Data", amount: 0 }];
  }, [pendingRequests]);

  const requestStatusPieData = useMemo(() => {
    const summary = (pendingRequests || []).reduce(
      (acc, req) => {
        if (req.status === "PENDING_APPROVAL") acc.pending += 1;
        else if (req.status === "REJECTED") acc.rejected += 1;
        else acc.approved += 1;
        return acc;
      },
      { pending: 0, approved: 0, rejected: 0 }
    );

    const values = [
      { name: "Pending", value: summary.pending },
      { name: "Approved", value: summary.approved },
      { name: "Rejected", value: summary.rejected },
    ].filter((item) => item.value > 0);

    return values.length > 0 ? values : [{ name: "No Requests", value: 1 }];
  }, [pendingRequests]);

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-extrabold tracking-tight text-[#111]" style={{ fontFamily: "var(--font-display)" }}>
            {isAdmin ? "System Overview" : "Vendor Dashboard"}
          </h1>
          <span className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest ${
            isAdmin
              ? "border-amber-200 bg-amber-100 text-amber-700"
              : "border-emerald-200 bg-emerald-100 text-emerald-700"
          }`}>
            {isAdmin ? "Admin" : "Vendor"}
          </span>
        </div>
        <p className="mt-1 text-sm text-[#777]">
          {isAdmin
            ? "Monitor platform performance, vendors, and revenue."
            : "Manage your equipment listings and track your earnings."
          }
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

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-[#e0dbd3] bg-white p-5 shadow-sm">
          <h2 className="text-sm font-bold text-[#111]" style={{ fontFamily: "var(--font-display)" }}>
            {isAdmin ? "Platform Snapshot" : "My Performance"}
          </h2>
          <p className="mt-1 text-xs text-[#888]">Live counts from the system.</p>

          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={operationalBarData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee8df" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#777" }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#777" }} axisLine={false} tickLine={false} />
                <Tooltip
                  cursor={{ fill: "#f8f5ef" }}
                  contentStyle={{ borderRadius: 10, border: "1px solid #e0dbd3", fontSize: 12 }}
                />
                <Bar dataKey="value" fill={isAdmin ? "#e8612e" : "#10b981"} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-[#e0dbd3] bg-white p-5 shadow-sm">
          <h2 className="text-sm font-bold text-[#111]" style={{ fontFamily: "var(--font-display)" }}>
            Booking Value Trend
          </h2>
          <p className="mt-1 text-xs text-[#888]">Latest request amounts.</p>

          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={requestAmountLineData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee8df" />
                <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#777" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#777" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: 10, border: "1px solid #e0dbd3", fontSize: 12 }}
                />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#111111"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: isAdmin ? "#e8612e" : "#10b981" }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-[#e0dbd3] bg-white p-5 shadow-sm">
          <h2 className="text-sm font-bold text-[#111]" style={{ fontFamily: "var(--font-display)" }}>
            Request Distribution
          </h2>
          <p className="mt-1 text-xs text-[#888]">Current status of incoming requests.</p>

          <div className="mt-4 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip
                  contentStyle={{ borderRadius: 10, border: "1px solid #e0dbd3", fontSize: 12 }}
                />
                <Pie
                  data={requestStatusPieData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={42}
                  outerRadius={70}
                  paddingAngle={3}
                >
                  {requestStatusPieData.map((entry, index) => (
                    <Cell key={`${entry.name}-${index}`} fill={PIE_COLORS[index] ?? "#d6d3ce"} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-2 flex flex-wrap gap-3">
            {requestStatusPieData.map((entry, index) => (
              <div key={entry.name} className="inline-flex items-center gap-1.5 text-xs text-[#666]">
                <span
                  className="inline-block h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: PIE_COLORS[index] ?? "#d6d3ce" }}
                />
                <span>{entry.name}</span>
                <span className="font-bold text-[#111]">({entry.value})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">

        {/* Pending Requests Block */}
        <div className="rounded-2xl border border-[#e0dbd3] bg-white shadow-sm overflow-hidden flex flex-col">
          <div className="border-b border-[#f0ece5] flex items-center justify-between px-6 py-5">
            <div>
              <h2 className="text-base font-bold text-[#111]" style={{ fontFamily: "var(--font-display)" }}>
                {isAdmin ? "Action Required" : "My Pending Requests"}
              </h2>
              <p className="text-xs text-[#888] mt-0.5">Bookings awaiting action.</p>
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
              pendingRequests.map((req) => (
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
                      (isAdmin || isVendor) ? (
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
                      ) : (
                        <div className="flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-[11px] font-bold text-amber-600 border border-amber-100">
                          <Clock size={14} /> Awaiting Approval
                        </div>
                      )
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
                <p className="text-sm font-bold text-[#111]">{isAdmin ? "Inventory" : "My Listings"}</p>
                <p className="text-xs text-[#777]">Manage equipment</p>
              </div>
              <ArrowRight size={16} className="text-[#aaa] group-hover:text-[#e8612e] group-hover:translate-x-1 transition-all" />
            </Link>
            
            <Link href="/dashboard/bookings" className="group flex items-center justify-between rounded-xl border border-[#e0dbd3] bg-[#f9f8f6] p-4 hover:border-[#e8612e]/30 hover:bg-[#fdf5f2] transition-colors">
              <div>
                <p className="text-sm font-bold text-[#111]">Bookings</p>
                <p className="text-xs text-[#777]">{isAdmin ? "Review all platform bookings" : "Track rentals on my gear"}</p>
              </div>
              <ArrowRight size={16} className="text-[#aaa] group-hover:text-[#e8612e] group-hover:translate-x-1 transition-all" />
            </Link>

            {isAdmin && (
              <Link href="/dashboard/vendors" className="group flex items-center justify-between rounded-xl border border-[#e0dbd3] bg-[#f9f8f6] p-4 hover:border-[#e8612e]/30 hover:bg-[#fdf5f2] transition-colors">
                <div>
                  <p className="text-sm font-bold text-[#111]">Vendors</p>
                  <p className="text-xs text-[#777]">Manage partner accounts</p>
                </div>
                <ArrowRight size={16} className="text-[#aaa] group-hover:text-[#e8612e] group-hover:translate-x-1 transition-all" />
              </Link>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
