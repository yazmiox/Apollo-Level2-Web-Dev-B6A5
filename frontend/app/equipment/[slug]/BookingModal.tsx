"use client";

import { AlertCircle, CheckCircle2, Loader2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { checkAvailability, createBooking } from "../../actions/booking";

interface BookingModalProps {
  item: any;
  onClose: () => void;
}

export default function BookingModal({ item, onClose }: BookingModalProps) {
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [availabilityMessage, setAvailabilityMessage] = useState<string>("");
  const [submissionError, setSubmissionError] = useState<string>("");

  useEffect(() => {
    const performCheck = async () => {
      if (startDate && endDate) {
        setIsChecking(true);
        setIsAvailable(null);
        setAvailabilityMessage("");
        setSubmissionError("");

        try {
          const res = await checkAvailability({
            equipmentId: item.id,
            startDate: new Date(startDate).toISOString(),
            endDate: new Date(endDate).toISOString(),
          });

          if (res.success) {
            setIsAvailable(res.data.available);
            if (!res.data.available) {
              if (res.data.conflict) {
                const conflictStart = new Date(res.data.conflict.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
                const conflictEnd = new Date(res.data.conflict.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
                setAvailabilityMessage(`Already booked from ${conflictStart} to ${conflictEnd}`);
              } else {
                setAvailabilityMessage(res.data.reason || "Already booked for these dates");
              }
            }
          } else {
            setIsAvailable(false);
            setAvailabilityMessage(res.message || "Could not verify availability");
          }
        } catch (error: any) {
          setIsAvailable(false);
          setAvailabilityMessage(error.message || "Error connecting to availability service");
        } finally {
          setIsChecking(false);
        }
      } else {
        setIsAvailable(null);
        setAvailabilityMessage("");
      }
    };

    performCheck();
  }, [startDate, endDate, item.id]);

  const handleBooking = async () => {
    if (!startDate || !endDate) return;

    setIsSubmitting(true);
    setSubmissionError("");

    try {
      const res = await createBooking({
        equipmentId: item.id,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        notes: "Requested via equipment detail page",
      });

      if (res.success) {
        toast.success("Booking request submitted successfully! An admin will review it soon.");
        onClose();
      } else {
        setSubmissionError(res.message || "Failed to create booking. Please try again.");
      }
    } catch (error: any) {
      setSubmissionError(error.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-[#111]/40 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-2xl animate-in zoom-in-95 fade-in duration-200">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-extrabold text-[#111]" style={{ fontFamily: "var(--font-display)" }}>Select Dates</h3>
            <p className="text-xs text-[#888]">For {item.name}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-[#aaa] hover:bg-[#f4f1ed] hover:text-[#111] transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mb-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#777]">Pickup Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="rounded-[7px] border border-[#e0dbd3] px-3 py-2 text-sm text-[#111] outline-none focus:border-[#e8612e] focus:ring-1 focus:ring-[#e8612e]"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#777]">Return Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="rounded-[7px] border border-[#e0dbd3] px-3 py-2 text-sm text-[#111] outline-none focus:border-[#e8612e] focus:ring-1 focus:ring-[#e8612e]"
              />
            </div>
          </div>

          {(startDate && endDate && (isChecking || isAvailable === false)) && (
            <div className={`flex items-center gap-2 rounded-lg p-3 text-xs font-semibold animate-in fade-in slide-in-from-top-1 duration-200 ${isChecking ? "bg-amber-50 text-amber-700" :
              "bg-red-50 text-red-700"
              }`}>
              {isChecking ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Checking availability...
                </>
              ) : (
                <>
                  <AlertCircle size={14} />
                  {availabilityMessage || "Already booked for these dates."}
                </>
              )}
            </div>
          )}

          {isAvailable === true && !isChecking && (
            <div className="flex items-center gap-2 rounded-lg p-3 text-xs font-semibold bg-green-50 text-green-700 animate-in fade-in slide-in-from-top-1">
              <CheckCircle2 size={14} />
              Great! This item is available for your dates.
            </div>
          )}

          {submissionError && (
            <div className="flex items-center gap-2 rounded-lg p-3 text-xs font-semibold bg-red-50 text-red-700 animate-in shake duration-500">
              <AlertCircle size={14} />
              {submissionError}
            </div>
          )}

          <div className="rounded-lg bg-[#f9f8f6] p-4 text-sm text-[#555]">
            <div className="flex items-center justify-between border-b border-[#e0dbd3] pb-2">
              <span>Rental Rate</span>
              <span className="font-semibold text-[#111]">${item.rentalRate}/day</span>
            </div>
            {startDate && endDate && (
              <div className="flex items-center justify-between pt-2 text-[#888]">
                <span>Total ({Math.max(1, Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 3600 * 24)))} days)</span>
                <span className="font-bold text-[#e8612e]">
                  ${item.rentalRate * Math.max(1, Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 3600 * 24)))}
                </span>
              </div>
            )}
          </div>

          <div className="bg-blue-50/50 rounded-lg p-3 border border-blue-100/50">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-blue-600 mb-1">Booking Tip</h4>
            <p className="text-[11px] text-blue-700/80 leading-relaxed">
              To ensure a smooth rental, avoid selecting dates that overlap with other bookings. If a specific range is unavailable, try moving your pickup or return date by a few days.
            </p>
          </div>
        </div>

        <button
          onClick={handleBooking}
          disabled={!startDate || !endDate || isChecking || isAvailable === false || isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-[8px] bg-[#e8612e] py-3 text-sm font-bold text-white hover:bg-[#f07248] disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed active:scale-[0.98] transition-all"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Submitting Request...
            </>
          ) : isChecking ? (
            "Checking..."
          ) : isAvailable === false ? (
            "Dates Unavailable"
          ) : (
            "Confirm Booking Request"
          )}
        </button>
      </div>
    </>
  );
}
