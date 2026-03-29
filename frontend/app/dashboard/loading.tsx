"use client";

export default function DashboardLoading() {
    return <div className="space-y-8 animate-pulse">
        {/* Header Skeleton */}
        <div>
            <div className="h-9 w-48 rounded-lg bg-[#f0ece5] mb-2" />
            <div className="h-4 w-72 rounded-full bg-[#f0ece5]" />
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className="rounded-2xl border border-[#e0dbd3] bg-white p-5 shadow-sm">
                    <div className="mb-4 h-10 w-10 rounded-full bg-[#f9f8f6]" />
                    <div className="h-3 w-28 rounded-full bg-[#f0ece5] mb-3" />
                    <div className="h-7 w-16 rounded-lg bg-[#f0ece5]" />
                </div>
            ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
            {/* Pending Requests Block Skeleton */}
            <div className="rounded-2xl border border-[#e0dbd3] bg-white shadow-sm overflow-hidden flex flex-col">
                <div className="border-b border-[#f0ece5] flex items-center justify-between px-6 py-5">
                    <div>
                        <div className="h-5 w-32 rounded-full bg-[#f0ece5] mb-2" />
                        <div className="h-3 w-48 rounded-full bg-[#f0ece5]" />
                    </div>
                    <div className="h-4 w-20 rounded-full bg-[#f0ece5]" />
                </div>
                <div className="divide-y divide-[#f0ece5] flex-1">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 gap-4">
                            <div className="flex flex-col gap-3">
                                <div className="h-4 w-56 rounded-full bg-[#f0ece5]" />
                                {/* <div className="flex items-center gap-2">
                                    <div className="h-3 w-20 rounded-full bg-[#f0ece5]" />
                                    <span className="text-[#eee]">•</span>
                                    <div className="flex items-center gap-1.5">
                                        <Calendar size={13} className="text-[#eee]" />
                                        <div className="h-3 w-32 rounded-full bg-[#f0ece5]" />
                                    </div>
                                    <span className="text-[#eee]">•</span>
                                    <div className="h-3 w-12 rounded-full bg-[#f0ece5]" />
                                </div> */}
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <div className="h-8 w-16 rounded-lg bg-[#f0ece5]" />
                                <div className="h-8 w-20 rounded-lg bg-[#f0ece5]" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quick Actions Skeleton */}
            <div className="rounded-2xl border border-[#e0dbd3] bg-white p-6 shadow-sm h-fit">
                <div className="h-5 w-28 rounded-full bg-[#f0ece5] mb-5" />
                <div className="flex flex-col gap-3">
                    {[1, 2].map((i) => (
                        <div key={i} className="flex items-center justify-between rounded-xl bg-[#f0ece5] p-4">
                            <div className="space-y-3">
                                <div className="h-4 w-24 rounded-full bg-[#f0ece5]" />
                                <div className="h-3 w-32 rounded-full bg-[#f0ece5]" />
                            </div>
                            <div className="h-5 w-5 bg-[#f0ece5] rounded-full" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
}