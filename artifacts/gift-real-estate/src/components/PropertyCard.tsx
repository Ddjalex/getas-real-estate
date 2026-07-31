import React from "react";
import { Link } from "wouter";
import type { Listing } from "@/lib/api";
import { Bed, Bath, Square, MapPin, ArrowRight } from "lucide-react";

interface PropertyCardProps {
  listing: Listing;
}

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800";

function resolveImage(path: string | undefined): string {
  if (!path) return FALLBACK_IMAGE;
  if (path.startsWith("http")) return path;
  const BASE = import.meta.env.BASE_URL?.replace(/\/$/, "") ?? "";
  if (path.startsWith("/objects/")) return `${BASE}/api/storage${path}`;
  if (path.startsWith("/uploads/")) return `${BASE}/api${path}`;
  return path;
}

export function PropertyCard({ listing }: PropertyCardProps) {
  const priceNum = typeof listing.price === "string" ? parseFloat(listing.price) : listing.price;
  const formattedPrice = listing.type === "rent"
    ? `ETB ${new Intl.NumberFormat("en-ET").format(priceNum)}/mo`
    : `ETB ${new Intl.NumberFormat("en-ET").format(priceNum)}`;

  return (
    <div className="property-card group bg-white overflow-hidden border border-gray-200 hover:border-[#E31E24] transition-all duration-300 flex flex-col md:flex-row">
      {/* Image — Left side on desktop, top on mobile */}
      <Link href={`/properties/${listing.id}`} className="block relative overflow-hidden md:w-2/5 aspect-[4/3] md:aspect-auto bg-[#1A1A1A]">
        <img
          src={resolveImage(listing.images?.[0])}
          alt={listing.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
          onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK_IMAGE; }}
        />
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {listing.status && (
            <span className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest shadow-sm ${
              listing.status === "Featured" || listing.status === "New" 
                ? "bg-[#E31E24] text-white" 
                : "bg-[#1A1A1A] text-white"
            }`}>
              {listing.status}
            </span>
          )}
          <span className="bg-white text-[#1A1A1A] px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest shadow-sm">
            {listing.type === "sale" ? "For Sale" : "For Rent"}
          </span>
        </div>
      </Link>
      
      {/* Details — Right side on desktop, bottom on mobile */}
      <div className="p-6 md:w-3/5 flex flex-col justify-between">
        {/* Top section */}
        <div>
          {/* Price */}
          <div className="font-bold text-2xl md:text-3xl text-[#E31E24] mb-3 tracking-tight">{formattedPrice}</div>
          
          {/* Title */}
          <h3 className="font-bold text-xl text-[#1A1A1A] mb-2 line-clamp-1 group-hover:text-[#E31E24] transition-colors tracking-tight">
            <Link href={`/properties/${listing.id}`}>{listing.title}</Link>
          </h3>
          
          {/* Location */}
          <div className="flex items-center gap-2 text-gray-600 text-sm mb-4">
            <MapPin size={16} className="text-[#E31E24]" />
            <span>{listing.neighborhood}, {listing.location}</span>
          </div>
        </div>

        {/* Bottom section — Specs & CTA */}
        <div>
          <div className="flex items-center gap-4 py-4 border-t border-gray-200 mb-4">
            {listing.bedrooms > 0 && (
              <div className="flex items-center gap-2 text-gray-600">
                <Bed size={18} className="text-[#1A1A1A]" />
                <span className="text-sm font-semibold">{listing.bedrooms}</span>
              </div>
            )}
            {listing.bathrooms > 0 && (
              <div className="flex items-center gap-2 text-gray-600">
                <Bath size={18} className="text-[#1A1A1A]" />
                <span className="text-sm font-semibold">{listing.bathrooms}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-gray-600">
              <Square size={18} className="text-[#1A1A1A]" />
              <span className="text-sm font-semibold">{listing.sizeSqm} sqm</span>
            </div>
          </div>
          
          {/* View Property Link */}
          <Link 
            href={`/properties/${listing.id}`}
            className="flex items-center gap-2 text-[#1A1A1A] font-bold text-xs tracking-[0.15em] uppercase hover:text-[#E31E24] transition-colors"
          >
            VIEW PROPERTY <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
