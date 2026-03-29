"use client";

import { XCircle, ArrowLeft, RefreshCw, HelpCircle } from "lucide-react";
import Link from "next/link";

export default function CancelPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f9f8f6] p-4">
      <div className="w-full max-w-md rounded-2xl border border-[#e0dbd3] bg-white p-8 shadow-xl text-center">
        <div className="mb-6 flex justify-center text-red-100">
          <div className="rounded-full bg-red-50 p-3">
            <XCircle className="h-12 w-12 text-red-600" />
          </div>
        </div>

        <h1 className="mb-2 text-2xl font-extrabold text-[#111]" style={{ fontFamily: "var(--font-display)" }}>
          Payment Cancelled
        </h1>
        <p className="mb-8 text-[#777]">
            You have cancelled the checkout process. Your booking details are still saved, so you can retry the payment whenever you are ready.
        </p>

        <div className="space-y-3">
            <Link 
                href="/dashboard/bookings"
                className="flex w-full items-center justify-center gap-2 rounded-[8px] bg-[#111] py-3.5 text-sm font-bold text-white transition-all hover:bg-[#333] active:scale-[0.98]"
            >
                <RefreshCw size={18} />
                Retry Payment
            </Link>
            
            <Link 
                href="/dashboard"
                className="flex w-full items-center justify-center gap-2 rounded-[8px] bg-slate-100 py-3.5 text-sm font-bold text-[#555] transition-all hover:bg-slate-200 active:scale-[0.98]"
            >
                <ArrowLeft size={18} />
                Back to Overview
            </Link>

            <div className="pt-6">
                <p className="flex items-center justify-center gap-1.5 text-xs font-bold text-[#aaa]">
                    <HelpCircle size={14} />
                    HAVE QUESTIONS? CONTACT OUR SUPPORT
                </p>
            </div>
        </div>
      </div>
    </div>
  );
}
