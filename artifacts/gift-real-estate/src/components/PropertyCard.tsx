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
    <div className="property-card group bg-white overflow-hidden border border-gray-200 hover:border-[#E31E24] hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex flex-col">
      {/* Image — full width on top */}
      <Link href={`/properties/${listing.id}`} className="block relative overflow-hidden aspect-[4/3] bg-[#1A1A1A] flex-shrink-0">
        <img
          src={resolveImage(listing.images?.[0])}
          alt={listing.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
          onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK_IMAGE; }}
        />
        {/* Badges — top-left corner */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {listing.status && (
            <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest shadow-sm rounded-sm ${
              listing.status === "Featured" || listing.status === "New"
                ? "bg-[#E31E24] text-white"
                : "bg-[#1A1A1A] text-white"
            }`}>
              {listing.status}
            </span>
          )}
          <span className="bg-white text-[#1A1A1A] px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest shadow-sm rounded-sm">
            {listing.type === "sale" ? "For Sale" : "For Rent"}
          </span>
        </div>
      </Link>

      {/* Details — stacked below image */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Price */}
        <div className="font-bold text-xl text-[#E31E24] mb-2 tracking-tight">{formattedPrice}</div>

        {/* Title */}
        <h3 className="font-bold text-lg text-[#1A1A1A] mb-2 line-clamp-1 group-hover:text-[#E31E24] transition-colors leading-snug">
          <Link href={`/properties/${listing.id}`}>{listing.title}</Link>
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-4">
          <MapPin size={14} className="text-[#E31E24] flex-shrink-0" />
          <span className="line-clamp-1">{listing.neighborhood}, {listing.location}</span>
        </div>

        {/* Specs */}
        <div className="flex items-center gap-4 py-3 border-t border-gray-100 mb-4 mt-auto">
          {listing.bedrooms > 0 && (
            <div className="flex items-center gap-1.5 text-gray-600">
              <Bed size={16} className="text-[#1A1A1A]" />
              <span className="text-sm font-semibold">{listing.bedrooms}</span>
            </div>
          )}
          {listing.bathrooms > 0 && (
            <div className="flex items-center gap-1.5 text-gray-600">
              <Bath size={16} className="text-[#1A1A1A]" />
              <span className="text-sm font-semibold">{listing.bathrooms}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 text-gray-600">
            <Square size={16} className="text-[#1A1A1A]" />
            <span className="text-sm font-semibold">{listing.sizeSqm} sqm</span>
          </div>
        </div>

        {/* CTA */}
        <Link
          href={`/properties/${listing.id}`}
          className="flex items-center gap-2 text-[#1A1A1A] font-bold text-xs tracking-[0.15em] uppercase hover:text-[#E31E24] transition-colors"
        >
          VIEW PROPERTY <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
