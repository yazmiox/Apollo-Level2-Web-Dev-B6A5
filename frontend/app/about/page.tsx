import type { Metadata } from "next";
import Link from "next/link";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

export const metadata: Metadata = {
  title: "About | EquipFlow",
  description:
    "Learn how EquipFlow helps shared equipment spaces manage bookings, deposits, approvals, and returns with full accountability.",
};

const pillars = [
  {
    title: "Operational Clarity",
    description:
      "From first request to final return, every booking step is visible to both admins and users with live status tracking.",
  },
  {
    title: "Financial Accountability",
    description:
      "Stripe-powered checkout and deposit records keep payment activity tied directly to each booking and user action.",
  },
  {
    title: "Asset Responsibility",
    description:
      "Maintenance logs, damage reports, and return verification create a dependable audit trail for every piece of gear.",
  },
];

const audiences = [
  "Media Labs",
  "Film Schools",
  "Photography Studios",
  "Makerspaces",
  "Workshop Facilities",
  "University Clubs",
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="relative overflow-hidden bg-[#111] px-5 py-24 lg:px-8 lg:py-28">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 20%, #e8612e 0%, transparent 45%)",
            }}
          />
          <div className="relative mx-auto max-w-5xl">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#e8612e]">
              About EquipFlow
            </p>
            <h1
              className="mt-4 max-w-3xl text-4xl font-extrabold tracking-tight text-white sm:text-5xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Built to keep shared equipment reliable, traceable, and easy to manage.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">
              EquipFlow is an equipment operations platform for teams that share valuable gear.
              We combine booking workflows, payment accountability, and return controls so
              organizations can run equipment rooms with confidence.
            </p>
          </div>
        </section>

        <section className="bg-[#f4f1ed] px-5 py-20 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 max-w-2xl">
              <h2
                className="text-3xl font-extrabold tracking-tight text-[#111] sm:text-4xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                What we focus on
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-[#666] sm:text-base">
                EquipFlow is designed around practical day-to-day operations, not just catalog
                browsing. Every feature supports trust, speed, and accountability.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {pillars.map((pillar) => (
                <article
                  key={pillar.title}
                  className="rounded-xl border border-[#e0dbd3] bg-white p-6 shadow-sm"
                >
                  <h3
                    className="text-lg font-bold text-[#111]"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {pillar.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#666]">{pillar.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white px-5 py-20 lg:px-8">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2 lg:gap-14">
            <div>
              <h2
                className="text-3xl font-extrabold tracking-tight text-[#111] sm:text-4xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Who EquipFlow serves
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-[#666] sm:text-base">
                If your organization shares cameras, lighting, audio, lab devices, or specialized
                tools, EquipFlow helps your team stay organized without adding overhead.
              </p>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {audiences.map((group) => (
                  <li
                    key={group}
                    className="rounded-lg border border-[#ece7de] bg-[#f9f7f3] px-4 py-3 text-sm font-medium text-[#444]"
                  >
                    {group}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-[#ece7de] bg-[#f9f7f3] p-8">
              <h3
                className="text-2xl font-bold text-[#111]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Our commitment
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-[#666] sm:text-base">
                We are committed to helping teams reduce conflicts, protect shared assets, and
                improve operational visibility. EquipFlow is continuously refined with real-world
                booking and admin workflows in mind.
              </p>
              <div className="mt-8">
                <Link
                  href="/equipment"
                  className="inline-flex rounded-[7px] bg-[#e8612e] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#f07248]"
                >
                  Explore Equipment
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
