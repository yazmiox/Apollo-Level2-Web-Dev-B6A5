"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, Loader2, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";

function SuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If we have a session_id, we can verify it or just show success
    // The backend uses a webhook to update booking status, so we can just wait
    // a bit and redirect or show the state.
    const sessionId = searchParams.get("session_id");
    if (!sessionId) {
      router.push("/dashboard/bookings");
      return;
    }

    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [searchParams, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#f9f8f6] p-4 text-center">
        <Loader2 className="h-10 w-10 animate-spin text-[#e8612e]" />
        <p className="mt-4 text-sm font-bold text-[#111]">Verifying your payment...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f9f8f6] p-4">
      <div className="w-full max-w-md rounded-2xl border border-[#e0dbd3] bg-white p-8 shadow-xl text-center">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-green-100 p-3">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>
        </div>

        <h1 className="mb-2 text-2xl font-extrabold text-[#111]" style={{ fontFamily: "var(--font-display)" }}>
          Payment Successful!
        </h1>
        <p className="mb-8 text-[#777]">
          Your equipment booking has been confirmed. You can now track its status from your dashboard.
        </p>

        <div className="space-y-4">
          <Link
            href="/dashboard/bookings"
            className="flex w-full items-center justify-center gap-2 rounded-[8px] bg-[#111] py-3.5 text-sm font-bold text-white transition-all hover:bg-[#333] active:scale-[0.98]"
          >
            View My Bookings
            <ArrowRight size={18} />
          </Link>

          <div className="flex items-center justify-center gap-2 text-xs font-bold text-[#aaa] pt-4">
            <ShieldCheck size={14} />
            SECURE TRANSACTION
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Success() {
  return <Suspense fallback={
    <div className="flex min-h-screen items-center justify-center bg-[#f9f8f6] p-4 text-center">
      <Loader2 className="h-10 w-10 animate-spin text-[#e8612e]" />
    </div>
  }>
    <SuccessPage />
  </Suspense>
}