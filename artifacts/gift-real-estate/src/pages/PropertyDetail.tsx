import React, { useState, useEffect } from "react";
import { useParams, Link } from "wouter";
import { listings } from "@/data/listings";
import { PropertyCard } from "@/components/PropertyCard";
import { Bed, Bath, Square, MapPin, Calendar, Check, Send } from "lucide-react";

export default function PropertyDetail() {
  const { id } = useParams();
  const [activeImage, setActiveImage] = useState(0);
  
  const listing = listings.find((l) => l.id === id);
  
  // Scroll to top on mount/id change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!listing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-20 text-center">
        <h1 className="font-serif text-4xl font-bold text-[#0F2E24] mb-4">Property Not Found</h1>
        <p className="mb-8 text-gray-600">The property you are looking for does not exist or has been removed.</p>
        <Link href="/properties" className="bg-[#1C4C3B] text-white px-6 py-2 rounded-sm">Back to Properties</Link>
      </div>
    );
  }

  const formattedPrice =
    listing.priceUnit === "USD"
      ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(listing.price)
      : `${new Intl.NumberFormat("en-ET").format(listing.price)} ETB/month`;

  const relatedListings = listings
    .filter((l) => l.id !== listing.id && (l.type === listing.type || l.location === listing.location))
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-[#FDFDF8] pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Breadcrumb */}
        <div className="flex gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-[#1C4C3B]">Home</Link>
          <span>/</span>
          <Link href="/properties" className="hover:text-[#1C4C3B]">Properties</Link>
          <span>/</span>
          <span className="text-[#14261F] font-medium">{listing.title}</span>
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-sm ${
                listing.type === "sale" ? "bg-[#1C4C3B] text-white" : "bg-[#D9B93C] text-[#0F2E24]"
              }`}>
                For {listing.type}
              </span>
              {listing.status && (
                <span className="bg-gray-200 text-gray-800 px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-sm">
                  {listing.status}
                </span>
              )}
            </div>
            <h1 className="font-serif text-3xl md:text-5xl font-bold text-[#0F2E24] mb-2">{listing.title}</h1>
            <div className="flex items-center gap-2 text-gray-500 text-lg">
              <MapPin size={20} className="text-[#1C4C3B]" />
              <span>{listing.neighborhood}, {listing.location}, Addis Ababa</span>
            </div>
          </div>
          <div className="text-right">
            <div className="font-serif text-4xl font-bold text-[#1C4C3B]">{formattedPrice}</div>
          </div>
        </div>

        {/* Gallery */}
        <div className="mb-12">
          <div className="aspect-[16/9] md:aspect-[21/9] bg-gray-200 rounded-sm overflow-hidden mb-4 relative">
            <img 
              src={listing.images[activeImage]} 
              alt={listing.title}
              className="w-full h-full object-cover transition-opacity duration-300"
            />
          </div>
          <div className="grid grid-cols-4 md:grid-cols-6 gap-4">
            {listing.images.map((img, idx) => (
              <button 
                key={idx}
                onClick={() => setActiveImage(idx)}
                className={`aspect-video rounded-sm overflow-hidden border-2 transition-all ${
                  activeImage === idx ? "border-[#D9B93C] opacity-100" : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Quick Specs */}
            <div className="flex flex-wrap gap-6 py-6 border-y border-gray-200 mb-8 bg-white px-8 rounded-sm shadow-sm">
              <div className="flex flex-col">
                <span className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Bedrooms</span>
                <div className="flex items-center gap-2 font-serif text-xl font-bold text-[#0F2E24]">
                  <Bed className="text-[#D9B93C]" /> {listing.bedrooms}
                </div>
              </div>
              <div className="w-px bg-gray-200 hidden md:block"></div>
              <div className="flex flex-col">
                <span className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Bathrooms</span>
                <div className="flex items-center gap-2 font-serif text-xl font-bold text-[#0F2E24]">
                  <Bath className="text-[#D9B93C]" /> {listing.bathrooms}
                </div>
              </div>
              <div className="w-px bg-gray-200 hidden md:block"></div>
              <div className="flex flex-col">
                <span className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Area</span>
                <div className="flex items-center gap-2 font-serif text-xl font-bold text-[#0F2E24]">
                  <Square className="text-[#D9B93C]" /> {listing.sizeSqm} sqm
                </div>
              </div>
              <div className="w-px bg-gray-200 hidden md:block"></div>
              <div className="flex flex-col">
                <span className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Listed</span>
                <div className="flex items-center gap-2 font-serif text-xl font-bold text-[#0F2E24]">
                  <Calendar className="text-[#D9B93C]" /> {new Date(listing.dateAdded).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-12">
              <h2 className="font-serif text-2xl font-bold text-[#0F2E24] mb-4">About this property</h2>
              <div className="prose prose-lg text-gray-700 max-w-none">
                <p className="whitespace-pre-line leading-relaxed">{listing.description}</p>
              </div>
            </div>

            {/* Amenities (Static Dummy) */}
            <div className="mb-12">
              <h2 className="font-serif text-2xl font-bold text-[#0F2E24] mb-4">Features & Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {['Secure Compound', 'Backup Generator', 'Ample Parking', 'Modern Kitchen', 'Water Reserve Tank', 'Paved Access Road'].map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 text-gray-700">
                    <Check size={18} className="text-[#1C4C3B]" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="mb-12">
              <h2 className="font-serif text-2xl font-bold text-[#0F2E24] mb-4">Location</h2>
              <div className="w-full h-64 bg-gray-200 rounded-sm border border-gray-300 flex flex-col items-center justify-center text-gray-500">
                <MapPin size={48} className="mb-4 text-[#1C4C3B]/50" />
                <p className="font-medium">Map view of {listing.neighborhood}, {listing.location}</p>
                <p className="text-sm">(Interactive map coming soon)</p>
              </div>
            </div>
          </div>

          {/* Sidebar / Inquiry Form */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-sm p-6 shadow-xl sticky top-28">
              <h3 className="font-serif text-xl font-bold text-[#0F2E24] mb-2">Interested in this property?</h3>
              <p className="text-gray-500 text-sm mb-6">Contact our sales team directly to schedule a viewing or request more information.</p>
              
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input type="text" className="w-full border border-gray-300 rounded-sm px-3 py-2 focus:outline-none focus:border-[#1C4C3B] focus:ring-1 focus:ring-[#1C4C3B]" placeholder="Your name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input type="email" className="w-full border border-gray-300 rounded-sm px-3 py-2 focus:outline-none focus:border-[#1C4C3B] focus:ring-1 focus:ring-[#1C4C3B]" placeholder="you@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input type="tel" className="w-full border border-gray-300 rounded-sm px-3 py-2 focus:outline-none focus:border-[#1C4C3B] focus:ring-1 focus:ring-[#1C4C3B]" placeholder="+251..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea rows={4} className="w-full border border-gray-300 rounded-sm px-3 py-2 focus:outline-none focus:border-[#1C4C3B] focus:ring-1 focus:ring-[#1C4C3B]" defaultValue={`I am interested in ${listing.title} and would like to arrange a viewing.`}></textarea>
                </div>
                <button type="submit" className="w-full bg-[#1C4C3B] text-white px-4 py-3 rounded-sm font-bold flex items-center justify-center gap-2 hover:bg-[#0F2E24] transition-colors shadow-md">
                  <Send size={18} />
                  Send Inquiry
                </button>
              </form>
              
              <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-center gap-4">
                <a href="tel:+251114651234" className="text-[#1C4C3B] font-bold text-sm hover:underline">Call Us</a>
                <span className="text-gray-300">|</span>
                <a href="https://wa.me/251911234567" target="_blank" rel="noreferrer" className="text-[#1C4C3B] font-bold text-sm hover:underline">WhatsApp</a>
              </div>
            </div>
          </div>
        </div>

        {/* Related Listings */}
        {relatedListings.length > 0 && (
          <div className="mt-24 pt-12 border-t border-gray-200">
            <h2 className="font-serif text-3xl font-bold text-[#0F2E24] mb-8">Similar Properties</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedListings.map((l) => (
                <PropertyCard key={l.id} listing={l} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
