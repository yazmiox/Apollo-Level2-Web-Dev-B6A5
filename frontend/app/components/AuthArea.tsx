import { getSession } from "@/app/lib/auth-server";
import Link from "next/link";
import SignOutButton from "./SignOutButton";

export default async function AuthArea() {
  const session = await getSession();
  const user = session?.user;

  if (!user) {
    return (
      <div className="hidden items-center gap-3 md:flex">
        <Link
          href="/login"
          className="rounded-md px-4 py-2 text-sm font-medium text-white/60 hover:text-white transition-colors"
        >
          Sign In
        </Link>
        <Link
          href="/register"
          className="rounded-[6px] bg-orange px-4 py-2 text-sm font-semibold text-white hover:bg-orange-light active:scale-95 transition-all"
        >
          Get Started
        </Link>
      </div>
    );
  }

  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "";

  return (
    <div className="hidden items-center gap-3 md:flex">
      <Link
        href="/dashboard"
        className="flex items-center gap-2 rounded-full border border-white/10 p-1 pr-3 hover:bg-white/5 transition-colors focus:outline-none"
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-charcoal-card text-xs font-bold text-orange">
          {initials}
        </div>
        <span className="text-sm font-medium text-white/80">{user.name.split(" ")[0]}</span>
      </Link>
    </div>
  );
}

export async function MobileAuthArea() {
  const session = await getSession();
  const user = session?.user;

  if (!user) {
    return (
      <div className="mt-4 flex flex-col gap-2 border-t border-white/5 pt-4">
        <Link href="/login" className="px-3 py-2 text-sm font-medium text-white/60 hover:text-white">
          Sign In
        </Link>
        <Link href="/register" className="rounded-[6px] bg-orange py-2.5 text-center text-sm font-semibold text-white">
          Get Started
        </Link>
      </div>
    );
  }

  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "";

  return (
    <div className="mt-4 flex flex-col gap-2 border-t border-white/5 pt-4">
      <Link href="/dashboard" className="px-3 py-2 flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-charcoal-card text-xs font-bold text-orange">
          {initials}
        </div>
        <div>
          <p className="text-sm font-medium text-white">{user.name}</p>
          <p className="text-xs text-white/50">{user.email}</p>
        </div>
      </Link>
      <SignOutButton isMobile />
    </div>
  );
}
