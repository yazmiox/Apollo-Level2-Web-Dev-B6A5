import Link from "next/link";
import { getAllEquipments } from "../actions/equipment";
import Image from "next/image";

const STATUS_STYLES: Record<string, { badge: string; dot: string; label: string }> = {
    AVAILABLE: { badge: "bg-green-500/10 text-green-400 border border-green-500/20", dot: "bg-green-400", label: "Available" },
    BOOKED: { badge: "bg-amber-500/10 text-amber-400 border border-amber-500/20", dot: "bg-amber-400", label: "Booked" },
    MAINTENANCE: { badge: "bg-slate-500/10 text-slate-400 border border-slate-500/20", dot: "bg-slate-400", label: "Maintenance" },
    DAMAGED: { badge: "bg-red-500/10 text-red-400 border border-red-500/20", dot: "bg-red-400", label: "Damaged" },
};

export default async function FeaturedEquipments() {
    const equipmentRes = await getAllEquipments({ isFeatured: true });
    const featuredEquipment = equipmentRes.success ? equipmentRes.data : [];
    return (
        <section className="bg-[#111] py-24 lg:py-32">
            <div className="mx-auto max-w-7xl px-5 lg:px-8">
                <div className="mb-12 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="mb-3 text-xs font-bold uppercase tracking-[0.15em] text-[#e8612e]">Available Now</p>
                        <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
                            Featured equipment
                        </h2>
                    </div>
                    <Link
                        href="/equipment"
                        className="shrink-0 inline-flex items-center gap-2 rounded-[7px] border border-white/10 px-5 py-2.5 text-sm font-semibold text-white/60 hover:border-white/30 hover:text-white"
                    >
                        View all
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M1 7h12M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </Link>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {featuredEquipment.length === 0 ? (
                        <div className="col-span-full rounded-2xl border border-white/5 bg-[#1a1a1a] p-12 text-center">
                            <p className="text-white/30 text-sm font-medium">No featured equipment available at the moment.</p>
                        </div>
                    ) : (
                        featuredEquipment.map((item: any) => {
                            const st = STATUS_STYLES[item.status];
                            return (
                                <Link
                                    key={item.id}
                                    href={`/equipment/${item.slug}`}
                                    className="group block overflow-hidden rounded-xl border border-white/5 bg-[#1a1a1a] hover:border-[#e8612e]/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/40"
                                >
                                    {/* Photo */}
                                    <div className="relative h-48 overflow-hidden">
                                        <Image
                                            src={item.imageUrl}
                                            alt={item.name}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                            sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                        <span className={`absolute top-3 right-3 flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${st.badge}`}>
                                            <span className={`h-1.5 w-1.5 rounded-full ${st.dot}`} />
                                            {st.label}
                                        </span>
                                    </div>

                                    {/* Body */}
                                    <div className="p-5">
                                        <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-[#666]">{item.category.name}</p>
                                        <h3
                                            className="mb-2 text-base font-bold text-white transition-colors group-hover:text-[#e8612e]"
                                            style={{ fontFamily: "var(--font-display)" }}
                                        >
                                            {item.name}
                                        </h3>
                                        <p className="mb-4 text-sm leading-relaxed text-white/40 line-clamp-2">{item.description}</p>

                                        <div className="flex items-center justify-between border-t border-white/5 pt-4">
                                            <span className="text-lg font-bold text-white" style={{ fontFamily: "var(--font-display)" }}>
                                                ${Number(item.rentalRate).toFixed(0)}
                                                <span className="text-xs font-normal text-white/35"> /day</span>
                                            </span>
                                            <span className="rounded-md bg-white/5 px-2.5 py-1 text-xs text-white/40 capitalize">
                                                {item.condition.toLowerCase().replace('_', ' ')}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })
                    )}
                </div>
            </div>
        </section>
    );
}