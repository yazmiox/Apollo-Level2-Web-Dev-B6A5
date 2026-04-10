import { getAllVendors } from "../actions/vendor";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Image from "next/image";
import Link from "next/link";
import { Star, Package, ArrowRight, Store } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function VendorsPage() {
  const response = await getAllVendors();
  const vendors = response.success ? response.data : [];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#f4f1ed] pt-24 pb-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          
          <div className="mb-12">
            <h1 className="text-4xl font-extrabold tracking-tight text-[#111]" style={{ fontFamily: "var(--font-display)" }}>
              Browse Vendors
            </h1>
            <p className="mt-2 text-[#777] max-w-2xl">
              Meet our community of equipment owners. Rent directly from trusted local professionals and hobbyists.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {vendors.length === 0 ? (
              <div className="col-span-full rounded-2xl border-2 border-dashed border-[#e0dbd3] py-20 text-center">
                 <Store size={40} className="mx-auto text-[#ccc] mb-4" />
                 <p className="text-sm font-medium text-[#aaa]">No vendors found at the moment.</p>
              </div>
            ) : (
              vendors.map((vendor) => (
                <Link 
                  key={vendor.id} 
                  href={`/vendors/${vendor.id}`}
                  className="group flex flex-col rounded-2xl border border-[#e0dbd3] bg-white p-6 transition-all hover:border-[#e8612e]/30 hover:shadow-lg"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-[#f4f1ed] bg-[#f9f8f6]">
                      {vendor.image ? (
                        <Image src={vendor.image} alt={vendor.name} fill className="object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xl font-bold text-[#e8612e]">
                          {vendor.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-[#111] group-hover:text-[#e8612e] transition-colors" style={{ fontFamily: "var(--font-display)" }}>
                        {vendor.name}
                      </h2>
                      <div className="flex items-center gap-3 mt-1 text-xs text-[#888]">
                        <span className="flex items-center gap-1 font-bold text-amber-500">
                          <Star size={12} className="fill-current" />
                          {vendor.avgRating.toFixed(1)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Package size={12} />
                          {vendor.listingsCount} Listings
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="line-clamp-2 text-sm text-[#666] leading-relaxed mb-6 flex-1">
                    {vendor.bio || `${vendor.name} is a verified vendor offering premium gear for rent on Apollo.`}
                  </p>

                  <div className="mt-auto flex items-center justify-between border-t border-[#f0ece5] pt-4">
                    <span className="text-xs font-bold text-[#111] uppercase tracking-wider">Storefront</span>
                    <ArrowRight size={16} className="text-[#ccc] group-hover:translate-x-1 group-hover:text-[#e8612e] transition-all" />
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
