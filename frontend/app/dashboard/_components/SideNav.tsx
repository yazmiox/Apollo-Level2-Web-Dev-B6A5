"use client"

import { authClient } from "@/app/lib/auth-client";
import { CalendarDays, FolderKanban, LayoutDashboard, LogOut, Settings, Users } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";

export default function SideNav({ role }: { role: string }) {
    const pathname = usePathname();
    const router = useRouter();
    const { data } = authClient.useSession();
    const [isPending, startTransition] = useTransition();
    const user = data?.user;
    const initials = user?.name?.split(" ").map((n) => n[0]).join("").toUpperCase() || "EF";

    const NAV_ITEMS = role === "user" ? [
        { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
        { label: "My Bookings", href: "/dashboard/bookings", icon: CalendarDays },
        { label: "Settings", href: "/dashboard/settings", icon: Settings },
    ] : [
        { label: "System Overview", href: "/dashboard", icon: LayoutDashboard },
        { label: "Manage Inventory", href: "/dashboard/inventory", icon: FolderKanban },
        { label: "Booking Approvals", href: "/dashboard/bookings", icon: CalendarDays },
        { label: "Customers", href: "/dashboard/users", icon: Users },
        { label: "Settings", href: "/dashboard/settings", icon: Settings },
    ];

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
                        <Icon size={18} className={isActive ? "text-[#e8612e]" : "text-[#aaa]"} />
                        {item.label}
                    </Link>
                );
            })}

            <div className="my-2 h-px bg-[#f0ece5]" />

            {user && (
                <div className="mb-1 mt-1 flex items-center gap-3 rounded-xl bg-[#f9f8f6] border border-[#f0ece5] px-3 py-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1e1e1e] text-xs font-bold text-[#e8612e]">
                        {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="truncate text-sm font-bold text-[#111]">{user.name}</p>
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