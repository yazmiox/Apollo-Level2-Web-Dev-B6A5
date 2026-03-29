import { ArrowLeft, Star, Calendar as CalendarIcon } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function EquipmentDetailLoading() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#f4f1ed] pt-16">
        <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
          {/* Back Button Placeholder */}
          <div className="mb-6">
            <div className="inline-flex items-center gap-1.5 animate-pulse">
              <ArrowLeft size={16} className="text-[#ccc]" />
              <div className="h-4 w-32 rounded bg-[#e0dbd3]" />
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1fr_380px] lg:items-start">
            {/* LEFT — Image + Specs */}
            <div className="space-y-6">
              {/* Main photo placeholder */}
              <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-[#e0dbd3] bg-white animate-pulse">
                <div className="absolute top-4 right-4 h-7 w-24 rounded-full bg-[#f0ece5]" />
              </div>

              {/* Gallery thumbnails placeholder */}
              <div className="flex gap-3 overflow-x-auto pb-1">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-20 w-28 shrink-0 rounded-lg bg-white border border-[#e0dbd3] animate-pulse" />
                ))}
              </div>

              {/* Specs placeholder */}
              <div className="rounded-xl border border-[#e0dbd3] bg-white p-6 animate-pulse">
                <div className="mb-5 h-5 w-48 rounded bg-[#f0ece5]" />
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between py-3 border-b border-[#f0ece5] last:border-0">
                      <div className="h-4 w-32 rounded bg-[#f0ece5]" />
                      <div className="h-4 w-24 rounded bg-[#f4f1ed]" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Description placeholder */}
              <div className="rounded-xl border border-[#e0dbd3] bg-white p-6 animate-pulse">
                <div className="mb-4 h-5 w-40 rounded bg-[#f0ece5]" />
                <div className="space-y-2">
                  <div className="h-4 w-full rounded bg-[#f4f1ed]" />
                  <div className="h-4 w-full rounded bg-[#f4f1ed]" />
                  <div className="h-4 w-3/4 rounded bg-[#f4f1ed]" />
                </div>
              </div>
            </div>

            {/* RIGHT — Booking panel (sticky) */}
            <div className="lg:sticky lg:top-24">
              <div className="overflow-hidden rounded-2xl border border-[#e0dbd3] bg-white shadow-sm animate-pulse">
                {/* Header placeholder */}
                <div className="border-b border-[#f0ece5] p-6 space-y-3">
                  <div className="h-3 w-20 rounded bg-[#f0ece5]" />
                  <div className="h-8 w-64 rounded bg-[#f0ece5]" />
                  <div className="h-4 w-48 rounded bg-[#f4f1ed]" />
                  
                  <div className="mt-3 flex items-center gap-1.5 border-t border-[#f0ece5] pt-3">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} size={14} className="text-[#e0dbd3]" />
                      ))}
                    </div>
                    <div className="h-4 w-24 rounded bg-[#f4f1ed]" />
                  </div>
                </div>

                {/* Price placeholder */}
                <div className="flex items-center justify-between border-b border-[#f0ece5] px-6 py-4">
                  <div className="h-9 w-24 rounded bg-[#f0ece5]" />
                  <div className="space-y-1 text-right">
                    <div className="h-2 w-16 rounded bg-[#f4f1ed] ml-auto" />
                    <div className="h-4 w-20 rounded bg-[#f0ece5] ml-auto" />
                  </div>
                </div>

                {/* Status + CTA placeholder */}
                <div className="space-y-6 px-6 py-5">
                  <div className="flex items-center justify-between">
                    <div className="h-4 w-12 rounded bg-[#f4f1ed]" />
                    <div className="h-6 w-24 rounded-full bg-[#f0ece5]" />
                  </div>
                  
                  <div className="h-12 w-full rounded-[8px] bg-[#f0ece5]" />
                  
                  <div className="space-y-2 border-t border-[#f0ece5] pt-5">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-3 w-full rounded bg-[#f4f1ed]" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
