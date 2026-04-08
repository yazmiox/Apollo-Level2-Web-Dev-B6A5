import Link from "next/link";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#111]">
      <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="sm:col-span-2">
            <Logo color="text-white" />

            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/40">
              Shared equipment management for media labs, production studios, workshops, makerspaces, and beyond.
            </p>

            <p className="mt-8 text-xs text-white/20">
              © {new Date().getFullYear()} EquipFlow. All rights reserved.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h4 className="mb-5 text-[10px] font-bold uppercase tracking-[0.15em] text-white/30">
              Platform
            </h4>
            <ul className="flex flex-col gap-3">
              {[
                { label: "Browse Equipment", href: "/equipment" },
                { label: "Book Equipment", href: "/equipment" },
                { label: "My Bookings", href: "/dashboard/bookings" }
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/40 transition-colors hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="mb-5 text-[10px] font-bold uppercase tracking-[0.15em] text-white/30">
              Company
            </h4>
            <ul className="flex flex-col gap-3">
              {[
                { label: "About", href: "/about" },
                { label: "Contact", href: "/contact" },
                { label: "Privacy", href: "/privacy" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/40 transition-colors hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="mb-5 text-[10px] font-bold uppercase tracking-[0.15em] text-white/30">
              Account
            </h4>
            <ul className="flex flex-col gap-3">
              {[
                { label: "Sign In", href: "/login" },
                { label: "Register", href: "/register" },
                { label: "Admin Dashboard", href: "/admin" },
                { label: "Manage Equipment", href: "/admin/equipment" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/40 transition-colors hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
