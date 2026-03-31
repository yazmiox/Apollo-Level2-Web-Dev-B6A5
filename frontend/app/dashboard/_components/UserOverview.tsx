"use client";

import Link from "next/link";
import { ArrowRight, Package, Clock, CreditCard } from "lucide-react";
import { UserStats } from "@/app/types";

export default function UserOverview({ stats, username }: { stats: UserStats; username: string }) {
  const hasPendingPayments = stats.pendingPayments > 0;

  const statCards = [
    {
      label: "Active Rentals",
      value: stats.activeRentals.toString(),
      icon: Package,
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    },
    {
      label: "Awaiting Payment",
      value: stats.pendingPayments.toString(),
      icon: CreditCard,
      color: "text-orange",
      bg: "bg-orange/10"
    },
    {
      label: "Total Bookings",
      value: stats.totalBookings.toString(),
      icon: Clock,
      color: "text-amber-500",
      bg: "bg-amber-500/10"
    },
    {
      label: "Total Invested",
      value: stats.totalSpent,
      icon: CreditCard,
      color: "text-green-500",
      bg: "bg-green-500/10"
    },
  ];

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-[#111]" style={{ fontFamily: "var(--font-display)" }}>
          Welcome back, {username.split(' ')[0]}!
        </h1>
        <p className="mt-1 text-sm text-[#777]">
          Here is what's happening with your equipment rentals today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rounded-2xl border border-[#e0dbd3] bg-white p-5 shadow-sm">
              <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-full ${stat.bg}`}>
                <Icon size={20} className={stat.color} />
              </div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#888]">{stat.label}</p>
              <p className="mt-1 text-2xl font-extrabold text-[#111]" style={{ fontFamily: "var(--font-display)" }}>{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Urgent Action or Next Step Banner */}
      {hasPendingPayments ? (
        <div className="rounded-2xl border border-orange/30 bg-[#fdfaf2] p-6 shadow-sm ring-1 ring-orange/10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between">
            <div className="flex items-start gap-4">
              <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange/10 text-orange">
                <CreditCard size={20} />
              </div>
              <div>
                <h2 className="text-base font-bold text-[#111]" style={{ fontFamily: "var(--font-display)" }}>
                  Action Needed: Approved Booking
                </h2>
                <p className="mt-1 text-sm text-[#555]">
                  Your booking for{" "}
                  <span className="font-bold text-[#111]">
                    {stats.latestApprovedBookingName || "recently submitted gear"}
                  </span>{" "}
                  has been approved! Complete the payment to secure your reservation.
                </p>
              </div>
            </div>
            <Link
              href="/dashboard/bookings"
              className="group flex shrink-0 items-center gap-2 rounded-[8px] bg-orange px-6 py-3 text-sm font-bold text-white transition-all hover:bg-orange-light active:scale-[0.98] shadow-sm shadow-orange/20"
            >
              Finish & Pay
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-[#e8612e]/30 bg-[#fdf5f2] p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#111]" style={{ fontFamily: "var(--font-display)" }}>
                Ready for your next project?
              </h2>
              <p className="mt-1 text-sm text-[#555]">
                Browse our latest cinema cameras and lighting gear to bring your vision to life.
              </p>
            </div>
            <Link
              href="/equipment"
              className="group flex shrink-0 items-center gap-2 rounded-[8px] bg-orange px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-orange-light active:scale-[0.98]"
            >
              Browse Equipment
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      )}

      {/* Quick Links */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/dashboard/bookings" className="group rounded-2xl border border-[#e0dbd3] bg-white p-6 shadow-sm transition-all hover:border-[#111]">
          <h3 className="text-sm font-bold text-[#111] mb-1">View Bookings</h3>
          <p className="text-xs text-[#777]">Track your active and past rentals.</p>
        </Link>
        <Link href="/dashboard/settings" className="group rounded-2xl border border-[#e0dbd3] bg-white p-6 shadow-sm transition-all hover:border-[#111]">
          <h3 className="text-sm font-bold text-[#111] mb-1">Profile Settings</h3>
          <p className="text-xs text-[#777]">Manage your account and preferences.</p>
        </Link>
      </div>

    </div>
  );
}
