import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchListing, fetchListings, submitInquiry, fetchSiteSettings } from "@/lib/api";

const BASE = import.meta.env.BASE_URL?.replace(/\/$/, "") ?? "";
const STORAGE_BASE = `${BASE}/api/storage`;
const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800";
function resolveImageUrl(path: string | undefined): string {
  if (!path) return FALLBACK_IMAGE;
  if (path.startsWith("http")) return path;
  if (path.startsWith("/objects/")) return `${STORAGE_BASE}${path}`;
  if (path.startsWith("/uploads/")) return `${BASE}/api${path}`;
  return path;
}
import { PropertyCard } from "@/components/PropertyCard";
import { MapPicker } from "@/components/MapPicker";
import { SEO, breadcrumbJsonLd, trackEvent } from "@/components/SEO";
import { Bed, Bath, Square, MapPin, Calendar, Check, Send, Phone } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function PropertyDetail() {
  const pageRef = useRef<HTMLDivElement>(null);
  useScrollReveal(pageRef);

  const { id } = useParams();
  const [activeImage, setActiveImage] = useState(0);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const { data: listing, isLoading, isError } = useQuery({
    queryKey: ["listing", id],
    queryFn: () => fetchListing(id!),
    enabled: !!id,
  });

  const { data: allListings = [] } = useQuery({
    queryKey: ["listings"],
    queryFn: () => fetchListings(),
  });

  const { data: settings } = useQuery({
    queryKey: ["site-settings"],
    queryFn: fetchSiteSettings,
    staleTime: 5 * 60 * 1000,
  });
  const phone = settings?.phone || "+251 11 465 1234";
  const whatsapp = settings?.whatsapp || "+251911234567";
  const whatsappNum = whatsapp.replace(/[\s+]/g, "");

  const inquiry = useMutation({
    mutationFn: submitInquiry,
    onSuccess: () => {
      setSubmitted(true);
      trackEvent("submit_inquiry", { listing_id: id });
    },
  });

  useEffect(() => { window.scrollTo(0, 0); }, [id]);
  useEffect(() => {
    if (listing) {
      setForm((f) => ({ ...f, message: `I am interested in ${listing.title} and would like to arrange a viewing.` }));
    }
  }, [listing]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FFFFFF] pt-24 pb-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="h-8 w-64 bg-gray-100 animate-pulse mb-6" />
          <div className="h-96 bg-gray-100 animate-pulse mb-8" />
        </div>
      </div>
    );
  }

  if (isError || !listing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-20 text-center">
        <h1 className="font-bold text-4xl text-[#1A1A1A] mb-4">Property Not Found</h1>
        <p className="mb-8 text-gray-600">The property you are looking for does not exist or has been removed.</p>
        <Link href="/properties" className="bg-[#E31E24] text-white px-6 py-3 font-bold text-xs tracking-widest uppercase hover:bg-[#1A1A1A] transition-colors">Back to Properties</Link>
      </div>
    );
  }

  const priceNum = parseFloat(listing.price);
  const formattedPrice = listing.type === "rent"
    ? `ETB ${new Intl.NumberFormat("en-ET").format(priceNum)}/mo`
    : `ETB ${new Intl.NumberFormat("en-ET").format(priceNum)}`;

  const relatedListings = allListings
    .filter((l) => l.id !== listing.id && (l.type === listing.type || l.location === listing.location))
    .slice(0, 3);

  const bedsLabel = listing.bedrooms > 0 ? `${listing.bedrooms}BR ` : "";
  const seoTitle = `${bedsLabel}${listing.type === "sale" ? "For Sale" : "For Rent"} in ${listing.neighborhood}, Addis Ababa`;
  const seoDesc = `${listing.title} — ${listing.sizeSqm}sqm, ${listing.bedrooms} bed, ${listing.bathrooms} bath in ${listing.location}. ${formattedPrice}. GETAS Real Estate.`;

  const propertyJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: listing.title,
    description: listing.description,
    image: listing.images[0],
    offers: {
      "@type": "Offer",
      price: listing.price,
      priceCurrency: "ETB",
      availability: "https://schema.org/InStock",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: listing.neighborhood,
      addressRegion: listing.location,
      addressCountry: "ET",
    },
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    inquiry.mutate({ ...form, listingId: listing.id });
  };

  return (
    <div ref={pageRef} className="min-h-screen bg-[#FFFFFF] pt-24 pb-20">
      <SEO
        title={seoTitle}
        description={seoDesc}
        image={listing.images[0]}
        path={`/properties/${listing.id}`}
        type="product"
        jsonLd={[propertyJsonLd, breadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: "Properties", url: "/properties" },
          { name: listing.title, url: `/properties/${listing.id}` },
        ])]}
      />

      <div className="container mx-auto px-4 max-w-6xl">
        {/* Breadcrumb */}
        <div className="flex gap-2 text-xs text-gray-400 mb-6 uppercase tracking-wider font-bold">
          <Link href="/" className="hover:text-[#E31E24] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/properties" className="hover:text-[#E31E24] transition-colors">Properties</Link>
          <span>/</span>
          <span className="text-[#1A1A1A]">{listing.title}</span>
        </div>

        {/* Title Block */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8 pb-8 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-[#E31E24] text-white px-3 py-1 text-xs font-bold uppercase tracking-wider">
                For {listing.type}
              </span>
              {listing.status && (
                <span className="bg-[#1A1A1A] text-white px-3 py-1 text-xs font-bold uppercase tracking-wider">{listing.status}</span>
              )}
            </div>
            <h1 className="font-bold text-3xl md:text-5xl text-[#1A1A1A] mb-3 tracking-tight">{listing.title}</h1>
            <div className="flex items-center gap-2 text-gray-500">
              <MapPin size={18} className="text-[#E31E24]" />
              <span>{listing.neighborhood}, {listing.location}, Addis Ababa</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Price</div>
            <div className="font-bold text-4xl text-[#E31E24] tracking-tight">{formattedPrice}</div>
          </div>
        </div>

        {/* Gallery */}
        <div data-reveal className="mb-12">
          <div className="bg-[#0D0D0D] overflow-hidden mb-3 flex items-center justify-center" style={{ maxHeight: "70vh" }}>
            <img
              src={resolveImageUrl(listing.images[activeImage])}
              alt={`${listing.title} — ${listing.neighborhood}, ${listing.location}, Addis Ababa`}
              width={1200} height={800}
              loading="lazy"
              className="w-full h-auto max-h-[70vh] object-contain transition-opacity duration-300"
            />
          </div>
          {listing.images.length > 1 && (
            <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
              {listing.images.map((img, idx) => (
                <button key={idx} onClick={() => setActiveImage(idx)} className={`aspect-video overflow-hidden border-2 transition-all bg-[#1A1A1A] ${activeImage === idx ? "border-[#E31E24]" : "border-transparent opacity-50 hover:opacity-100"}`}>
                  <img src={resolveImageUrl(img)} alt={`${listing.title} photo ${idx + 1}`} width={200} height={120} loading="lazy" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div data-reveal className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Specs Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-0 mb-10 border border-gray-100">
              {listing.bedrooms > 0 && (
                <div className="flex flex-col items-center justify-center py-6 px-4 border-r border-gray-100">
                  <Bed className="text-[#E31E24] mb-2" size={22} />
                  <span className="font-bold text-2xl text-[#1A1A1A]">{listing.bedrooms}</span>
                  <span className="text-gray-400 text-xs font-bold uppercase tracking-wider mt-1">Bedrooms</span>
                </div>
              )}
              <div className="flex flex-col items-center justify-center py-6 px-4 border-r border-gray-100">
                <Bath className="text-[#E31E24] mb-2" size={22} />
                <span className="font-bold text-2xl text-[#1A1A1A]">{listing.bathrooms}</span>
                <span className="text-gray-400 text-xs font-bold uppercase tracking-wider mt-1">Bathrooms</span>
              </div>
              <div className="flex flex-col items-center justify-center py-6 px-4 border-r border-gray-100">
                <Square className="text-[#E31E24] mb-2" size={22} />
                <span className="font-bold text-2xl text-[#1A1A1A]">{listing.sizeSqm}</span>
                <span className="text-gray-400 text-xs font-bold uppercase tracking-wider mt-1">sqm</span>
              </div>
              <div className="flex flex-col items-center justify-center py-6 px-4">
                <Calendar className="text-[#E31E24] mb-2" size={22} />
                <span className="font-bold text-sm text-[#1A1A1A]">{new Date(listing.dateAdded).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</span>
                <span className="text-gray-400 text-xs font-bold uppercase tracking-wider mt-1">Listed</span>
              </div>
            </div>

            <div className="mb-12">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-5 w-1 bg-[#E31E24]" />
                <h2 className="font-bold text-2xl text-[#1A1A1A] tracking-tight">About this property</h2>
              </div>
              <p className="whitespace-pre-line leading-relaxed text-gray-700 text-lg">{listing.description}</p>
            </div>

            {listing.features && listing.features.length > 0 && (
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-5">
                  <div className="h-5 w-1 bg-[#E31E24]" />
                  <h2 className="font-bold text-2xl text-[#1A1A1A] tracking-tight">Features & Amenities</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {listing.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2 text-gray-700 bg-gray-50 px-4 py-3 border-l-2 border-[#E31E24]">
                      <Check size={16} className="text-[#E31E24] flex-shrink-0" /> <span className="text-sm font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-12">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-5 w-1 bg-[#E31E24]" />
                <h2 className="font-bold text-2xl text-[#1A1A1A] tracking-tight">Location</h2>
              </div>
              {listing.mapsUrl ? (
                <div className="space-y-4">
                  <div className="w-full border border-gray-100 bg-gray-50 flex flex-col items-center justify-center py-10 gap-4">
                    <MapPin size={36} className="text-[#E31E24]" />
                    <div className="text-center">
                      <p className="font-bold text-[#1A1A1A] text-lg tracking-tight">{listing.neighborhood}, {listing.location}</p>
                      <p className="text-gray-500 text-sm mt-1">Addis Ababa, Ethiopia</p>
                    </div>
                    <a
                      href={listing.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-[#E31E24] text-white px-6 py-3 font-bold text-xs tracking-widest uppercase hover:bg-[#1A1A1A] transition-colors"
                    >
                      <MapPin size={14} />
                      View on Google Maps
                    </a>
                  </div>
                  {listing.latitude != null && listing.longitude != null && (
                    <MapPicker lat={listing.latitude} lng={listing.longitude} onChange={() => {}} readonly={true} />
                  )}
                </div>
              ) : listing.latitude != null && listing.longitude != null ? (
                <MapPicker
                  lat={listing.latitude}
                  lng={listing.longitude}
                  onChange={() => {}}
                  readonly={true}
                />
              ) : (
                <div className="w-full h-48 bg-gray-50 border border-gray-100 flex flex-col items-center justify-center text-gray-400">
                  <MapPin size={32} className="mb-3 text-[#E31E24]/30" />
                  <p className="font-bold text-sm text-[#1A1A1A]">{listing.neighborhood}, {listing.location}</p>
                  <p className="text-xs mt-1">Exact map location not set</p>
                </div>
              )}
            </div>
          </div>

          {/* Inquiry Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-[#0D0D0D] border-t-4 border-[#E31E24] p-6 sticky top-28">
              <h3 className="font-bold text-xl text-white mb-2 tracking-tight">Interested in this property?</h3>
              <p className="text-white/50 text-sm mb-6">Contact our sales team to schedule a viewing or request more information.</p>

              {submitted ? (
                <div className="bg-[#1A1A1A] text-green-400 p-5 text-center border border-green-900">
                  <div className="w-12 h-12 bg-green-900/30 flex items-center justify-center mx-auto mb-3 text-green-400"><Send size={20} /></div>
                  <h4 className="font-bold mb-1 text-white">Inquiry Sent!</h4>
                  <p className="text-sm text-white/60">An agent will contact you shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Full Name *</label>
                    <input required type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-[#1A1A1A] border border-white/10 px-3 py-2.5 text-white focus:outline-none focus:border-[#E31E24] transition-colors placeholder:text-white/20" placeholder="Your name" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Email Address *</label>
                    <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full bg-[#1A1A1A] border border-white/10 px-3 py-2.5 text-white focus:outline-none focus:border-[#E31E24] transition-colors placeholder:text-white/20" placeholder="you@example.com" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Phone Number</label>
                    <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full bg-[#1A1A1A] border border-white/10 px-3 py-2.5 text-white focus:outline-none focus:border-[#E31E24] transition-colors placeholder:text-white/20" placeholder="+251..." />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Message *</label>
                    <textarea required rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full bg-[#1A1A1A] border border-white/10 px-3 py-2.5 text-white focus:outline-none focus:border-[#E31E24] transition-colors resize-none" />
                  </div>
                  {inquiry.isError && <p className="text-[#E31E24] text-xs font-bold">Failed to send. Please try again.</p>}
                  <button type="submit" disabled={inquiry.isPending} className="w-full bg-[#E31E24] text-white px-4 py-3 font-bold text-xs tracking-widest uppercase flex items-center justify-center gap-2 hover:bg-white hover:text-[#1A1A1A] transition-colors disabled:opacity-60">
                    <Send size={16} /> {inquiry.isPending ? "Sending…" : "Send Inquiry"}
                  </button>
                </form>
              )}

              <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-center gap-4">
                <a href={`tel:${phone.replace(/\s/g, "")}`} onClick={() => trackEvent("cta_click", { button: "Call Now" })} className="text-[#E31E24] font-bold text-xs uppercase tracking-wider hover:underline flex items-center gap-1"><Phone size={12} /> Call Us</a>
                <span className="text-white/20">|</span>
                <a href={`https://wa.me/${whatsappNum}`} onClick={() => trackEvent("cta_click", { button: "WhatsApp" })} target="_blank" rel="noreferrer" className="text-[#E31E24] font-bold text-xs uppercase tracking-wider hover:underline">WhatsApp</a>
              </div>
            </div>
          </div>
        </div>

        {relatedListings.length > 0 && (
          <div className="mt-24 pt-12 border-t border-gray-100">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-6 w-1 bg-[#E31E24]" />
              <h2 className="font-bold text-3xl text-[#1A1A1A] tracking-tight">Similar Properties</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedListings.map((l) => <PropertyCard key={l.id} listing={l} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
