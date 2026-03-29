"use client";

import { CheckCircle2, Loader2, MailCheck } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { authClient } from "../lib/auth-client";

export default function VerifyEmailPage() {
  const { data, isPending } = authClient.useSession()
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [cooldown, setCooldown] = useState(0);
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(Boolean(token));

  const verifyEmail = async () => {
    if (!token) return;
    setIsVerifyingEmail(true);

    await authClient.verifyEmail({
      query: {
        token: token
      }
    }, {
      onRequest() {
        setIsVerifyingEmail(true)
      },
      onSuccess() {
        setIsVerifyingEmail(false)
        router.push("/dashboard");
        // startTimer()
      },
      onError(ctx) {
        toast.error(ctx.error.message)
      }
    })
  };

  const sendVerificationEmail = async () => {
    console.log(data)
    await authClient.sendVerificationEmail({
      email: data?.user?.email!
    }, {
      onSuccess() {
        toast.success("Verification email sent")
      },
      onError(ctx) {
        toast.error(ctx.error.message)
      }
    })
  };

  const handleResendEmail = () => {
    if (cooldown > 0) return;
    sendVerificationEmail();
    setCooldown(30);
  };

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  useEffect(() => {
    if (token && (!data?.session && !data?.user.emailVerified)) {
      verifyEmail();
    }
  }, []);

  useEffect(() => {
    if (data?.session) {
      if (data?.user.emailVerified) {
        router.push("/dashboard");
      } else if (!token) {
        sendVerificationEmail();
      }
    }
  }, [isPending]);

  // Has token (Attempting verification / Verification successful)
  if (token) {
    if (isVerifyingEmail) {
      return (
        <div className="flex min-h-screen flex-col bg-[#f4f1ed]">
          <main className="flex flex-1 items-center justify-center px-5 py-24 lg:px-8">
            <div className="w-full max-w-md animate-in slide-in-from-bottom-8 fade-in duration-500">
              <div className="rounded-2xl border border-[#e0dbd3] bg-white p-8 text-center shadow-sm">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#fdf5f2] text-[#e8612e]">
                  <Loader2 size={32} className="animate-spin" />
                </div>
                <h2 className="text-2xl font-extrabold tracking-tight text-[#111]" style={{ fontFamily: "var(--font-display)" }}>
                  Verifying your email
                </h2>
                <p className="mt-3 text-sm text-[#777]">
                  Just a moment! We&apos;re confirming your verification link and setting up your account.
                </p>
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
            <div className="rounded-2xl border border-[#e0dbd3] bg-white p-8 text-center shadow-sm">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 text-green-600">
                <CheckCircle2 size={32} />
              </div>
              <h2 className="text-2xl font-extrabold tracking-tight text-[#111]" style={{ fontFamily: "var(--font-display)" }}>
                Email Verified!
              </h2>
              <p className="mt-3 text-sm text-[#777]">
                Your email has been successfully verified. <br className="hidden sm:block" />
                You will be redirected to the dashboard...
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // No token: User just registered and needs to check email
  return (
    <div className="flex min-h-screen flex-col bg-[#f4f1ed]">
      <main className="flex flex-1 items-center justify-center px-5 py-24 lg:px-8">
        <div className="w-full max-w-md animate-in slide-in-from-bottom-8 fade-in duration-500">
          <div className="rounded-2xl border border-[#e0dbd3] bg-white p-8 text-center shadow-sm">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#111] text-white">
              <MailCheck size={32} />
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight text-[#111]" style={{ fontFamily: "var(--font-display)" }}>
              Check your email
            </h2>
            <p className="mt-3 text-sm text-[#777]">
              We&apos;ve sent a verification link to your inbox. <br className="hidden sm:block" />
              Please click the link to verify your account and get started.
            </p>

            <div className="mt-8">
              <button
                onClick={handleResendEmail}
                disabled={cooldown > 0}
                className="flex w-full items-center justify-center rounded-[8px] bg-[#111] py-3.5 text-sm font-bold text-white transition-all hover:bg-[#333] active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-[#888] disabled:hover:scale-100"
              >
                {cooldown > 0 ? `Resend available in ${cooldown}s` : "Resend Verification Email"}
              </button>
            </div>

            <p className="mt-5 text-xs font-semibold italic text-[#aaa]">
              Didn&apos;t receive the email? Check your spam folder or try resending.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}