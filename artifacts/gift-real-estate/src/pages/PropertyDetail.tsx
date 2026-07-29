import React, { useState, useEffect } from "react";
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
  return path;
}
import { PropertyCard } from "@/components/PropertyCard";
import { MapPicker } from "@/components/MapPicker";
import { SEO, breadcrumbJsonLd, trackEvent } from "@/components/SEO";
import { Bed, Bath, Square, MapPin, Calendar, Check, Send, Phone } from "lucide-react";

export default function PropertyDetail() {
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
      <div className="min-h-screen bg-[#FDFDF8] pt-24 pb-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="h-8 w-64 bg-gray-100 rounded animate-pulse mb-6" />
          <div className="h-96 bg-gray-100 rounded animate-pulse mb-8" />
        </div>
      </div>
    );
  }

  if (isError || !listing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-20 text-center">
        <h1 className="font-serif text-4xl font-bold text-[#0F2E24] mb-4">Property Not Found</h1>
        <p className="mb-8 text-gray-600">The property you are looking for does not exist or has been removed.</p>
        <Link href="/properties" className="bg-[#1C4C3B] text-white px-6 py-2 rounded-sm">Back to Properties</Link>
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
  const seoDesc = `${listing.title} — ${listing.sizeSqm}sqm, ${listing.bedrooms} bed, ${listing.bathrooms} bath in ${listing.location}. ${formattedPrice}. GIFT Real Estate.`;

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
    <div className="min-h-screen bg-[#FDFDF8] pt-24 pb-20">
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
        <div className="flex gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-[#1C4C3B]">Home</Link>
          <span>/</span>
          <Link href="/properties" className="hover:text-[#1C4C3B]">Properties</Link>
          <span>/</span>
          <span className="text-[#14261F] font-medium">{listing.title}</span>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-sm ${listing.type === "sale" ? "bg-[#1C4C3B] text-white" : "bg-[#D9B93C] text-[#0F2E24]"}`}>
                For {listing.type}
              </span>
              {listing.status && (
                <span className="bg-gray-200 text-gray-800 px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-sm">{listing.status}</span>
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
          <div className="bg-[#0F2E24] rounded-sm overflow-hidden mb-4 flex items-center justify-center" style={{ maxHeight: "70vh" }}>
            <img
              src={resolveImageUrl(listing.images[activeImage])}
              alt={`${listing.title} — ${listing.neighborhood}, ${listing.location}, Addis Ababa`}
              width={1200} height={800}
              loading="lazy"
              className="w-full h-auto max-h-[70vh] object-contain transition-opacity duration-300"
            />
          </div>
          <div className="grid grid-cols-4 md:grid-cols-6 gap-4">
            {listing.images.map((img, idx) => (
              <button key={idx} onClick={() => setActiveImage(idx)} className={`aspect-video rounded-sm overflow-hidden border-2 transition-all bg-[#0F2E24] ${activeImage === idx ? "border-[#D9B93C] opacity-100" : "border-transparent opacity-60 hover:opacity-100"}`}>
                <img src={resolveImageUrl(img)} alt={`${listing.title} photo ${idx + 1}`} width={200} height={120} loading="lazy" className="w-full h-full object-contain" />
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <div className="flex flex-wrap gap-6 py-6 border-y border-gray-200 mb-8 bg-white px-8 rounded-sm shadow-sm">
              {listing.bedrooms > 0 && (
                <div className="flex flex-col">
                  <span className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Bedrooms</span>
                  <div className="flex items-center gap-2 font-serif text-xl font-bold text-[#0F2E24]">
                    <Bed className="text-[#D9B93C]" /> {listing.bedrooms}
                  </div>
                </div>
              )}
              <div className="w-px bg-gray-200 hidden md:block" />
              <div className="flex flex-col">
                <span className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Bathrooms</span>
                <div className="flex items-center gap-2 font-serif text-xl font-bold text-[#0F2E24]">
                  <Bath className="text-[#D9B93C]" /> {listing.bathrooms}
                </div>
              </div>
              <div className="w-px bg-gray-200 hidden md:block" />
              <div className="flex flex-col">
                <span className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Area</span>
                <div className="flex items-center gap-2 font-serif text-xl font-bold text-[#0F2E24]">
                  <Square className="text-[#D9B93C]" /> {listing.sizeSqm} sqm
                </div>
              </div>
              <div className="w-px bg-gray-200 hidden md:block" />
              <div className="flex flex-col">
                <span className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Listed</span>
                <div className="flex items-center gap-2 font-serif text-xl font-bold text-[#0F2E24]">
                  <Calendar className="text-[#D9B93C]" /> {new Date(listing.dateAdded).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                </div>
              </div>
            </div>

            <div className="mb-12">
              <h2 className="font-serif text-2xl font-bold text-[#0F2E24] mb-4">About this property</h2>
              <p className="whitespace-pre-line leading-relaxed text-gray-700 text-lg">{listing.description}</p>
            </div>

            <div className="mb-12">
              <h2 className="font-serif text-2xl font-bold text-[#0F2E24] mb-4">Features & Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {["Secure Compound", "Backup Generator", "Ample Parking", "Modern Kitchen", "Water Reserve Tank", "Paved Access Road"].map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 text-gray-700">
                    <Check size={18} className="text-[#1C4C3B]" /> <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-12">
              <h2 className="font-serif text-2xl font-bold text-[#0F2E24] mb-4">Location</h2>
              {listing.mapsUrl ? (
                <div className="space-y-4">
                  <div className="w-full rounded-sm overflow-hidden border border-gray-200 bg-gray-50 flex flex-col items-center justify-center py-10 gap-4">
                    <MapPin size={40} className="text-[#1C4C3B]" />
                    <div className="text-center">
                      <p className="font-semibold text-[#0F2E24] text-lg">{listing.neighborhood}, {listing.location}</p>
                      <p className="text-gray-500 text-sm mt-1">Addis Ababa, Ethiopia</p>
                    </div>
                    <a
                      href={listing.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-[#1C4C3B] text-white px-6 py-3 rounded-sm font-bold text-sm hover:bg-[#0F2E24] transition-colors shadow-md"
                    >
                      <MapPin size={16} />
                      View Exact Location on Google Maps
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
                <div className="w-full h-64 bg-gray-100 rounded-sm border border-gray-200 flex flex-col items-center justify-center text-gray-400">
                  <MapPin size={36} className="mb-3 text-[#1C4C3B]/30" />
                  <p className="font-medium">{listing.neighborhood}, {listing.location}</p>
                  <p className="text-sm mt-1">Exact map location not set</p>
                </div>
              )}
            </div>
          </div>

          {/* Inquiry Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-sm p-6 shadow-xl sticky top-28">
              <h3 className="font-serif text-xl font-bold text-[#0F2E24] mb-2">Interested in this property?</h3>
              <p className="text-gray-500 text-sm mb-6">Contact our sales team to schedule a viewing or request more information.</p>

              {submitted ? (
                <div className="bg-green-50 text-green-800 p-5 rounded-sm text-center border border-green-200">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 text-green-600"><Send size={20} /></div>
                  <h4 className="font-bold mb-1">Inquiry Sent!</h4>
                  <p className="text-sm">An agent will contact you shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                    <input required type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border border-gray-300 rounded-sm px-3 py-2 focus:outline-none focus:border-[#1C4C3B]" placeholder="Your name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                    <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full border border-gray-300 rounded-sm px-3 py-2 focus:outline-none focus:border-[#1C4C3B]" placeholder="you@example.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full border border-gray-300 rounded-sm px-3 py-2 focus:outline-none focus:border-[#1C4C3B]" placeholder="+251..." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                    <textarea required rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full border border-gray-300 rounded-sm px-3 py-2 focus:outline-none focus:border-[#1C4C3B]" />
                  </div>
                  {inquiry.isError && <p className="text-red-600 text-sm">Failed to send. Please try again.</p>}
                  <button type="submit" disabled={inquiry.isPending} className="w-full bg-[#1C4C3B] text-white px-4 py-3 rounded-sm font-bold flex items-center justify-center gap-2 hover:bg-[#0F2E24] transition-colors shadow-md disabled:opacity-60">
                    <Send size={18} /> {inquiry.isPending ? "Sending…" : "Send Inquiry"}
                  </button>
                </form>
              )}

              <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-center gap-4">
                <a href={`tel:${phone.replace(/\s/g, "")}`} onClick={() => trackEvent("cta_click", { button: "Call Now" })} className="text-[#1C4C3B] font-bold text-sm hover:underline flex items-center gap-1"><Phone size={14} /> Call Us</a>
                <span className="text-gray-300">|</span>
                <a href={`https://wa.me/${whatsappNum}`} onClick={() => trackEvent("cta_click", { button: "WhatsApp" })} target="_blank" rel="noreferrer" className="text-[#1C4C3B] font-bold text-sm hover:underline">WhatsApp</a>
              </div>
            </div>
          </div>
        </div>

        {relatedListings.length > 0 && (
          <div className="mt-24 pt-12 border-t border-gray-200">
            <h2 className="font-serif text-3xl font-bold text-[#0F2E24] mb-8">Similar Properties</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedListings.map((l) => <PropertyCard key={l.id} listing={l} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
