"use client";

import { ArrowRight, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "../lib/auth-client";
import Logo from "../components/Logo";

const DEMO_USER_CREDENTIALS = {
  email: process.env.NEXT_PUBLIC_DEMO_USER_EMAIL ?? "",
  password: process.env.NEXT_PUBLIC_DEMO_USER_PASSWORD ?? "",
};

const DEMO_ADMIN_CREDENTIALS = {
  email: process.env.NEXT_PUBLIC_DEMO_ADMIN_EMAIL ?? "",
  password: process.env.NEXT_PUBLIC_DEMO_ADMIN_PASSWORD ?? "",
};

const DEMO_VENDOR_CREDENTIALS = {
  email: process.env.NEXT_PUBLIC_DEMO_VENDOR_EMAIL ?? "",
  password: process.env.NEXT_PUBLIC_DEMO_VENDOR_PASSWORD ?? "",
};

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isGoogleLoggingIn, setIsGoogleLoggingIn] = useState(false);
  const router = useRouter();

  const fillDemoCredentials = (type: "user" | "admin" | "vendor") => {
    const credentials = 
      type === "admin" ? DEMO_ADMIN_CREDENTIALS : 
      type === "vendor" ? DEMO_VENDOR_CREDENTIALS : 
      DEMO_USER_CREDENTIALS;

    if (!credentials.email || !credentials.password) {
      setError(
        `Demo ${type} credentials are not configured yet. Please set NEXT_PUBLIC_DEMO_${type.toUpperCase()}_EMAIL and NEXT_PUBLIC_DEMO_${type.toUpperCase()}_PASSWORD.`
      );
      return;
    }

    setError(null);
    setEmail(credentials.email);
    setPassword(credentials.password);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await authClient.signIn.email({
      email,
      password
    }, {
      onRequest: () => {
        setError(null)
        setIsLoggingIn(true);
      },
      onSuccess: () => {
        router.push('/dashboard')
        setIsLoggingIn(false);
      },
      onError: (ctx) => {
        if (ctx.error.status === 403) {
          router.push('/verify-email')
        } else {
          setError(ctx.error.message);
          setIsLoggingIn(false);
        }
      }
    })
  };

  const handleGoogleSignIn = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: process.env.NEXT_PUBLIC_APP_URL + "/dashboard"
    }, {
      onRequest: () => {
        setIsGoogleLoggingIn(true);
      },
      onSuccess: () => {
        setIsGoogleLoggingIn(false);
      },
      onError: (ctx) => {
        setError(ctx.error.message);
        setIsGoogleLoggingIn(false);
      }
    })
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#f4f1ed]">
      <main className="flex flex-1 items-center justify-center px-5 py-24 lg:px-8">
        <div className="w-full max-w-md animate-in slide-in-from-bottom-8 fade-in duration-500">

          <div className="mb-10 flex justify-center">
            <Logo size="lg" />
          </div>

          <div className="rounded-3xl border border-[#e0dbd3] bg-white p-8 shadow-sm sm:p-10">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-extrabold tracking-tight text-[#111]" style={{ fontFamily: "var(--font-display)" }}>
                Welcome back
              </h1>
              <p className="mt-1.5 text-sm text-[#777]">
                Enter your credentials to access your account.
              </p>
            </div>
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
              <span className="text-xs font-semibold uppercase tracking-wider text-[#aaa]">or continue with</span>
              <div className="h-px flex-1 bg-[#f0ece5]" />
            </div>

            <button
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoggingIn}
              className="mt-6 flex w-full items-center justify-center gap-3 rounded-[8px] border border-[#e0dbd3] bg-white py-3 text-sm font-bold text-[#111] transition-all hover:bg-[#f9f8f6] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isGoogleLoggingIn ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#111] border-t-transparent"></div>
                  <span>Connecting...</span>
                </div>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Sign in with Google
                </>
              )}
            </button>

            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              <button
                type="button"
                onClick={() => fillDemoCredentials("user")}
                className="rounded-[8px] border border-[#e0dbd3] bg-[#f9f8f6] px-2 py-2.5 text-[9px] font-bold uppercase tracking-[0.05em] text-[#777] hover:border-[#e8612e]/40 hover:text-[#e8612e] transition-colors"
              >
                Demo User
              </button>
              <button
                type="button"
                onClick={() => fillDemoCredentials("vendor")}
                className="rounded-[8px] border border-[#e0dbd3] bg-[#f9f8f6] px-2 py-2.5 text-[9px] font-bold uppercase tracking-[0.05em] text-[#777] hover:border-[#e8612e]/40 hover:text-[#e8612e] transition-colors"
              >
                Demo Vendor
              </button>
              <button
                type="button"
                onClick={() => fillDemoCredentials("admin")}
                className="rounded-[8px] border border-[#e0dbd3] bg-[#f9f8f6] px-2 py-2.5 text-[9px] font-bold uppercase tracking-[0.05em] text-[#777] hover:border-[#e8612e]/40 hover:text-[#e8612e] transition-colors"
              >
                Demo Admin
              </button>
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
