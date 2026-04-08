import type { Metadata } from "next";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

export const metadata: Metadata = {
  title: "Privacy | EquipFlow",
  description:
    "Read EquipFlow's privacy practices for account data, booking activity, payment handling, and security.",
};

const sections = [
  {
    title: "Information We Collect",
    points: [
      "Account details such as name, email, and role within your workspace.",
      "Booking and equipment activity including requests, approvals, pickups, returns, and maintenance records.",
      "Transaction metadata for payments and deposits processed through Stripe.",
      "Technical data such as device, browser, IP address, and logs used for security and reliability.",
    ],
  },
  {
    title: "How We Use Information",
    points: [
      "Operate and improve booking, approval, payment, and return workflows.",
      "Prevent booking conflicts, detect misuse, and maintain platform integrity.",
      "Provide support, incident response, and communication related to your account.",
      "Meet legal, accounting, and compliance obligations where required.",
    ],
  },
  {
    title: "Payments and Third-Party Processing",
    points: [
      "Card and payment details are processed by Stripe. EquipFlow does not store full payment card numbers.",
      "We retain only payment records required for reconciliation, reporting, and support.",
      "Third-party services are used under contractual and security controls appropriate for operational needs.",
    ],
  },
  {
    title: "Data Retention",
    points: [
      "Account and booking data are retained while your workspace remains active.",
      "Certain records may be retained longer when necessary for audit, dispute resolution, or legal requirements.",
      "When deletion is requested and permitted, data is removed or anonymized according to our retention process.",
    ],
  },
  {
    title: "Your Rights and Choices",
    points: [
      "You may request access, correction, or deletion of personal information, subject to applicable law.",
      "Workspace administrators may manage user accounts and operational records within their organization.",
      "You can contact us anytime to ask privacy-related questions or submit a data request.",
    ],
  },
  {
    title: "Security Practices",
    points: [
      "We apply technical and organizational safeguards to protect data from unauthorized access and misuse.",
      "Access to operational data is restricted based on role and business need.",
      "Security controls and monitoring are reviewed regularly to keep pace with platform growth and risk.",
    ],
  },
];

export default function PrivacyPage() {
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
                "radial-gradient(circle at 30% 30%, #e8612e 0%, transparent 48%)",
            }}
          />
          <div className="relative mx-auto max-w-5xl">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#e8612e]">
              Privacy Policy
            </p>
            <h1
              className="mt-4 max-w-3xl text-4xl font-extrabold tracking-tight text-white sm:text-5xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              We treat equipment data and user data with the same seriousness.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">
              This page explains how EquipFlow collects, uses, and protects information in the
              course of running shared equipment operations.
            </p>
            <p className="mt-4 text-xs text-white/50">Last updated: April 8, 2026</p>
          </div>
        </section>

        <section className="bg-[#f4f1ed] px-5 py-20 lg:px-8">
          <div className="mx-auto max-w-5xl space-y-6">
            {sections.map((section) => (
              <article
                key={section.title}
                className="rounded-xl border border-[#e0dbd3] bg-white p-6 shadow-sm sm:p-8"
              >
                <h2
                  className="text-xl font-bold text-[#111] sm:text-2xl"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {section.title}
                </h2>
                <ul className="mt-4 space-y-3 text-sm leading-relaxed text-[#666] sm:text-base">
                  {section.points.map((point) => (
                    <li key={point} className="flex gap-3">
                      <span className="mt-1 h-2 w-2 rounded-full bg-[#e8612e]" aria-hidden />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
