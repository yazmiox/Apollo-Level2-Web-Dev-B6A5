import { getSession } from "@/app/lib/auth-server";
import { ArrowLeft, Package, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getEquipmentBySlug } from "../../actions/equipment";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import RequestBookingButton from "../_components/RequestBookingButton";

interface Props {
  params: Promise<{ slug: string }>;
}

const STATUS_STYLES: Record<string, { badge: string; dot: string; label: string }> = {
  AVAILABLE: { badge: "bg-green-500/10 text-green-600 border border-green-500/20", dot: "bg-green-500", label: "Available" },
  BOOKED: { badge: "bg-amber-500/10 text-amber-600 border border-amber-500/20", dot: "bg-amber-500", label: "Currently Booked" },
  MAINTENANCE: { badge: "bg-slate-400/10 text-slate-500 border border-slate-400/20", dot: "bg-slate-400", label: "Under Maintenance" },
  DAMAGED: { badge: "bg-red-500/10 text-red-500 border border-red-500/20", dot: "bg-red-500", label: "Damaged" },
};

const CONDITION_LABELS: Record<string, string> = {
  NEW: "New", LIKE_NEW: "Like New", GOOD: "Good", FAIR: "Fair", POOR: "Poor",
};

export default async function EquipmentDetailPage({ params }: Props) {
  const session = await getSession();
  const { slug } = await params;
  const response = await getEquipmentBySlug(slug);

  if (!response?.success) notFound();

  const equipment = response.data;

  const item = {
    ...equipment,
    category: equipment.category?.name || "Equipment",
    longDescription: equipment.description,
    specs: equipment.specifications || {},
    included: equipment.includedItems || [],
    model: equipment.modelName,
  };

  const related = (equipment.related || []).map((e: any) => ({
    ...e,
    category: e.category?.name || "Equipment",
  }));

  const st = STATUS_STYLES[item.status] ?? STATUS_STYLES.MAINTENANCE;
  const canBook = item.status === "AVAILABLE";

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#f4f1ed] pt-16">
        <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8">

          {/* ── Back Button ── */}
          <div className="mb-6">
            <Link href="/equipment" className="inline-flex items-center gap-1.5 text-sm font-medium text-[#777] hover:text-[#e8612e] transition-colors">
              <ArrowLeft size={16} />
              Back to Equipment
            </Link>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1fr_380px] lg:items-start">
            {/* LEFT — Image + Specs */}
            <div className="space-y-6">

              {/* Main photo display */}
              <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-[#e0dbd3] bg-white group cursor-zoom-in">
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  className="object-cover transition-opacity duration-300"
                  priority
                />
                <span className={`absolute top-4 right-4 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold backdrop-blur-sm ${st.badge}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${st.dot}`} />
                  {st.label}
                </span>
              </div>

              {/* Specs */}
              {item.specs && Object.keys(item.specs).length > 0 && (
                <div className="rounded-xl border border-[#e0dbd3] bg-white p-6">
                  <h2 className="mb-5 text-base font-bold text-[#111]" style={{ fontFamily: "var(--font-display)" }}>
                    Technical Specifications
                  </h2>
                  <dl className="grid gap-0 divide-y divide-[#f0ece5]">
                    {Object.entries(item.specs).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between py-3">
                        <dt className="text-sm text-[#888]">{key}</dt>
                        <dd className="text-sm font-semibold text-[#111]">{String(value)}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}

              {/* Description */}
              <div className="rounded-xl border border-[#e0dbd3] bg-white p-6">
                <h2 className="mb-4 text-base font-bold text-[#111]" style={{ fontFamily: "var(--font-display)" }}>
                  About this item
                </h2>
                <p className="text-sm leading-[1.85] text-[#666]">{item.longDescription}</p>
              </div>

              {/* What&apos;s Included */}
              {item.included && item.included.length > 0 && (
                <div className="rounded-xl border border-[#e0dbd3] bg-white p-6">
                  <h2 className="mb-4 text-base font-bold text-[#111]" style={{ fontFamily: "var(--font-display)" }}>
                    What&apos;s included
                  </h2>
                  <ul className="grid gap-2 sm:grid-cols-2">
                    {item.included.map((inc: string) => (
                      <li key={inc} className="flex items-center gap-2.5 text-sm text-[#555]">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-500/10 text-green-600 text-[10px] font-bold">✓</span>
                        {inc}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* RIGHT — Booking panel (sticky) */}
            <div className="lg:sticky lg:top-24">
              <div className="overflow-hidden rounded-2xl border border-[#e0dbd3] bg-white shadow-sm">
                {/* Header */}
                <div className="border-b border-[#f0ece5] p-6">
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-[#aaa]">{item.category}</p>
                  <h1 className="text-2xl font-extrabold leading-tight text-[#111]" style={{ fontFamily: "var(--font-display)" }}>
                    {item.name}
                  </h1>
                  {item.brand && <p className="mt-1 text-sm text-[#888]">by {item.brand} · {item.model}</p>}

                  <div className="mt-3 flex items-center gap-1.5 border-t border-[#f0ece5] pt-3">
                    <div className="flex items-center text-[#e8612e]">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={14}
                          className={star <= Math.round(item.rating || 0) ? "fill-current" : "text-[#e0dbd3]"}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-semibold text-[#111]">{(item.rating || 0).toFixed(1)} Rating</span>
                    <span className="text-[10px] text-[#aaa]">({item.reviewCount || 0} reviews)</span>
                  </div>
                </div>

                {/* Price + condition */}
                <div className="flex items-center justify-between border-b border-[#f0ece5] px-6 py-4">
                  <div>
                    <span className="text-3xl font-extrabold text-[#111]" style={{ fontFamily: "var(--font-display)" }}>
                      ${item.rentalRate}
                    </span>
                    <span className="ml-1 text-sm text-[#aaa]">/day</span>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-widest text-[#bbb]">Condition</p>
                    <p className="mt-0.5 text-sm font-semibold text-[#555]">{CONDITION_LABELS[item.condition] ?? item.condition}</p>
                  </div>
                </div>

                {/* Status + location */}
                <div className="space-y-3 px-6 py-5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#888]">Status</span>
                    <span className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${st.badge}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${st.dot}`} />
                      {st.label}
                    </span>
                  </div>
                  {item.location && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#888]">Pickup location</span>
                      <span className="text-sm font-medium text-[#444]">{item.location}</span>
                    </div>
                  )}
                </div>

                {/* CTA */}
                <div className="px-6 pb-6">
                  {session ?
                    (canBook ? (
                      <>
                        <RequestBookingButton item={item} />
                        <p className="mt-3 text-center text-xs text-[#bbb]">
                          You won&apos;t be charged yet — admin approval required.
                        </p>
                      </>
                    ) : (
                      <div className="rounded-[8px] bg-[#f4f1ed] py-3.5 text-center">
                        <p className="text-sm font-semibold text-[#999]">Currently unavailable</p>
                        <p className="mt-1 text-xs text-[#bbb]">{st.label} — check back soon</p>
                      </div>
                    )) :
                    <div className="rounded-xl border border-[#e0dbd3] bg-[#f9f8f6] p-6 text-center">
                      <p className="text-sm font-medium text-[#777]">
                        Please <Link href="/login" className="font-bold text-[#111] hover:text-[#e8612e] border-b border-[#e0dbd3] hover:border-[#e8612e] transition-all">sign in</Link> to check availability and request a booking for this equipment.
                      </p>
                    </div>




                  }

                  {/* Trust signals */}
                  <div className="mt-5 space-y-2 border-t border-[#f0ece5] pt-5">
                    {[
                      "Deposit held via Stripe — fully refundable",
                      "Admin approves all booking requests",
                      "Return verified before deposit release",
                    ].map((t) => (
                      <p key={t} className="flex items-start gap-2 text-xs text-[#999]">
                        <span className="mt-0.5 text-green-500 shrink-0">✓</span>
                        {t}
                      </p>
                    ))}
                  </div>
                </div>
              </div>

              {/* Vendor Profile Card */}
              {equipment.vendor && (
                <div className="mt-6 rounded-2xl border border-[#e0dbd3] bg-white p-6 shadow-sm">
                  <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-[#aaa]">Listed by</h3>
                  <div className="flex items-center gap-4">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-[#f9f8f6] border border-[#f0ece5]">
                      {equipment.vendor.image ? (
                        <Image src={equipment.vendor.image} alt={equipment.vendor.name} fill className="object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xl font-bold text-[#e8612e]">
                          {equipment.vendor.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-[#111] truncate">{equipment.vendor.name}</p>
                      <div className="mt-1 flex items-center gap-3 text-xs text-[#888]">
                        <span className="flex items-center gap-1 font-bold text-amber-500">
                          <Star size={12} className="fill-current" />
                          {equipment.vendor.avgRating?.toFixed(1) || "5.0"}
                        </span>
                        <span className="flex items-center gap-1">
                          <Package size={12} />
                          {equipment.vendor.listingsCount || 1} Listings
                        </span>
                      </div>
                    </div>
                  </div>
                  <Link
                    href={`/vendors/${equipment.vendor.id}`}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-[#e0dbd3] bg-[#fdfdfc] py-2.5 text-xs font-bold text-[#111] transition-all hover:bg-[#f9f8f6] hover:border-[#aaa]"
                  >
                    View Storefront
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* ── Related Equipment ── */}
          {related.length > 0 && (
            <section className="mt-16">
              <h2 className="mb-6 text-2xl font-extrabold text-[#111]" style={{ fontFamily: "var(--font-display)" }}>
                More in {item.category}
              </h2>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((rel) => {
                  const rst = STATUS_STYLES[rel.status] ?? STATUS_STYLES.MAINTENANCE;
                  return (
                    <Link
                      key={rel.id}
                      href={`/equipment/${rel.slug}`}
                      className="group flex overflow-hidden rounded-xl border border-[#e0dbd3] bg-white hover:border-[#e8612e]/30 hover:shadow-md transition-all"
                    >
                      <div className="relative h-24 w-28 shrink-0 overflow-hidden bg-[#f4f1ed]">
                        <Image src={rel.imageUrl} alt={rel.name} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
                      </div>
                      <div className="flex flex-1 flex-col justify-center p-4">
                        <p className="mb-0.5 text-[10px] font-bold uppercase tracking-widest text-[#ccc]">{rel.category}</p>
                        <p className="line-clamp-1 text-sm font-bold text-[#111] group-hover:text-[#e8612e] transition-colors" style={{ fontFamily: "var(--font-display)" }}>{rel.name}</p>
                        <div className="mt-1.5 flex items-center justify-between">
                          <span className="text-sm font-bold text-[#111]">${rel.rentalRate}<span className="text-xs font-normal text-[#bbb]">/day</span></span>
                          <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${rst.badge}`}>
                            <span className={`h-1 w-1 rounded-full ${rst.dot}`} />
                            {rst.label}
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          {/* ── Reviews Section ── */}
          <section className="mt-16 pb-12">
            <h3 className="mb-6 text-xl font-extrabold text-[#111]" style={{ fontFamily: "var(--font-display)" }}>
              Equipment Reviews ({item.reviewCount || 0})
            </h3>

            {item.reviews && item.reviews.length > 0 ? (
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-2">
                {item.reviews.map((rev: any) => (
                  <div key={rev.id} className="rounded-xl border border-[#e0dbd3] bg-white p-5 shadow-sm">
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f4f1ed] text-xs font-bold text-[#e8612e]">
                          {rev.user?.name ? rev.user.name.charAt(0).toUpperCase() : "U"}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#111]">{rev.user?.name || "Member"}</p>
                          <div className="flex items-center text-[#e8612e]">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                size={12}
                                className={star <= rev.rating ? "fill-current" : "text-[#e0dbd3]"}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] text-[#aaa]">
                        {new Date(rev.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed text-[#666]">
                      {rev.comment || "No feedback shared."}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-[#e0dbd3] py-12 text-center bg-gray-50/50">
                <p className="text-xs font-medium text-[#aaa]">No reviews yet. Be the first to rent and review!</p>
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
