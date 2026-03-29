"use client"

import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import BookingModal from "../[slug]/BookingModal";

export default function RequestBookingButton({ item }: { item: any }) {
    const [modalOpen, setModalOpen] = useState(false);
    return (
        <>
            <button
                onClick={() => setModalOpen(true)}
                className="flex w-full items-center justify-center gap-2 rounded-[8px] bg-[#e8612e] py-3.5 text-sm font-bold text-white hover:bg-[#f07248] active:scale-[0.98] transition-all"
            >
                <CalendarIcon size={16} />
                Request Booking
            </button>

            {/* ── Booking Modal ── */}
            {modalOpen && (
                <BookingModal
                    item={item}
                    onClose={() => setModalOpen(false)}
                />
            )}
        </>
    )
}