import { getAllEquipments } from "@/app/actions/equipment";
import { MapPin, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Pagination from "./Pagination";

const STATUS_STYLES: Record<string, { badge: string; dot: string; label: string }> = {
    AVAILABLE: { badge: "bg-green-500/10 text-green-600 border border-green-500/20", dot: "bg-green-500", label: "Available" },
    BOOKED: { badge: "bg-amber-500/10 text-amber-600 border border-amber-500/20", dot: "bg-amber-500", label: "Booked" },
    MAINTENANCE: { badge: "bg-slate-500/10 text-slate-500 border border-slate-500/20", dot: "bg-slate-400", label: "Maintenance" },
    DAMAGED: { badge: "bg-red-500/10 text-red-500 border border-red-500/20", dot: "bg-red-500", label: "Damaged" },
};

const CONDITION_LABELS: Record<string, string> = {
    NEW: "New", LIKE_NEW: "Like New", GOOD: "Good", FAIR: "Fair", POOR: "Poor"
};

export default async function EquipmentList({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
    const params = {
        q: searchParams.q as string | undefined,
        category: searchParams.category as string | undefined,
        status: searchParams.status as string | undefined,
        sort: searchParams.sort as string | undefined,
        page: searchParams.page ? Number(searchParams.page) : 1,
        limit: 9,
    };
    const { data: equipments, metadata } = await getAllEquipments(params);
    return <main className="min-h-screen bg-stone py-10">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">

            {/* Result count */}
            <p className="mb-6 text-sm text-[#888]">
                Showing <span className="font-semibold text-[#111]">{equipments.length}</span> of <span className="font-semibold text-[#111]">{metadata.total}</span> results
            </p>

            {/* Empty state */}
            {equipments.length === 0 && (
                <div className="flex flex-col items-center justify-center py-24 text-center text-stone-dark">
                    <div className="mb-4 text-5xl opacity-50"><Search size={48} /></div>
                    <h3 className="mb-2 text-xl font-bold text-[#111]" style={{ fontFamily: "var(--font-display)" }}>
                        No equipment found
                    </h3>
                    <p className="mb-6 text-sm text-[#888]">Try adjusting your search or filters.</p>
                    <Link
                        href="/equipment"
                        className="rounded-[7px] border border-[#e0dbd3] bg-white px-5 py-2.5 text-sm font-semibold text-[#555] hover:border-[#e8612e] hover:text-[#e8612e] transition-all"
                    >
                        Clear all filters
                    </Link>
                </div>
            )}

            {/* Grid */}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {equipments.map((item: any) => {
                    const st = STATUS_STYLES[item.status] ?? STATUS_STYLES.MAINTENANCE;
                    const canBook = item.status === "AVAILABLE";
                    return (
                        <div
                            key={item.id}
                            className="group flex flex-col overflow-hidden rounded-xl border border-[#e0dbd3] bg-white hover:border-orange/30 hover:shadow-lg transition-all duration-300"
                        >
                            {/* Photo */}
                            <Link href={`/equipment/${item.slug}`} className="relative block h-52 overflow-hidden bg-stone">
                                <Image
                                    src={item.imageUrl}
                                    alt={item.name}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    sizes="(max-width:640px) 100vw, (max-width:1280px) 50vw, 33vw"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

                                {/* Status badge */}
                                <span className={`absolute top-3 right-3 flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold backdrop-blur-sm ${st.badge}`}>
                                    <span className={`h-1.5 w-1.5 rounded-full ${st.dot}`} />
                                    {st.label}
                                </span>
                            </Link>

                            {/* Body */}
                            <div className="flex flex-1 flex-col p-5">
                                <div className="mb-1 flex items-center justify-between text-stone-dark">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#aaa]">{item.category?.name}</span>
                                    {item.brand && (
                                        <span className="rounded bg-stone px-2 py-0.5 text-[10px] font-medium text-[#888]">{item.brand}</span>
                                    )}
                                </div>

                                <Link href={`/equipment/${item.slug}`}>
                                    <h2
                                        className="mb-2 text-base font-bold text-[#111] hover:text-[#e8612e] transition-colors"
                                        style={{ fontFamily: "var(--font-display)" }}
                                    >
                                        {item.name}
                                    </h2>
                                </Link>

                                <p className="mb-4 flex-1 text-sm leading-relaxed text-[#777] line-clamp-2">
                                    {item.description}
                                </p>

                                {/* Meta row */}
                                <div className="mb-4 flex flex-wrap items-center gap-3 text-xs text-[#999]">
                                    {item.location && (
                                        <span className="flex items-center gap-1">
                                            <MapPin size={12} />
                                            {item.location}
                                        </span>
                                    )}
                                    <span>{CONDITION_LABELS[item.condition] ?? item.condition}</span>
                                </div>

                                {/* Price + CTA */}
                                <div className="flex items-center justify-between border-t border-[#f0ece5] pt-4">
                                    <div>
                                        <span className="text-xl font-extrabold text-[#111]" style={{ fontFamily: "var(--font-display)" }}>
                                            ${item.rentalRate}
                                        </span>
                                        <span className="text-xs text-[#aaa]"> /day</span>
                                    </div>

                                    {canBook ? (
                                        <Link
                                            href={`/equipment/${item.slug}`}
                                            className="rounded-[7px] bg-orange px-4 py-2 text-xs font-bold text-white hover:bg-[#f07248] active:scale-95 transition-all"
                                        >
                                            Book Now
                                        </Link>
                                    ) : (
                                        <span className="rounded-[7px] border border-[#e0dbd3] px-4 py-2 text-xs font-medium text-[#bbb]">
                                            Unavailable
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <Pagination totalPages={metadata.totalPages} currentPage={metadata.page} />
        </div>
    </main>

}