import Link from "next/link";

export default function Logo({ color = "text-white" }: { color?: string }) {
    return <Link href="/" className="group flex items-center gap-2.5">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-[6px] bg-[#e8612e] transition-transform group-hover:scale-105">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="1" y="3.5" width="14" height="2.5" rx="1.25" fill="white" />
                <rect x="1" y="7" width="9" height="2.5" rx="1.25" fill="white" />
                <rect x="1" y="10.5" width="11.5" height="2.5" rx="1.25" fill="white" />
            </svg>
        </span>
        <span
            className={`text-[17px] font-bold tracking-tight ${color}`}
            style={{ fontFamily: "var(--font-display)" }}
        >
            EquipFlow
        </span>
    </Link>
}