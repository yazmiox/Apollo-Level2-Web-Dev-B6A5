"use client";

import { ArrowRight, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "../lib/auth-client";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await authClient.signUp.email({
      name,
      email,
      password
    }, {
      onRequest: () => {
        setError(null)
        setIsRegistering(true);
      },
      onSuccess: () => {
        router.push('/verify-email')
        setIsRegistering(false);
      },
      onError: (ctx) => {
        setError(ctx.error.message);
        setIsRegistering(false);
      }
    })

    console.log('User Registered:', res)
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#f4f1ed]"><main className="flex flex-1 items-center justify-center px-5 py-24 lg:px-8">
      <div className="w-full max-w-md animate-in slide-in-from-bottom-8 fade-in duration-500">

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-[#111] sm:text-4xl" style={{ fontFamily: "var(--font-display)" }}>
            Create an account
          </h1>
          <p className="mt-2 text-sm text-[#777]">
            Join EquipFlow to start renting premium gear.
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
          <form onSubmit={handleSubmit} className="space-y-4">

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#555]">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full rounded-[8px] border border-[#e0dbd3] bg-[#f9f8f6] px-4 py-3 text-sm text-[#111] placeholder-[#aaa] outline-none transition-all focus:border-[#e8612e] focus:bg-white focus:ring-1 focus:ring-[#e8612e]/30"
                required
              />
            </div>

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
              <label className="text-xs font-bold uppercase tracking-wider text-[#555]">
                Password
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
              <p className="text-[10px] text-[#aaa]">Must be at least 8 characters.</p>
            </div>

            <button
              type="submit"
              disabled={isRegistering}
              className="group mt-2 flex w-full items-center justify-center gap-2 rounded-[8px] bg-[#e8612e] py-3.5 text-sm font-bold text-white transition-all hover:bg-[#f07248] active:scale-[0.98]  disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isRegistering ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  <span>Creating account...</span>
                </div>
              ) : (
                <>
                  Create Account
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#777]">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-[#e8612e] hover:underline transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
    </div>
  );
}
