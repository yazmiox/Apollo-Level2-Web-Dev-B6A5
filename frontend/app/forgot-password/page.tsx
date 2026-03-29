"use client";

import { ArrowRight, KeyRound, Loader2, Mail } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { authClient } from "../lib/auth-client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setError(null);

    const { error } = await authClient.requestPasswordReset({
      email: email,
      redirectTo: process.env.NEXT_PUBLIC_APP_URL + "/reset-password"
    })

    setIsSending(false)
    if (error) {
      setError(error.message!)
      return
    }
    setSuccess(true)
  };

  if (success) {
    return (
      <div className="flex min-h-screen flex-col bg-[#f4f1ed]"><main className="flex flex-1 items-center justify-center px-5 py-24 lg:px-8">
        <div className="w-full max-w-md animate-in slide-in-from-bottom-8 fade-in duration-500">
          <div className="rounded-2xl border border-[#e0dbd3] bg-white p-8 text-center shadow-sm">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#fdf5f2] text-[#e8612e]">
              <Mail size={32} />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-[#111]" style={{ fontFamily: "var(--font-display)" }}>
              Check your email
            </h1>
            <p className="mt-3 text-sm text-[#777]">
              We&apos;ve sent a password reset link to <br />
              <span className="font-bold text-[#111]">{email}</span>.
            </p>
            <div className="mt-8 flex flex-col gap-3">
              <button
                onClick={() => setSuccess(false)}
                className="rounded-[8px] bg-[#111] py-3 text-sm font-bold text-white transition-all hover:bg-[#333] active:scale-[0.98]"
              >
                Resend Link
              </button>
              <Link
                href="/login"
                className="rounded-[8px] border border-[#e0dbd3] bg-white py-3 text-sm font-bold text-[#555] transition-all hover:bg-[#f9f8f6] hover:text-[#111] active:scale-[0.98]"
              >
                Back to Sign In
              </Link>
            </div>
          </div>
        </div>
      </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#f4f1ed]">
      <main className="flex flex-1 items-center justify-center px-5 py-24 lg:px-8">
        <div className="w-full max-w-md animate-in slide-in-from-bottom-8 fade-in duration-500">

          <div className="mb-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#111] text-white shadow-lg mb-6">
              <KeyRound size={28} />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-[#111] sm:text-4xl" style={{ fontFamily: "var(--font-display)" }}>
              Forgot password?
            </h1>
            <p className="mt-2 text-sm text-[#777]">
              No worries, we&apos;ll send you reset instructions.
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
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full rounded-[8px] border border-[#e0dbd3] bg-[#f9f8f6] px-4 py-3 text-sm text-[#111] placeholder-[#aaa] outline-none transition-all focus:border-[#e8612e] focus:bg-white focus:ring-1 focus:ring-[#e8612e]/30"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSending}
                className="group flex w-full items-center justify-center gap-2 rounded-[8px] bg-[#111] py-3.5 text-sm font-bold text-white transition-all hover:bg-[#333] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100"
              >
                {isSending ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Sending link...
                  </>
                ) : (
                  <>
                    Reset Password
                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>

              <Link
                href="/login"
                className="mt-4 flex w-full justify-center text-sm font-bold text-[#777] hover:text-[#e8612e] transition-colors"
              >
                Back to Sign In
              </Link>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
