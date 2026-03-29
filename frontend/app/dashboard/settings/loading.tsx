import { User, Mail, ShieldCheck } from "lucide-react";

export default function UserSettingsLoading() {
  return (
    <div className="space-y-8 pb-10">
      {/* Header Skeleton */}
      <div>
        <div className="h-9 w-32 animate-pulse rounded-lg bg-[#f0ece5]" />
        <div className="mt-2 h-5 w-96 animate-pulse rounded-lg bg-[#f0ece5]" />
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Personal Info Skeleton */}
        <section className="rounded-2xl border border-[#e0dbd3] bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6 flex items-center gap-3 border-b border-[#f0ece5] pb-4">
            <div className="flex h-10 w-10 animate-pulse items-center justify-center rounded-full bg-[#f9f8f6] text-[#e0dbd3]">
              <User size={20} />
            </div>
            <div className="space-y-2">
              <div className="h-6 w-32 animate-pulse rounded bg-[#f0ece5]" />
              <div className="h-3 w-40 animate-pulse rounded bg-[#f0ece5]" />
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <div className="h-3 w-20 animate-pulse rounded bg-[#f0ece5]" />
              <div className="h-10 w-full animate-pulse rounded-[8px] bg-[#f9f8f6] border border-[#f0ece5]" />
            </div>

            <div className="space-y-1.5">
              <div className="h-3 w-24 animate-pulse rounded bg-[#f0ece5]" />
              <div className="h-10 w-full animate-pulse rounded-[8px] bg-[#f4f1ed] border border-[#f0ece5]" />
              <div className="h-2 w-48 animate-pulse rounded bg-[#f0ece5]" />
            </div>

            <div className="mt-2 h-10 w-32 animate-pulse rounded-[8px] bg-[#f0ece5]" />
          </div>
        </section>

        {/* Security / Password Skeleton */}
        <section className="space-y-8">
          <div className="rounded-2xl border border-[#e0dbd3] bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6 flex items-center gap-3 border-b border-[#f0ece5] pb-4">
              <div className="flex h-10 w-10 animate-pulse items-center justify-center rounded-full bg-[#f9f8f6] text-[#e0dbd3]">
                <ShieldCheck size={20} />
              </div>
              <div className="space-y-2">
                <div className="h-6 w-24 animate-pulse rounded bg-[#f0ece5]" />
                <div className="h-3 w-48 animate-pulse rounded bg-[#f0ece5]" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <div className="h-3 w-28 animate-pulse rounded bg-[#f0ece5]" />
                <div className="h-10 w-full animate-pulse rounded-[8px] bg-[#f9f8f6] border border-[#f0ece5]" />
              </div>
              <div className="space-y-1.5">
                <div className="h-3 w-24 animate-pulse rounded bg-[#f0ece5]" />
                <div className="h-10 w-full animate-pulse rounded-[8px] bg-[#f9f8f6] border border-[#f0ece5]" />
              </div>

              <div className="mt-2 h-10 w-40 animate-pulse rounded-[8px] bg-[#f0ece5]" />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
