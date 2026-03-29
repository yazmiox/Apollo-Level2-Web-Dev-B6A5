import type { Metadata } from "next";
import { Bricolage_Grotesque, DM_Sans } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "EquipFlow — Shared Equipment Management",
  description:
    "Manage shared equipment, bookings, deposits, returns, and maintenance in one place. Built for media labs, creative studios, workshops, and shared spaces.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${bricolage.variable}`}>
      <body style={{ fontFamily: "var(--font-body, 'DM Sans', sans-serif)" }}>
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
