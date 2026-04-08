"use client"

import { Check, X, Loader2, RotateCcw, PackageOpen } from "lucide-react";
import { updateBookingStatus } from "../../actions/booking";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface BookingActionsProps {
    bookingId: string;
    currentStatus: string;
}

export default function BookingActions({ bookingId, currentStatus }: BookingActionsProps) {
    const [isLoading, setIsLoading] = useState<string | null>(null);
    const router = useRouter();

    const handleBookingStatusChange = async (status: string) => {
        setIsLoading(status);
        try {
            const response = await updateBookingStatus(bookingId, status);
            if (!response.success) throw new Error(response.message || "Failed to update booking status");

            toast.success(`Booking status updated to ${status.replace(/_/g, " ").toLowerCase()}`);
            router.refresh();
        } catch (error: any) {
            toast.error(error.message || "Failed to update booking status");
            console.error(error);
        } finally {
            setIsLoading(null);
        }
    }

    return <div className="flex items-center justify-end gap-2">
        {currentStatus === "PENDING_APPROVAL" && (
            <>
                <button
                    disabled={isLoading !== null}
                    onClick={() => handleBookingStatusChange("REJECTED")}
                    className="flex items-center gap-1.5 rounded-[6px] border border-[#e0dbd3] bg-white px-3 py-1.5 text-xs font-bold text-red-600 transition-all hover:bg-red-50 hover:border-red-200 active:scale-95 disabled:pointer-events-none disabled:opacity-75"
                >
                    {isLoading === "REJECTED" ? <Loader2 size={14} className="animate-spin" /> : <X size={14} />}
                    Reject
                </button>
                <button
                    disabled={isLoading !== null}
                    onClick={() => handleBookingStatusChange("AWAITING_PAYMENT")}
                    className="flex items-center gap-1.5 rounded-[6px] bg-[#111] px-3 py-1.5 text-xs font-bold text-white transition-all hover:bg-[#333] active:scale-95 shadow-sm disabled:pointer-events-none disabled:opacity-75"
                >
                    {isLoading === "AWAITING_PAYMENT" ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                    Approve
                </button>
            </>
        )}

        {currentStatus === "AWAITING_PAYMENT" && (
            <button
                disabled={isLoading !== null}
                onClick={() => handleBookingStatusChange("CANCELLED")}
                className="flex items-center gap-1.5 rounded-[6px] border border-[#e0dbd3] bg-white px-3 py-1.5 text-xs font-bold text-red-600 transition-all hover:bg-red-50 hover:border-red-200 active:scale-95 disabled:pointer-events-none disabled:opacity-75"
            >
                {isLoading === "CANCELLED" ? <Loader2 size={14} className="animate-spin" /> : <X size={14} />}
                Cancel Booking
            </button>
        )}

        {currentStatus === "CONFIRMED" && (
            <button
                disabled={isLoading !== null}
                onClick={() => handleBookingStatusChange("ACTIVE")}
                className="flex items-center gap-1.5 rounded-[6px] bg-[#111] px-3 py-1.5 text-xs font-bold text-white transition-all hover:bg-[#333] active:scale-95 shadow-sm disabled:pointer-events-none disabled:opacity-75"
            >
                {isLoading === "ACTIVE" ? <Loader2 size={14} className="animate-spin" /> : <PackageOpen size={14} />}
                Mark as Picked Up
            </button>
        )}

        {currentStatus === "ACTIVE" && (
            <button
                disabled={isLoading !== null}
                onClick={() => handleBookingStatusChange("RETURNED")}
                className="flex items-center gap-1.5 rounded-[6px] bg-[#111] px-3 py-1.5 text-xs font-bold text-white transition-all hover:bg-[#333] active:scale-95 shadow-sm disabled:pointer-events-none disabled:opacity-75"
            >
                {isLoading === "RETURNED" ? <Loader2 size={14} className="animate-spin" /> : <RotateCcw size={14} />}
                Mark as Returned
            </button>
        )}
    </div>
}
