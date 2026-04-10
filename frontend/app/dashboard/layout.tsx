import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "../lib/auth-server";
import SideNav from "./_components/SideNav";
import { authClient } from "../lib/auth-client";
import Logo from "../components/Logo";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  if (!session) {
    redirect("/login")
  }

  const user = session?.user

  if (user?.emailVerified === false) {
    await authClient.sendVerificationEmail({ email: user?.email! })
    redirect("/verify-email")
  }

  const role = user?.role || "user"

  const workspaceLabel =
    role === "admin" ? "Admin Workspace" :
    role === "manager" ? "Manager Workspace" :
    "Personal Workspace";

  return (
    <div className="flex min-h-screen flex-col bg-[#f4f1ed]">
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col lg:flex-row px-5 py-8 lg:px-8 gap-8">

        {/* ── Dashboard Sidebar ── */}
        <aside className="w-full lg:w-64 shrink-0">
          <div className="sticky top-8 rounded-2xl border border-[#e0dbd3] bg-white p-4 shadow-sm">
            <div className="mb-6 px-3">
                <Logo size="md" />
            </div>

            <div className="mb-4 px-3 pb-4 border-b border-[#f0ece5]">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#aaa]">
                {workspaceLabel}
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
