"use client";

import { useEffect, useState, ReactNode } from "react";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import Link from "next/link";

interface NavbarClientProps {
  authArea: ReactNode;
  mobileAuthArea: ReactNode;
}

export default function NavbarClient({ authArea, mobileAuthArea }: NavbarClientProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
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
  
  const navLinks = [
    { label: "Equipment", href: "/equipment" },
    { label: "Vendors", href: "/vendors" },
    { label: "How It Works", href: "/#how-it-works" },
    { label: "Why Apollo", href: "/#benefits" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isSolid
          ? "bg-[#111]/95 backdrop-blur-md border-b border-white/5 shadow-lg shadow-black/20"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
        <Logo color="text-white" />

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3.5 py-2 text-sm font-medium text-white/60 hover:bg-white/5 hover:text-white transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Actions (Desktop Auth) */}
        {authArea}

        {/* Mobile Button */}
        <button
          className="relative flex h-9 w-9 items-center justify-center rounded-md hover:bg-white/5 md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span
            className={`absolute block h-[1.5px] w-5 bg-white transition-all duration-300 ${
              menuOpen ? "rotate-45" : "-translate-y-1.5"
            }`}
          />
          <span
            className={`absolute block h-[1.5px] w-5 bg-white transition-all duration-300 ${
              menuOpen ? "opacity-0 scale-x-0" : ""
            }`}
          />
          <span
            className={`absolute block h-[1.5px] w-5 bg-white transition-all duration-300 ${
              menuOpen ? "-rotate-45" : "translate-y-1.5"
            }`}
          />
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`overflow-hidden transition-all duration-300 md:hidden ${
          menuOpen ? "max-h-128" : "max-h-0"
        }`}
      >
        <div className="border-t border-white/5 bg-[#111]/98 px-5 py-4">
          <nav className="flex flex-col gap-1">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm font-medium text-white/60 hover:bg-white/5 hover:text-white transition-colors"
              >
                {item.label}
              </Link>
            ))}

            {/* Mobile Auth */}
            <div onClick={() => setMenuOpen(false)}>
                {mobileAuthArea}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
