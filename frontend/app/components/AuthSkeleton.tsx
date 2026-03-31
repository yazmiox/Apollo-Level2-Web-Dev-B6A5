export default function AuthSkeleton() {
  return (
    <div className="hidden items-center gap-3 md:flex animate-pulse">
      <div className="h-4 w-12 rounded bg-white/10" />
      <div className="h-9 w-24 rounded-[6px] bg-white/20" />
    </div>
  );
}

export function MobileAuthSkeleton() {
  return (
    <div className="mt-4 flex flex-col gap-2 border-t border-white/5 pt-4 animate-pulse">
      <div className="h-4 w-16 rounded bg-white/10 mb-2 px-3" />
      <div className="h-10 w-full rounded bg-white/20" />
    </div>
  );
}
