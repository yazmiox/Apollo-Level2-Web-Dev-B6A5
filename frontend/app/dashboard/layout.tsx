import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "../lib/auth-server";
import SideNav from "./_components/SideNav";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  if (!session) {
    redirect("/login")
  }

  const user = session?.user
  const role = user?.role || "user"

  return (
    <div className="flex min-h-screen flex-col bg-[#f4f1ed]">
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col lg:flex-row px-5 py-8 lg:px-8 gap-8">

        {/* ── Dashboard Sidebar ── */}
        <aside className="w-full lg:w-64 shrink-0">
          <div className="sticky top-8 rounded-2xl border border-[#e0dbd3] bg-white p-4 shadow-sm">
            <div className="mb-6 px-3">
              <Link href="/" className="group flex items-center gap-2.5">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-[6px] bg-[#e8612e] transition-transform group-hover:scale-105">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <rect x="1" y="3.5" width="14" height="2.5" rx="1.25" fill="white" />
                    <rect x="1" y="7" width="9" height="2.5" rx="1.25" fill="white" />
                    <rect x="1" y="10.5" width="11.5" height="2.5" rx="1.25" fill="white" />
                  </svg>
                </span>
                <span
                  className="text-[17px] font-bold tracking-tight text-[#111]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  EquipFlow
                </span>
              </Link>
            </div>

            <div className="mb-4 px-3 pb-4 border-b border-[#f0ece5]">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#aaa]">
                {role === "ADMIN" ? "Admin Workspace" : "Personal Workspace"}
              </p>
              <h2 className="mt-1 text-lg font-bold text-[#111]" style={{ fontFamily: "var(--font-display)" }}>
                Dashboard
              </h2>
            </div>

            <SideNav role={role} />
          </div>
        </aside>

        {/* ── Dashboard Content Area ── */}
        <main className="flex-1 animate-in slide-in-from-bottom-4 fade-in duration-500">
          {children}
        </main>

      </div>
    </div>
  );
}
