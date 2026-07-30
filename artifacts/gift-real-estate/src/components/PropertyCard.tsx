import React from "react";
import { Link } from "wouter";
import type { Listing } from "@/lib/api";
import { Bed, Bath, Square, MapPin } from "lucide-react";

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
    <div className="group bg-white rounded-md overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
      <Link href={`/properties/${listing.id}`} className="block relative overflow-hidden aspect-[4/3] bg-[#1A1A1A]">
        <img
          src={resolveImage(listing.images?.[0])}
          alt={listing.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
          onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK_IMAGE; }}
        />
        <div className="absolute top-4 left-4 flex gap-2">
          {listing.status && (
            <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-sm shadow-sm ${
              listing.status === "Featured" || listing.status === "New" 
                ? "bg-[#E31E24] text-[#1A1A1A]" 
                : "bg-[#1A1A1A] text-white"
            }`}>
              {listing.status}
            </span>
          )}
          <span className="bg-white/90 backdrop-blur-sm text-[#1A1A1A] px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-sm shadow-sm">
            {listing.type === "sale" ? "For Sale" : "For Rent"}
          </span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <p className="text-white font-serif text-2xl font-bold">{formattedPrice}</p>
        </div>
      </Link>
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-2">
          <MapPin size={16} className="text-[#E31E24]" />
          <span>{listing.neighborhood}, {listing.location}</span>
        </div>
        
        <h3 className="font-serif text-xl font-bold text-[#1A1A1A] mb-4 line-clamp-1 group-hover:text-[#E31E24] transition-colors">
          <Link href={`/properties/${listing.id}`}>{listing.title}</Link>
        </h3>
        
        <div className="grid grid-cols-3 gap-2 py-4 border-t border-gray-100 mt-auto">
          {listing.bedrooms > 0 && (
            <div className="flex items-center gap-2 text-gray-600">
              <Bed size={18} className="text-[#E31E24]" />
              <span className="text-sm font-medium">{listing.bedrooms} Beds</span>
            </div>
          )}
          {listing.bathrooms > 0 && (
            <div className="flex items-center gap-2 text-gray-600">
              <Bath size={18} className="text-[#E31E24]" />
              <span className="text-sm font-medium">{listing.bathrooms} Baths</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-gray-600">
            <Square size={18} className="text-[#E31E24]" />
            <span className="text-sm font-medium">{listing.sizeSqm} sqm</span>
          </div>
        </div>
      </div>
    </div>
  );
}
