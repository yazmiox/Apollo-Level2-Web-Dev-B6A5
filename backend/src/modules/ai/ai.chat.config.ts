export type ChatQuickAction = {
    label: string;
    href: string;
};

export type ChatFaqEntry = {
    id: string;
    question: string;
    answer: string;
    tags: string[];
    suggestions?: ChatQuickAction[];
};

export const DEFAULT_CHAT_SUGGESTIONS: ChatQuickAction[] = [
    { label: "Browse Equipment", href: "/equipment" },
    { label: "My Bookings", href: "/dashboard/bookings" },
    { label: "Contact Support", href: "/contact" },
];

export const CHAT_FAQS: ChatFaqEntry[] = [
    {
        id: "booking-steps",
        question: "How do I book equipment?",
        answer:
            "Go to the Equipment page, open any item, choose your rental dates, then submit the booking request. After approval, complete payment to confirm your booking.",
        tags: ["book", "booking", "rent", "reserve", "how to book"],
        suggestions: [
            { label: "Browse Equipment", href: "/equipment" },
            { label: "My Bookings", href: "/dashboard/bookings" },
        ],
    },
    {
        id: "availability",
        question: "How can I check availability?",
        answer:
            "Use the equipment search and filters. Items marked Available can be requested right away. You can also use status and category filters to narrow results.",
        tags: ["availability", "available", "stock", "status", "filter"],
        suggestions: [{ label: "View Equipment", href: "/equipment" }],
    },
    {
        id: "payment",
        question: "When do I pay for a booking?",
        answer:
            "Payment is completed after your booking request is approved. You will see the payment option from your booking details in the dashboard.",
        tags: ["payment", "pay", "card", "checkout", "invoice"],
        suggestions: [{ label: "Booking Dashboard", href: "/dashboard/bookings" }],
    },
    {
        id: "returns",
        question: "What should I do when returning equipment?",
        answer:
            "Return the equipment by the agreed end date and in good condition with included items. If anything is damaged or missing, report it immediately.",
        tags: ["return", "late", "damage", "condition", "missing"],
        suggestions: [
            { label: "Privacy & Policy", href: "/privacy" },
            { label: "Contact Support", href: "/contact" },
        ],
    },
    {
        id: "account-help",
        question: "How do I manage my account?",
        answer:
            "You can sign in, view your bookings, and manage account details from the dashboard. If you're new, create an account from the Register page.",
        tags: ["account", "login", "register", "dashboard", "profile"],
        suggestions: [
            { label: "Sign In", href: "/login" },
            { label: "Register", href: "/register" },
        ],
    },
];

