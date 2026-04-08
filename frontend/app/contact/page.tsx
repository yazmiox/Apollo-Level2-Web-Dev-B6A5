import type { Metadata } from "next";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

export const metadata: Metadata = {
  title: "Contact | EquipFlow",
  description:
    "Contact EquipFlow for support, onboarding, and operational help for your shared equipment workflows.",
};

const contactChannels = [
  {
    title: "Support",
    value: "support@equipflow.app",
    description:
      "For account help, booking issues, payment questions, or return workflow troubleshooting.",
  },
  {
    title: "Partnerships",
    value: "partnerships@equipflow.app",
    description:
      "For institutional onboarding, multi-team rollouts, and implementation planning.",
  },
  {
    title: "Security",
    value: "security@equipflow.app",
    description:
      "For responsible disclosure reports and security-related concerns about the platform.",
  },
];

const faq = [
  {
    question: "How quickly can we onboard our facility?",
    answer:
      "Most teams complete setup in a few days, including catalog import, role setup, and booking policy configuration.",
  },
  {
    question: "Can you support custom admin workflows?",
    answer:
      "Yes. We can help align approval, maintenance, and return verification flows to your organization's process.",
  },
  {
    question: "Do you provide migration support?",
    answer:
      "Yes. We assist with moving existing inventory and booking data from spreadsheets or legacy systems.",
  },
];

export default function ContactPage() {
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
                "radial-gradient(circle at 80% 20%, #e8612e 0%, transparent 45%)",
            }}
          />
          <div className="relative mx-auto max-w-5xl">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#e8612e]">
              Contact
            </p>
            <h1
              className="mt-4 max-w-3xl text-4xl font-extrabold tracking-tight text-white sm:text-5xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Reach the EquipFlow team
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">
              Whether you need product support, onboarding guidance, or help with equipment
              operations, we are here to help your team move forward quickly.
            </p>
          </div>
        </section>

        <section className="bg-[#f4f1ed] px-5 py-20 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-6 md:grid-cols-3">
              {contactChannels.map((channel) => (
                <article
                  key={channel.title}
                  className="rounded-xl border border-[#e0dbd3] bg-white p-6 shadow-sm"
                >
                  <h2
                    className="text-lg font-bold text-[#111]"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {channel.title}
                  </h2>
                  <p className="mt-2 text-sm font-semibold text-[#e8612e]">{channel.value}</p>
                  <p className="mt-3 text-sm leading-relaxed text-[#666]">{channel.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white px-5 py-20 lg:px-8">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2 lg:gap-14">
            <div className="rounded-2xl border border-[#ece7de] bg-[#f9f7f3] p-8">
              <h2
                className="text-2xl font-bold text-[#111] sm:text-3xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Support hours
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-[#666] sm:text-base">
                Monday to Friday, 9:00 AM to 6:00 PM (UTC). We prioritize operational incidents,
                booking blockers, and payment-related requests first.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-[#666] sm:text-base">
                For faster resolution, include your workspace name, booking reference, and a short
                description of the issue in your message.
              </p>
            </div>

            <div>
              <h2
                className="text-2xl font-bold text-[#111] sm:text-3xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Frequently asked questions
              </h2>
              <div className="mt-6 space-y-5">
                {faq.map((item) => (
                  <article
                    key={item.question}
                    className="rounded-xl border border-[#ece7de] bg-white p-5 shadow-sm"
                  >
                    <h3 className="text-base font-semibold text-[#111]">{item.question}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#666]">{item.answer}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
