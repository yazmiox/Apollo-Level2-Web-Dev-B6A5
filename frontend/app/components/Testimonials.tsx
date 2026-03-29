import { getTestimonials } from "@/app/actions/equipment";

const demoTestimonials = [
  {
    quote: "EquipFlow replaced the whiteboard booking system we'd run for six years. Deposits are tracked, nothing gets double-booked, and the admin dashboard actually tells us where everything is.",
    name: "Marcus R.",
    title: "Equipment Coordinator — Film Production Lab",
    initials: "MR",
    rating: 5,
  },
  {
    quote: "We run a boutique creative studio and EquipFlow gave us the operational backbone we didn't know we needed. The Stripe integration alone saved us hours of manual invoicing.",
    name: "Priya N.",
    title: "Studio Manager — Lightframe Creative",
    initials: "PN",
    rating: 5,
  },
  {
    quote: "Finally a tool that treats expensive shared gear with the seriousness it deserves. The booking flow is clean, the admin panel is solid, and our team actually uses it.",
    name: "Jordan T.",
    title: "AV Director — Independent Broadcasting Co.",
    initials: "JT",
    rating: 5,
  },
];

export default async function Testimonials() {
  const reviewsData = await getTestimonials();

  const testimonials = reviewsData.length > 0 ? reviewsData.map((r: any) => ({
    quote: r.comment || "Excellent equipment and smooth booking process. Highly recommended for any creative professional needing reliable gear.",
    name: r.user.name,
    title: "Verified Renter",
    initials: r.user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2),
    rating: r.rating
  })) : demoTestimonials;

  return (
    <section className="bg-[#1a1a1a] py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mb-14">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.15em] text-[#e8612e]">Trusted By</p>
          <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            What our users say
          </h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t: any) => (
            <div
              key={t.name}
              className="flex flex-col rounded-xl border border-white/5 bg-[#111] p-7 hover:border-white/10 transition-colors"
            >
              <div className="mb-5 flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={`${i < t.rating ? "text-[#e8612e]" : "text-white/10"} text-sm`}>★</span>
                ))}
              </div>

              <p className="mb-7 flex-1 text-sm leading-[1.8] text-white/50">{t.quote}</p>

              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e8612e]/15 text-xs font-bold text-[#e8612e]">
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{t.name}</p>
                  <p className="text-xs text-white/35">{t.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
