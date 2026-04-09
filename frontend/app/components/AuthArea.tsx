import { getSession } from "@/app/lib/auth-server";
import Link from "next/link";
import SignOutButton from "./SignOutButton";
import { CalendarDays, ChevronDown, LayoutDashboard, Package, User } from "lucide-react";

interface AuthAreaProps {
  enableDropdown?: boolean;
}

export default async function AuthArea({ enableDropdown = false }: AuthAreaProps) {
  const session = await getSession();
  const user = session?.user;

  if (!user) {
    return (
      <div className="hidden items-center gap-3 md:flex">
        <Link
          href="/login"
          className="rounded-md px-4 py-2 text-sm font-medium text-white/60 hover:text-white transition-colors"
        >
          Sign In
        </Link>
        <Link
          href="/register"
          className="rounded-[6px] bg-orange px-4 py-2 text-sm font-semibold text-white hover:bg-orange-light active:scale-95 transition-all"
        >
          Get Started
        </Link>
      </div>
    );
  }

  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "";

  return (
    <div className="hidden items-center gap-3 md:flex">
      {enableDropdown ? (
        <details className="group relative">
          <summary className="list-none flex cursor-pointer items-center gap-2 rounded-full border border-white/10 p-1 pr-3 hover:bg-white/5 transition-colors focus:outline-none [&::-webkit-details-marker]:hidden">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-charcoal-card text-xs font-bold text-orange">
              {initials}
            </div>
            <span className="text-sm font-medium text-white/80">{user.name.split(" ")[0]}</span>
            <ChevronDown size={14} className="text-white/50 transition-transform group-open:rotate-180" />
          </summary>

          <div className="absolute right-0 z-50 mt-2 w-64 overflow-hidden rounded-xl border border-white/10 bg-[#111]/95 text-white shadow-2xl shadow-black/35 backdrop-blur-md">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-20"
              style={{ background: "radial-gradient(circle at top right, #e8612e 0%, transparent 55%)" }}
            />

            <div className="relative border-b border-white/10 px-4 py-3">
              <p className="text-sm font-semibold text-white">{user.name}</p>
              <p className="text-xs text-white/50">{user.email}</p>
            </div>

            <div className="relative p-2">
              <Link
                href="/dashboard/settings"
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-white/70 hover:bg-white/5 hover:text-white"
              >
                <User size={15} className="text-white/40" />
                <span>Profile</span>
              </Link>
              <Link
                href="/dashboard"
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-white/70 hover:bg-white/5 hover:text-white"
              >
                <LayoutDashboard size={15} className="text-white/40" />
                <span>Dashboard</span>
              </Link>
              <Link
                href="/dashboard/bookings"
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-white/70 hover:bg-white/5 hover:text-white"
              >
                <CalendarDays size={15} className="text-white/40" />
                <span>My Bookings</span>
              </Link>
              {user.role === "ADMIN" && (
                <Link
                  href="/dashboard/inventory"
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-white/70 hover:bg-white/5 hover:text-white"
                >
                  <Package size={15} className="text-white/40" />
                  <span>Manage Inventory</span>
                </Link>
              )}
              <SignOutButton isDropdown />
            </div>
          </div>
        </details>
      ) : (
        <Link
          href="/dashboard"
          className="flex items-center gap-2 rounded-full border border-white/10 p-1 pr-3 hover:bg-white/5 transition-colors focus:outline-none"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-charcoal-card text-xs font-bold text-orange">
            {initials}
          </div>
          <span className="text-sm font-medium text-white/80">{user.name.split(" ")[0]}</span>
        </Link>
      )}
    </div>
  );
}

export async function MobileAuthArea() {
  const session = await getSession();
  const user = session?.user;

  if (!user) {
    return (
      <div className="mt-4 flex flex-col gap-2 border-t border-white/5 pt-4">
        <Link href="/login" className="px-3 py-2 text-sm font-medium text-white/60 hover:text-white">
          Sign In
        </Link>
        <Link href="/register" className="rounded-[6px] bg-orange py-2.5 text-center text-sm font-semibold text-white">
          Get Started
        </Link>
      </div>
    );
  }

  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "";

  return (
    <div className="mt-4 flex flex-col gap-2 border-t border-white/5 pt-4">
      <Link href="/dashboard" className="px-3 py-2 flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-charcoal-card text-xs font-bold text-orange">
          {initials}
        </div>
        <div>
          <p className="text-sm font-medium text-white">{user.name}</p>
          <p className="text-xs text-white/50">{user.email}</p>
        </div>
      </Link>
      <SignOutButton isMobile />
    </div>
  );
}
