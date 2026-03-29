"use client";

import { ArrowRight, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Logo from "../components/Logo";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#f4f1ed]">
      <main className="flex flex-1 items-center justify-center px-5 py-24 lg:px-8">
        <div className="w-full max-w-md animate-in slide-in-from-bottom-8 fade-in duration-500">

          <div className="mb-8 text-center">
            <div className="text-black">
              <Logo color="text-black" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-[#111] sm:text-4xl" style={{ fontFamily: "var(--font-display)" }}>
              Welcome back
            </h1>
            <p className="mt-2 text-sm text-[#777]">
              Enter your credentials to access your account.
            </p>
          </div>

          <div className="rounded-2xl border border-[#e0dbd3] bg-white p-6 shadow-sm sm:p-8">
            {error && (
              <div className="text-center">
                <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm font-medium text-red-600 ring-1 ring-inset ring-red-600/10">
                  {error}
                </div>
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

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#555]">
                    Password
                  </label>
                  <Link href="/forgot-password" className="text-xs font-semibold text-[#e8612e] hover:underline">
                    Forgot password?
                  </Link>
                </div>
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

              <button
                type="submit"
                disabled={isLoggingIn}
                className="group flex w-full items-center justify-center gap-2 rounded-[8px] bg-[#111] py-3.5 text-sm font-bold text-white transition-all hover:bg-[#333] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoggingIn ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-[#f0ece5]" />
              <span className="text-xs font-semibold uppercase tracking-wider text-[#aaa]">or</span>
              <div className="h-px flex-1 bg-[#f0ece5]" />
            </div>

            <p className="mt-6 text-center text-sm text-[#777]">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="font-bold text-[#e8612e] hover:underline transition-colors">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
