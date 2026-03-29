"use client";

import { ArrowRight, CheckCircle2, Eye, EyeOff, KeyRound, Loader2, XCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { authClient } from "../lib/auth-client";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const errorToken = searchParams.get("error");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [isResetting, setIsResetting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // If token is invalid/expired
  if (!token || errorToken) {
    console.log("Invalid or expired token")
    return (

      <div className="flex min-h-screen flex-col bg-[#f4f1ed]">
        <main className="flex flex-1 items-center justify-center px-5 py-24 lg:px-8">
          <div className="rounded-2xl border border-[#e0dbd3] bg-white p-8 text-center shadow-sm">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-red-500">
              <XCircle size={32} />
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight text-[#111]" style={{ fontFamily: "var(--font-display)" }}>
              Invalid or expired token
            </h2>
            <p className="mt-3 text-sm text-[#777]">
              The token provided is invalid or has expired. <br />
              Please request a new reset link.
            </p>
          </div>
        </main>
      </div>
    );
  }

  // Success state
  if (success) {
    return (
      <div className="flex min-h-screen flex-col bg-[#f4f1ed]">
        <main className="flex flex-1 items-center justify-center px-5 py-24 lg:px-8">
          <div className="rounded-2xl border border-[#e0dbd3] bg-white p-8 text-center shadow-sm">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 text-green-600">
              <CheckCircle2 size={32} />
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight text-[#111]" style={{ fontFamily: "var(--font-display)" }}>
              Password Reset!
            </h2>
            <p className="mt-3 text-sm text-[#777]">
              Your password has been successfully updated. <br />
              You can now use your new password to sign in.
            </p>
            <div className="mt-8">
              <Link
                href="/login"
                className="flex w-full items-center justify-center rounded-[8px] bg-[#e8612e] py-3 text-sm font-bold text-white transition-all hover:bg-[#f07248] active:scale-[0.98]"
              >
                Back to Sign In
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setError("No token provided");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsResetting(true);
    setError(null);

    const { error } = await authClient.resetPassword({
      newPassword: password,
      token: token
    })

    if (error) {
      setError(error.message!)
      return
    }

    setSuccess(true)

  };

  return (
    <div className="flex min-h-screen flex-col bg-[#f4f1ed]">
      <main className="flex flex-1 items-center justify-center px-5 py-24 lg:px-8">
        <div className="w-full max-w-md animate-in slide-in-from-bottom-8 fade-in duration-500">
          <div className="mb-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#111] text-white shadow-lg mb-6">
              <KeyRound size={28} />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-[#111] sm:text-4xl" style={{ fontFamily: "var(--font-display)" }}>
              Set new password
            </h1>
            <p className="mt-2 text-sm text-[#777]">
              Please enter your new password below.
            </p>
          </div>

          <div className="rounded-2xl border border-[#e0dbd3] bg-white p-6 shadow-sm sm:p-8">
            {error && (
              <div className="mb-6 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-center text-sm font-medium text-red-600">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#555]">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-[8px] border border-[#e0dbd3] bg-[#f9f8f6] px-4 py-3 pr-10 text-sm text-[#111] placeholder-[#aaa] outline-none transition-all focus:border-[#e8612e] focus:bg-white focus:ring-1 focus:ring-[#e8612e]/30"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#aaa] hover:text-[#555] transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#555]">
                  Confirm New Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-[8px] border border-[#e0dbd3] bg-[#f9f8f6] px-4 py-3 text-sm text-[#111] placeholder-[#aaa] outline-none transition-all focus:border-[#e8612e] focus:bg-white focus:ring-1 focus:ring-[#e8612e]/30"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isResetting}
                className="group mt-2 flex w-full items-center justify-center gap-2 rounded-[8px] bg-[#111] py-3.5 text-sm font-bold text-white transition-all hover:bg-[#333] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100"
              >
                {isResetting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    Reset Password
                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}