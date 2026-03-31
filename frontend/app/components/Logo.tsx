import Link from "next/link";

export default function Logo({ 
    color = "text-[#111]", 
    size = "md",
    showText = true 
}: { 
    color?: string; 
    size?: "sm" | "md" | "lg" | "xl";
    showText?: boolean;
}) {
    const sizeClasses = {
        sm: { container: "h-7 w-7", svg: 14, text: "text-base" },
        md: { container: "h-9 w-9", svg: 18, text: "text-lg" },
        lg: { container: "h-11 w-11", svg: 22, text: "text-2xl" },
        xl: { container: "h-14 w-14", svg: 28, text: "text-3xl" }
    };

    const currentSize = sizeClasses[size];

    return (
        <Link href="/" className="group flex items-center gap-3">
            <span className={`${currentSize.container} inline-flex items-center justify-center rounded-[8px] bg-orange shadow-sm`}>
                <svg width={currentSize.svg} height={currentSize.svg} viewBox="0 0 16 16" fill="none">
                    <rect x="1" y="3.5" width="14" height="2.5" rx="1.25" fill="white" />
                    <rect x="1" y="7" width="9" height="2.5" rx="1.25" fill="white" />
                    <rect x="1" y="10.5" width="11.5" height="2.5" rx="1.25" fill="white" />
                </svg>
            </span>
            {showText && (
                <span
                    className={`${currentSize.text} font-black tracking-tight ${color}`}
                    style={{ fontFamily: "var(--font-display)" }}
                >
                    EquipFlow
                </span>
            )}
        </Link>
    );
}