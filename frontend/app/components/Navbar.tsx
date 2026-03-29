"use client";

import { Calendar, LayoutDashboard, LogOut, Settings } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { authClient } from "../lib/auth-client";
import Logo from "./Logo";

export default function Navbar() {
  const { data, isPending } = authClient.useSession()
  const user = data?.user
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname?.startsWith("/dashboard")) {
    return null;
  }

  const isHome = pathname === "/";
  const isSolid = scrolled || !isHome;

  const initials = user?.name.split(" ").map((n: string) => n[0]).join("").toUpperCase();

  const signOut = async () => {
    await authClient.signOut()
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isSolid
        ? "bg-[#111]/95 backdrop-blur-md border-b border-white/5 shadow-lg shadow-black/20"
        : "bg-transparent"
        }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
        <Logo />

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {[
            { label: "Equipment", href: "/equipment" },
            { label: "How It Works", href: "/#how-it-works" },
            { label: "Why EquipFlow", href: "/#benefits" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3.5 py-2 text-sm font-medium text-white/60 hover:bg-white/5 hover:text-white transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="hidden items-center gap-3 md:flex">
          {!user ? (
            <>
              <Link
                href="/login"
                className="rounded-md px-4 py-2 text-sm font-medium text-white/60 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="rounded-[6px] bg-[#e8612e] px-4 py-2 text-sm font-semibold text-white hover:bg-[#f07248] active:scale-95 transition-all"
              >
                Get Started
              </Link>
            </>
          ) : (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 rounded-full border border-white/10 p-1 pr-3 hover:bg-white/5 transition-colors focus:outline-none"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1e1e1e] text-xs font-bold text-[#e8612e]">
                  {initials}
                </div>
                <span className="text-sm font-medium text-white/80">{user?.name.split(" ")[0]}</span>
              </button>

              {/* User Dropdown */}
              {userMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                  <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl border border-white/10 bg-[#161616] py-1 shadow-xl z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="border-b border-white/5 px-4 py-3">
                      <p className="text-sm font-medium text-white">{user?.name}</p>
                      <p className="mt-0.5 text-xs text-white/50">{user?.email}</p>
                    </div>
                    <div className="py-1">
                      <Link href="/dashboard" className="flex items-center gap-3 px-4 py-2 text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors">
                        <LayoutDashboard size={16} />
                        Dashboard
                      </Link>
                      <Link href="/dashboard/bookings" className="flex items-center gap-3 px-4 py-2 text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors">
                        <Calendar size={16} />
                        My Bookings
                      </Link>
                      <Link href="/dashboard/settings" className="flex items-center gap-3 px-4 py-2 text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors">
                        <Settings size={16} />
                        Settings
                      </Link>
                    </div>
                    <div className="border-t border-white/5 py-1">
                      <button onClick={signOut} className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-[#ff5b5b] hover:bg-white/5 transition-colors">
                        <LogOut size={16} />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Mobile Button */}
        <button
          className="relative flex h-9 w-9 items-center justify-center rounded-md hover:bg-white/5 md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`absolute block h-[1.5px] w-5 bg-white transition-all duration-300 ${menuOpen ? "rotate-45" : "-translate-y-1.5"}`} />
          <span className={`absolute block h-[1.5px] w-5 bg-white transition-all duration-300 ${menuOpen ? "opacity-0 scale-x-0" : ""}`} />
          <span className={`absolute block h-[1.5px] w-5 bg-white transition-all duration-300 ${menuOpen ? "-rotate-45" : "translate-y-1.5"}`} />
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`overflow-hidden transition-all duration-300 md:hidden ${menuOpen ? "max-h-[32rem]" : "max-h-0"}`}>
        <div className="border-t border-white/5 bg-[#111]/98 px-5 py-4">
          <nav className="flex flex-col gap-1">
            {[
              { label: "Equipment", href: "/equipment" },
              { label: "How It Works", href: "/#how-it-works" },
              { label: "Why EquipFlow", href: "/#benefits" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm font-medium text-white/60 hover:bg-white/5 hover:text-white transition-colors"
              >
                {item.label}
              </Link>
            ))}

            <div className="mt-4 flex flex-col gap-2 border-t border-white/5 pt-4">
              {!user ? (
                <>
                  <Link href="/login" className="px-3 py-2 text-sm font-medium text-white/60 hover:text-white">Sign In</Link>
                  <Link href="/register" className="rounded-[6px] bg-[#e8612e] py-2.5 text-center text-sm font-semibold text-white">Get Started</Link>
                </>
              ) : (
                <>
                  <div className="mb-2 flex items-center gap-3 px-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1e1e1e] text-xs font-bold text-[#e8612e]">
                      {initials}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{user.name}</p>
                      <p className="text-xs text-white/50">{user.email}</p>
                    </div>
                  </div>
                  <Link href="/dashboard" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-white/70 hover:bg-white/5 transition-colors"><LayoutDashboard size={16} /> Dashboard</Link>
                  <Link href="/dashboard/bookings" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-white/70 hover:bg-white/5 transition-colors"><Calendar size={16} /> My Bookings</Link>
                  <button onClick={signOut} className="flex items-center gap-3 rounded-md px-3 py-2 text-left text-sm text-[#ff5b5b] hover:bg-white/5 transition-colors"><LogOut size={16} /> Sign Out</button>
                </>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
