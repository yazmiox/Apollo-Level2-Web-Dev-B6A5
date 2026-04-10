import { getVendorById } from "@/app/actions/vendor";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Star, Package, ArrowLeft, Calendar, ShieldCheck, Mail } from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function VendorStorefrontPage({ params }: Props) {
  const { id } = await params;
  const response = await getVendorById(id);

  if (!response.success || !response.data) {
    notFound();
  }

  const vendor = response.data;
  const equipments = vendor.equipments || [];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#f4f1ed] pt-24 pb-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          
          <Link href="/vendors" className="inline-flex items-center gap-1.5 text-sm font-medium text-[#777] hover:text-[#e8612e] transition-colors mb-8">
            <ArrowLeft size={16} />
            Back to All Vendors
          </Link>

          {/* Vendor Banner */}
          <div className="relative mb-12 overflow-hidden rounded-3xl border border-[#e0dbd3] bg-white shadow-sm">
            <div className="h-32 bg-charcoal" />
            <div className="relative px-8 pb-8">
              <div className="absolute -top-12 left-8 h-24 w-24 overflow-hidden rounded-2xl border-4 border-white bg-[#f9f8f6] shadow-sm">
                 {vendor.image ? (
                   <Image src={vendor.image} alt={vendor.name} fill className="object-cover" />
                 ) : (
                   <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-[#e8612e]">
                     {vendor.name.charAt(0)}
                   </div>
                 )}
              </div>
              
              <div className="ml-32 pt-4 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                <div>
                  <h1 className="text-3xl font-extrabold text-[#111]" style={{ fontFamily: "var(--font-display)" }}>
                    {vendor.name}
                  </h1>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1.5 text-sm font-bold text-amber-500">
                      <Star size={14} className="fill-current" />
                      {vendor.avgRating.toFixed(1)} Rating
                    </div>
                    <div className="flex items-center gap-1.5 text-sm font-medium text-[#777]">
                      <Package size={14} />
                      {vendor.listingsCount} active listings
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                   <div className="flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-700">
                      <ShieldCheck size={14} /> Verified Vendor
                   </div>
                   <div className="flex items-center gap-2 rounded-full border border-[#e0dbd3] bg-white px-4 py-2 text-xs font-bold text-[#111]">
                      <Mail size={14} /> Contact Vendor
                   </div>
                </div>
              </div>

              <div className="mt-8 grid gap-10 md:grid-cols-[2fr_1fr]">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#aaa] mb-3">About the Vendor</h3>
                  <p className="text-[#555] leading-relaxed">
                    {vendor.bio || `${vendor.name} is dedicated to providing high-quality rental equipment. With a focus on maintenance and customer service, you can trust their gear for your next project.`}
                  </p>
                </div>
                <div className="rounded-2xl bg-[#f9f8f6] p-5 border border-[#f0ece5]">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#888] mb-3">Response Time</h4>
                  <div className="flex items-center gap-2 text-sm font-bold text-[#111]">
                     <Calendar size={16} className="text-[#e8612e]" />
                     Usually responds within 2 hours
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Listings */}
          <div>
             <h2 className="text-2xl font-extrabold text-[#111] mb-8" style={{ fontFamily: "var(--font-display)" }}>
               Active Listings ({equipments.length})
             </h2>

             {equipments.length === 0 ? (
               <div className="rounded-2xl border-2 border-dashed border-[#e0dbd3] py-20 text-center">
                  <p className="text-sm font-medium text-[#aaa]">This vendor currently has no active listings.</p>
               </div>
             ) : (
               <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                 {equipments.map((item) => (
                   <Link 
                     key={item.id} 
                     href={`/equipment/${item.slug}`}
                     className="group overflow-hidden rounded-2xl border border-[#e0dbd3] bg-white transition-all hover:-translate-y-1 hover:shadow-xl"
                   >
                     <div className="relative aspect-video bg-[#f4f1ed]">
                       <Image src={item.imageUrl!} alt={item.name} fill className="object-cover" />
                       <span className="absolute bottom-2 left-2 rounded-md bg-white/95 px-2 py-1 text-xs font-bold text-[#111] shadow-sm">
                         ${item.rentalRate}/day
                       </span>
                     </div>
                     <div className="p-4">
                       <h3 className="line-clamp-1 text-sm font-bold text-[#111] transition-colors group-hover:text-[#e8612e]" style={{ fontFamily: "var(--font-display)" }}>
                         {item.name}
                       </h3>
                       <div className="mt-2 flex items-center justify-between">
                         <span className="text-[10px] font-bold uppercase tracking-widest text-[#aaa]">
                           {item.category?.name || "Equipment"}
                         </span>
                         <div className="flex items-center gap-1 text-[10px] font-bold text-amber-500">
                            <Star size={10} className="fill-current" />
                            {item.rating || 0}
                         </div>
                       </div>
                     </div>
                   </Link>
                 ))}
               </div>
             )}
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
