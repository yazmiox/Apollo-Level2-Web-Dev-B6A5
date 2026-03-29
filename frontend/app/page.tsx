import Link from "next/link";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";

const howItWorksSteps = [
  { number: "01", icon: "🔍", title: "Browse the Catalog", description: "Explore available equipment filtered by category, condition, and availability. See real-time status on every item." },
  { number: "02", icon: "📅", title: "Request a Booking", description: "Choose your dates and submit a request. Our system auto-blocks conflicting reservations — no double bookings." },
  { number: "03", icon: "💳", title: "Pay Securely", description: "Complete a Stripe-powered payment for the booking fee or refundable deposit to lock in your reservation." },
  { number: "04", icon: "✅", title: "Pick Up & Return", description: "Admin approves your request, you collect the gear, and return it on time. The loop is closed and logged." },
];

const benefits = [
  { icon: "🚫", title: "Zero Double Bookings", description: "Automatic conflict detection prevents two people from ever reserving the same item for overlapping dates." },
  { icon: "💰", title: "Deposit Accountability", description: "Every payment is tied to a booking via Stripe. Deposits are tracked, recorded, and visible to both admins and users." },
  { icon: "🔧", title: "Maintenance Logs", description: "Admins log every maintenance event and damage report. Equipment has a full auditable history from day one." },
  { icon: "👁️", title: "Admin Oversight", description: "Approve bookings, manage inventory, record damage reports, and monitor activity from a single dashboard." },
  { icon: "📦", title: "Return Verification", description: "Admins mark returns after inspection — closing the booking loop with a timestamped record." },
  { icon: "⚡", title: "Live Availability", description: "Equipment status updates in real time. Users always see accurate availability before requesting a booking." },
];

const spaceTypes = [
  "Media Labs", "Creative Studios", "Film Schools",
  "Workshop Spaces", "Makerspaces", "Campus Clubs",
  "Broadcast Studios", "Photography Labs",
];

export default async function HomePage() {
  return (
    <>
      <Navbar />

      <main>
        {/* ── Section 1: Hero Section ── */}
        <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#111] py-20 px-4">

          {/* Subtle noise grain */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            }}
          />

          {/* Epic center glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 h-[800px] w-[1200px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-25 blur-[120px]"
            style={{ background: "radial-gradient(circle, #e8612e 0%, transparent 70%)" }}
          />

          {/* ── Centered copy ── */}
          <div className="relative mx-auto w-full max-w-5xl px-5 text-center lg:px-8">

            <div className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#e8612e]" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/60">
                Shared Equipment Management
              </span>
            </div>

            <h1
              className="animate-fade-up delay-100 mt-7 text-5xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-[5.5rem]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Every piece of gear.
              <br />
              <span className="text-[#e8612e]">Fully tracked.</span>
            </h1>

            <p className="animate-fade-up delay-200 mx-auto mt-7 max-w-2xl text-base leading-[1.8] text-white/45 sm:text-lg">
              EquipFlow brings order to shared equipment rooms — booking requests, Stripe-powered deposits, admin approvals, and return tracking, all in one place. Built for any space that shares valuable gear.
            </p>

            <div className="animate-fade-up delay-300 mt-9 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/equipment"
                className="group inline-flex items-center gap-2.5 rounded-[7px] bg-[#e8612e] px-7 py-3.5 text-sm font-semibold text-white hover:bg-[#f07248] active:scale-[0.97] transition-all"
              >
                Browse Equipment
                <svg className="transition-transform group-hover:translate-x-1" width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M1 7h12M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-[7px] border border-white/10 px-7 py-3.5 text-sm font-semibold text-white/60 hover:border-white/25 hover:text-white transition-all"
              >
                Get Started Free
              </Link>
            </div>

            {/* Trust row */}
            <div className="animate-fade-up delay-400 mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-white/30">
              <span className="flex items-center gap-1.5"><span className="text-green-400">✓</span> Stripe secured payments</span>
              <span className="flex items-center gap-1.5"><span className="text-green-400">✓</span> No double bookings</span>
              <span className="flex items-center gap-1.5"><span className="text-green-400">✓</span> Full audit trail</span>
            </div>
          </div>
        </section>

        {/* ── Section 2: Space Types Marquee ── */}
        <section className="bg-[#f4f1ed] py-8 overflow-hidden border-b border-[#e0dbd3]">
          <p className="mb-4 text-center text-xs font-semibold uppercase tracking-widest text-[#999]">
            Built for any shared equipment space
          </p>
          <div className="flex flex-wrap justify-center gap-2 px-5">
            {spaceTypes.map((s) => (
              <span
                key={s}
                className="rounded-full border border-[#d8d3ca] bg-white px-4 py-1.5 text-sm font-medium text-[#555]"
              >
                {s}
              </span>
            ))}
          </div>
        </section>

        {/* ── Section 3: How It Works ── */}
        <section id="how-it-works" className="bg-[#f4f1ed] py-24 lg:py-32">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="mb-16 max-w-xl">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.15em] text-[#e8612e]">Workflow</p>
              <h2 className="text-4xl font-extrabold tracking-tight text-[#111] sm:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
                How EquipFlow works
              </h2>
              <p className="mt-4 text-base text-[#777] leading-relaxed">
                A simple four-step flow that keeps your equipment room accountable from first request to final return.
              </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {howItWorksSteps.map((step, i) => (
                <div key={step.number} className="group relative">
                  {/* Connector line (desktop) */}
                  {i < howItWorksSteps.length - 1 && (
                    <div className="absolute top-8 left-[calc(100%-0px)] hidden w-8 border-t border-dashed border-[#d0ccc5] lg:block" />
                  )}

                  <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-[#e0dbd3] bg-white text-2xl shadow-sm">
                    {step.icon}
                  </div>

                  <p
                    className="mb-2 text-xs font-bold tracking-widest text-[#d0ccc5]"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {step.number}
                  </p>
                  <h3 className="mb-2 text-lg font-bold text-[#111]" style={{ fontFamily: "var(--font-display)" }}>
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[#777]">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Section 5: Benefits ── */}
        <section id="benefits" className="bg-[#f4f1ed] py-24 lg:py-32">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="mb-16 max-w-2xl">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.15em] text-[#e8612e]">Why EquipFlow</p>
              <h2 className="text-4xl font-extrabold tracking-tight text-[#111] sm:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
                Built for accountability,<br /> not just availability
              </h2>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {benefits.map((b) => (
                <div
                  key={b.title}
                  className="group rounded-xl border border-[#e0dbd3] bg-white p-6 hover:border-[#e8612e]/30 hover:shadow-md transition-all duration-300"
                >
                  <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#f4f1ed] text-xl group-hover:bg-[#e8612e]/10 transition-colors">
                    {b.icon}
                  </div>
                  <h3 className="mb-2 text-base font-bold text-[#111]" style={{ fontFamily: "var(--font-display)" }}>{b.title}</h3>
                  <p className="text-sm leading-relaxed text-[#777]">{b.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Section 7: CTA ── */}
        <section className="relative overflow-hidden bg-[#e8612e] py-24 lg:py-32">
          {/* Texture */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-10"
            style={{
              backgroundImage: "radial-gradient(circle at 80% 20%, #fff 0%, transparent 60%)",
            }}
          />

          <div className="relative mx-auto max-w-4xl px-5 text-center lg:px-8">
            <h2
              className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Ready to bring order
              <br />
              to your equipment room?
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-white/70">
              Set up your space on EquipFlow today. Track every booking, deposit, and return from a single dashboard.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/register"
                className="rounded-[7px] bg-white px-8 py-3.5 text-sm font-bold text-[#e8612e] hover:bg-[#f4f1ed] active:scale-[0.98] transition-all"
              >
                Create Free Account
              </Link>
              <Link
                href="/equipment"
                className="rounded-[7px] border border-white/25 px-8 py-3.5 text-sm font-semibold text-white hover:border-white/50 hover:bg-white/5 transition-all"
              >
                Browse Equipment
              </Link>
            </div>
            <p className="mt-6 text-xs text-white/40">No credit card required to get started.</p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
