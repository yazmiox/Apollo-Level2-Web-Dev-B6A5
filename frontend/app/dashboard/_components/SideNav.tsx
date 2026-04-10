"use client"

import { authClient } from "@/app/lib/auth-client";
import { CalendarDays, FolderKanban, LayoutDashboard, LogOut, Package, Settings, Shield, Store, Tags, Users } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";

const ROLE_BADGE: Record<string, { label: string; color: string; bg: string }> = {
    admin: { label: "Admin", color: "text-amber-700", bg: "bg-amber-100 border-amber-200" },
    vendor: { label: "Vendor", color: "text-emerald-700", bg: "bg-emerald-100 border-emerald-200" },
};

const USER_NAV = [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "My Bookings", href: "/dashboard/bookings", icon: CalendarDays },
    { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

const VENDOR_NAV = [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "My Listings", href: "/dashboard/inventory", icon: Package },
    { label: "My Bookings", href: "/dashboard/bookings", icon: CalendarDays },
    { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

const ADMIN_NAV = [
    { label: "System Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "Inventory", href: "/dashboard/inventory", icon: FolderKanban },
    { label: "Categories", href: "/dashboard/categories", icon: Tags },
    { label: "Bookings", href: "/dashboard/bookings", icon: CalendarDays },
    { label: "Vendors", href: "/dashboard/vendors", icon: Store },
    { label: "Customers", href: "/dashboard/users", icon: Users },
    { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function SideNav({ role }: { role: string }) {
    const pathname = usePathname();
    const router = useRouter();
    const { data } = authClient.useSession();
    const [isPending, startTransition] = useTransition();
    const user = data?.user;
    const initials = user?.name?.split(" ").map((n) => n[0]).join("").toUpperCase() || "EF";

    const NAV_ITEMS =
        role === "admin" ? ADMIN_NAV :
        role === "vendor" ? VENDOR_NAV :
        USER_NAV;

    const badge = ROLE_BADGE[role];

    const signOut = async () => {
        startTransition(async () => {
            await authClient.signOut({
                fetchOptions: {
                    onSuccess: () => {
                        router.push("/login")
                    }
                }
            })
        })
    }
    return (
        <nav className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all ${isActive
                            ? "bg-[#111] text-white"
                            : "text-[#555] hover:bg-[#f9f8f6] hover:text-[#111]"
                            }`}
                    >
                        <Icon size={18} className={isActive ? "text-orange" : "text-[#aaa]"} />
                        {item.label}
                    </Link>
                );
            })}

            <div className="my-2 h-px bg-[#f0ece5]" />

            {user && (
                <div className="mb-1 mt-1 flex items-center gap-3 rounded-xl bg-[#f9f8f6] border border-[#f0ece5] px-3 py-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-charcoal-card text-xs font-bold text-orange">
                        {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <p className="truncate text-sm font-bold text-[#111]">{user.name}</p>
                            {badge && (
                                <span className={`inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${badge.bg} ${badge.color}`}>
                                    <Shield size={10} />
                                    {badge.label}
                                </span>
                            )}
                        </div>
                        <p className="truncate text-xs text-[#777]">{user.email}</p>
                    </div>
                </div>
            )}

            <button onClick={signOut}
                className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50 transition-all text-left"
            >
                <LogOut size={18} className="text-red-400 group-hover:text-red-500 transition-colors" />
                {isPending ? "Signing out..." : "Sign Out"}
            </button>
        </nav>
    );
}