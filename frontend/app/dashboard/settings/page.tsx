"use client";

import { authClient } from "@/app/lib/auth-client";
import { Loader2, Mail, ShieldCheck, User } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const DEMO_ADMIN_EMAILS = new Set(
  `${process.env.NEXT_PUBLIC_DEMO_ADMIN_EMAILS ?? ""},${process.env.NEXT_PUBLIC_DEMO_ADMIN_EMAIL ?? ""}`
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)
);

export default function UserSettingsPage() {
  const { data: session } = authClient.useSession();
  const [name, setName] = useState(session?.user?.name || "");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const isDemoAdmin =
    session?.user?.role === "admin" &&
    DEMO_ADMIN_EMAILS.has((session?.user?.email ?? "").toLowerCase());

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (session?.user?.name) {
      setName(session.user.name);
    }
  }, [session]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isDemoAdmin) {
      toast.error("Demo admin account is view-only. Profile updates are disabled.");
      return;
    }

    setIsUpdatingProfile(true);
    await authClient.updateUser({
      name
    }, {
      onSuccess: () => {
        toast.success("Profile updated successfully");
        setIsUpdatingProfile(false);
      },
      onError: (ctx) => {
        toast.error(ctx.error.message);
        setIsUpdatingProfile(false);
      }
    })
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isDemoAdmin) {
      toast.error("Demo admin account is view-only. Password changes are disabled.");
      return;
    }

    setIsUpdatingPassword(true);
    await authClient.changePassword({
      currentPassword,
      newPassword,
      revokeOtherSessions: true
    }, {
      onSuccess: () => {
        toast.success("Password updated successfully");
        setCurrentPassword("");
        setNewPassword("");
        setIsUpdatingPassword(false);
      },
      onError: (ctx) => {
        toast.error(ctx.error.message);
        setIsUpdatingPassword(false);
      }
    })
  };

  return (
    <div className="space-y-8 pb-10">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-[#111]" style={{ fontFamily: "var(--font-display)" }}>
          Settings
        </h1>
        <p className="mt-1 text-sm text-[#777]">
          Manage your personal information, security, and account preferences.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Personal Info */}
        <section className="rounded-2xl border border-[#e0dbd3] bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6 flex items-center gap-3 border-b border-[#f0ece5] pb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f9f8f6] text-[#e8612e]">
              <User size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#111]" style={{ fontFamily: "var(--font-display)" }}>Personal Info</h2>
              <p className="text-xs text-[#888]">Update your contact details.</p>
            </div>
          </div>

          {isDemoAdmin && (
            <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-700">
              Demo admin account is view-only. Editing profile information is disabled.
            </div>
          )}

          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#777]">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-[#aaa]" size={16} />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isDemoAdmin}
                  className="w-full rounded-[8px] border border-[#e0dbd3] bg-[#f9f8f6] px-4 py-2.5 pl-10 text-sm font-medium text-[#111] outline-none transition-all focus:border-[#e8612e] focus:bg-white focus:ring-1 focus:ring-[#e8612e]/30"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#777]">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#aaa]" size={16} />
                <input
                  type="email"
                  value={session?.user?.email}
                  disabled
                  className="w-full rounded-[8px] border border-[#e0dbd3] bg-[#f4f1ed] px-4 py-2.5 pl-10 text-sm font-medium text-[#777] outline-none cursor-not-allowed"
                />
              </div>
              <p className="text-[10px] text-[#aaa]">You cannot change your email address.</p>
            </div>

            <button
              type="submit"
              disabled={isUpdatingProfile || isDemoAdmin}
              className="mt-2 flex items-center justify-center gap-2 rounded-[8px] bg-[#111] px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-[#333] active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none"
            >
              {isUpdatingProfile && <Loader2 size={16} className="animate-spin" />}
              {isUpdatingProfile ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </section>

        {/* Security / Password */}
        <section className="space-y-8">
          <div className="rounded-2xl border border-[#e0dbd3] bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6 flex items-center gap-3 border-b border-[#f0ece5] pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f9f8f6] text-[#e8612e]">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#111]" style={{ fontFamily: "var(--font-display)" }}>Password</h2>
                <p className="text-xs text-[#888]">Ensure your account is secure.</p>
              </div>
            </div>

            {isDemoAdmin && (
              <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-700">
                Demo admin account is view-only. Password updates are disabled.
              </div>
            )}

            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#777]">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  disabled={isDemoAdmin}
                  placeholder="********"
                  className="w-full rounded-[8px] border border-[#e0dbd3] bg-[#f9f8f6] px-4 py-2.5 text-sm font-medium text-[#111] outline-none transition-all focus:border-[#e8612e] focus:bg-white focus:ring-1 focus:ring-[#e8612e]/30"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#777]">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={isDemoAdmin}
                  placeholder="********"
                  className="w-full rounded-[8px] border border-[#e0dbd3] bg-[#f9f8f6] px-4 py-2.5 text-sm font-medium text-[#111] outline-none transition-all focus:border-[#e8612e] focus:bg-white focus:ring-1 focus:ring-[#e8612e]/30"
                />
              </div>

              <button
                type="submit"
                disabled={isUpdatingPassword || isDemoAdmin}
                className="mt-2 flex items-center justify-center gap-2 rounded-[8px] bg-[#e8612e] px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-[#f07248] active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none"
              >
                {isUpdatingPassword && <Loader2 size={16} className="animate-spin" />}
                {isUpdatingPassword ? "Updating..." : "Update Password"}
              </button>
            </form>
          </div>
        </section>
      </div>

    </div>
  );
}
