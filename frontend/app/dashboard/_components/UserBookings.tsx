"use client";

import { createCheckoutSession } from "@/app/actions/payment";
import { createReview, updateReview } from "@/app/actions/review";
import { ArrowRight, Calendar, Edit2, Loader2, MapPin, Star, Trash2, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

interface Review {
  id: string;
  rating: number;
  comment?: string;
}

interface Booking {
  id: string;
  startDate: string;
  endDate: string;
  amount: number;
  status: string;
  equipment: {
    name: string;
    imageKey: string;
    location: string;
  };
  review?: Review;
}

export default function UserBookings({ initialBookings }: { initialBookings: Booking[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState("ALL");
  const [reviewModalData, setReviewModalData] = useState<{ id: string; name: string; review?: Review } | null>(null);
  const [hoverStar, setHoverStar] = useState(0);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isPending, startTransition] = useTransition();
  const [paymentLoading, setPaymentLoading] = useState<string | null>(null);

  const filteredBookings = filter === "ALL"
    ? initialBookings
    : initialBookings.filter(b => {
      if (filter === "ACTIVE") return ["PENDING_APPROVAL", "AWAITING_PAYMENT", "CONFIRMED", "ACTIVE"].includes(b.status);
      if (filter === "PAST") return ["RETURNED", "CANCELLED", "REJECTED"].includes(b.status);
      return true;
    });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING_APPROVAL":
        return <span className="inline-flex w-fit rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-600">Awaiting Admin</span>;
      case "AWAITING_PAYMENT":
        return <span className="inline-flex w-fit rounded-full border border-[#e8612e]/30 bg-[#e8612e]/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#e8612e] animate-pulse">Needs Payment</span>;
      case "ACTIVE":
        return <span className="inline-flex w-fit rounded-full bg-blue-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-600">Active</span>;
      case "CONFIRMED":
        return <span className="inline-flex w-fit rounded-full bg-indigo-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-indigo-600">Confirmed</span>;
      case "RETURNED":
        return <span className="inline-flex w-fit rounded-full bg-green-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-green-600">Returned</span>;
      case "CANCELLED":
      case "REJECTED":
        return <span className="inline-flex w-fit rounded-full bg-red-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-red-600">{status}</span>;
      default:
        return <span className="inline-flex w-fit rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-600">{status}</span>;
    }
  }

  const handleOpenReviewModal = (booking: Booking) => {
    setReviewModalData({ id: booking.id, name: booking.equipment.name, review: booking.review });
    if (booking.review) {
      setRating(booking.review.rating);
      setComment(booking.review.comment || "");
    } else {
      setRating(5);
      setComment("");
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewModalData) return;

    startTransition(async () => {
      let res;
      if (reviewModalData.review) {
        res = await updateReview(reviewModalData.review.id, { rating, comment });
      } else {
        res = await createReview({ bookingId: reviewModalData.id, rating, comment });
      }

      if (res.success) {
        toast.success(res.message || "Review status updated");
        setReviewModalData(null);
        router.refresh();
      } else {
        toast.error(res.message || "Something went wrong");
      }
    });
  };

  const handleDeleteReview = async (id: string) => {
  };

  const handlePayment = async (bookingId: string) => {
    setPaymentLoading(bookingId);
    try {
      const res = await createCheckoutSession(bookingId);
      if (res.success && res.data?.url) {
        window.location.href = res.data.url;
      } else {
        toast.error(res.message || "Failed to initialize payment");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setPaymentLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#111]" style={{ fontFamily: "var(--font-display)" }}>
            My Bookings
          </h1>
          <p className="mt-1 text-sm text-[#777]">
            Track your equipment requests and rental history.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-[8px] border border-[#e0dbd3] bg-white p-1 shadow-sm">
          {["ALL", "ACTIVE", "PAST"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-[6px] px-4 py-1.5 text-xs font-bold transition-all ${filter === f ? "bg-[#111] text-white" : "text-[#777] hover:text-[#111]"
                }`}
            >
              {f === "ALL" ? "All" : f === "ACTIVE" ? "Active" : "Past"}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredBookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#d5d0c5] py-20 text-center">
            <p className="text-sm font-semibold text-[#555]">No bookings found.</p>
          </div>
        ) : (
          filteredBookings.map((booking) => (
            <div
              key={booking.id}
              className="flex flex-col gap-5 rounded-2xl border border-[#e0dbd3] bg-white p-5 shadow-sm transition-all hover:shadow-md"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                <div className="relative h-24 w-full shrink-0 overflow-hidden rounded-xl bg-[#f4f1ed] sm:w-32">
                  <Image src={booking.equipment.imageUrl} alt={booking.equipment.name} fill className="object-cover" />
                </div>

                <div className="flex flex-1 flex-col gap-2">
                  <div className="flex items-start justify-between">
                    <h3 className="text-base font-bold text-[#111]">
                      {booking.equipment.name}
                    </h3>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-[#777]">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={14} />
                      {new Date(booking.startDate).toLocaleDateString()} – {new Date(booking.endDate).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin size={14} />
                      {booking.equipment.location}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center min-w-[120px]">
                  {getStatusBadge(booking.status)}
                </div>

                <div className="flex shrink-0 flex-col items-end gap-3 min-w-[140px]">
                  <span className="text-xl font-extrabold text-[#111]">
                    ${Number(booking.amount).toFixed(2)}
                  </span>

                  {booking.status === "AWAITING_PAYMENT" && (
                    <button
                      onClick={() => handlePayment(booking.id)}
                      disabled={paymentLoading === booking.id}
                      className="flex items-center gap-2 rounded-[6px] bg-[#e8612e] px-4 py-2 text-xs font-bold text-white transition-all hover:bg-[#f07248] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {paymentLoading === booking.id && <Loader2 size={14} className="animate-spin" />}
                      Pay Now
                      <ArrowRight size={14} />
                    </button>
                  )}

                  {(booking.status === "RETURNED" || booking.status === "COMPLETED") && !booking.review && (
                    <button
                      onClick={() => handleOpenReviewModal(booking)}
                      className="flex items-center gap-1.5 rounded-[6px] bg-[#111] px-4 py-2 text-xs font-bold text-white transition-all hover:bg-[#333] active:scale-95"
                    >
                      <Star size={14} className="fill-white" />
                      Rate
                    </button>
                  )}
                </div>
              </div>

              {booking.review && (
                <div className="mt-2 border-t border-[#f0ece5] pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={i < (booking.review?.rating || 0) ? "fill-[#e8612e] text-[#e8612e]" : "text-[#d5d0c5]"}
                          />
                        ))}
                        <span className="ml-2 text-xs font-bold text-[#111]">Your Review</span>
                      </div>
                      {booking.review.comment && (
                        <p className="text-sm text-[#555] italic">"{booking.review.comment}"</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenReviewModal(booking)}
                        className="p-2 text-[#888] hover:text-[#111] hover:bg-[#f4f1ed] rounded-md transition-all"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteReview(booking.review!.id)}
                        className="p-2 text-[#888] hover:text-red-600 hover:bg-red-50 rounded-md transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {reviewModalData && (
        <>
          <div className="fixed inset-0 z-50 bg-[#111]/40 backdrop-blur-sm" onClick={() => setReviewModalData(null)} />
          <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-extrabold text-[#111]">{reviewModalData.review ? "Edit Review" : "Leave a Review"}</h3>
                <p className="text-xs text-[#888]">For {reviewModalData.name}</p>
              </div>
              <button disabled={isPending} onClick={() => setReviewModalData(null)} className="rounded-md p-1.5 text-[#aaa] hover:bg-[#f4f1ed] hover:text-[#111]">
                <X size={20} />
              </button>
            </div>

            <form className="space-y-4" onSubmit={handleSubmitReview}>
              <div className="flex justify-center gap-2 py-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    disabled={isPending}
                    onMouseEnter={() => setHoverStar(star)}
                    onMouseLeave={() => setHoverStar(0)}
                    onClick={() => setRating(star)}
                    className="p-1 transition-transform hover:scale-110"
                  >
                    <Star
                      size={32}
                      className={`${star <= (hoverStar || rating) ? "fill-[#e8612e] text-[#e8612e]" : "fill-transparent text-[#d5d0c5]"}`}
                    />
                  </button>
                ))}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#777]">Your Feedback</label>
                <textarea
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  disabled={isPending}
                  placeholder="How was the equipment?"
                  className="rounded-[7px] border border-[#e0dbd3] px-3 py-2 text-sm text-[#111] outline-none focus:border-[#e8612e] focus:ring-1 focus:ring-[#e8612e] resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full rounded-[8px] bg-[#e8612e] py-3 text-sm font-bold text-white hover:bg-[#f07248] active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  {isPending && <Loader2 size={16} className="animate-spin" />}
                  {reviewModalData.review ? "Update Review" : "Submit Review"}
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
