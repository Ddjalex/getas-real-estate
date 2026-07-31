import React, { useState, useMemo, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchListings } from "@/lib/api";
import { PropertyCard } from "@/components/PropertyCard";
import { SEO } from "@/components/SEO";
import { Search, SlidersHorizontal } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function Properties() {
  const pageRef = useRef<HTMLDivElement>(null);
  useScrollReveal(pageRef);

  const [filterType, setFilterType] = useState<string>("all");
  const [filterLocation, setFilterLocation] = useState<string>("all");
  const [filterBeds, setFilterBeds] = useState<string>("all");

  const { data: listings = [], isLoading } = useQuery({
    queryKey: ["listings"],
    queryFn: () => fetchListings(),
  });

  const uniqueLocations = useMemo(
    () => Array.from(new Set(listings.map((l) => l.location))).sort(),
    [listings]
  );

  const filteredListings = useMemo(() => {
    return listings.filter((listing) => {
      const matchType = filterType === "all" || listing.type === filterType;
      const matchLocation = filterLocation === "all" || listing.location.toLowerCase() === filterLocation;
      const matchBeds = filterBeds === "all" || (filterBeds === "4+" ? listing.bedrooms >= 4 : listing.bedrooms.toString() === filterBeds);
      return matchType && matchLocation && matchBeds;
    });
  }, [listings, filterType, filterLocation, filterBeds]);

  return (
    <div ref={pageRef} className="min-h-screen bg-[#FFFFFF] pt-24 pb-16">
      <SEO
        title="Properties in Addis Ababa — For Sale & Rent"
        description="Browse premium residential and commercial properties for sale and rent across Addis Ababa. Villas, apartments, office spaces and more from GETAS Real Estate."
        path="/properties"
      />

      {/* Page Hero */}
      <div data-reveal className="bg-[#1A1A1A] text-white py-14 mb-12 border-t-4 border-[#E31E24]">
        <div className="container mx-auto px-4">
          <div className="h-0.5 w-12 bg-[#E31E24] mb-4" />
          <p className="text-[#E31E24] font-bold tracking-[0.2em] uppercase text-xs mb-3">BROWSE OUR PORTFOLIO</p>
          <h1 className="font-bold text-4xl md:text-5xl text-white tracking-tight mb-3">
            Properties in Addis Ababa
          </h1>
          <p className="text-white/60 max-w-2xl text-base">
            Browse our exclusive portfolio of residential and commercial properties available for sale and rent.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Filter Bar */}
        <div data-reveal className="bg-[#0D0D0D] p-6 mb-10 border-l-4 border-[#E31E24]">
          <div className="flex items-center gap-3 mb-5">
            <SlidersHorizontal size={16} className="text-[#E31E24]" />
            <span className="text-white text-xs font-bold tracking-[0.2em] uppercase">Filter Properties</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Purpose</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full bg-[#1A1A1A] border border-white/10 px-4 py-2.5 text-white focus:outline-none focus:border-[#E31E24] transition-colors appearance-none"
              >
                <option value="all">Any (Sale & Rent)</option>
                <option value="sale">For Sale</option>
                <option value="rent">For Rent</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Location</label>
              <select
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
                className="w-full bg-[#1A1A1A] border border-white/10 px-4 py-2.5 text-white focus:outline-none focus:border-[#E31E24] transition-colors appearance-none"
              >
                <option value="all">All Areas</option>
                {uniqueLocations.map((loc) => (
                  <option key={loc} value={loc.toLowerCase()}>{loc}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Bedrooms</label>
              <select
                value={filterBeds}
                onChange={(e) => setFilterBeds(e.target.value)}
                className="w-full bg-[#1A1A1A] border border-white/10 px-4 py-2.5 text-white focus:outline-none focus:border-[#E31E24] transition-colors appearance-none"
              >
                <option value="all">Any Beds</option>
                <option value="1">1 Bed</option>
                <option value="2">2 Beds</option>
                <option value="3">3 Beds</option>
                <option value="4+">4+ Beds</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => { setFilterType("all"); setFilterLocation("all"); setFilterBeds("all"); }}
                className="w-full border border-white/20 text-white/70 px-4 py-2.5 hover:bg-white/5 hover:text-white transition-colors text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2"
              >
                <Search size={14} /> Clear Filters
              </button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1,2,3,4,5,6].map((i) => <div key={i} className="h-80 bg-gray-100 animate-pulse" />)}
          </div>
        ) : filteredListings.length === 0 ? (
          <div className="text-center py-20 text-gray-500 border border-gray-100 bg-gray-50">
            <p className="text-lg font-bold text-[#1A1A1A] mb-2">No properties found</p>
            <p className="text-sm">Try adjusting your filters above.</p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-4 w-1 bg-[#E31E24]" />
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                {filteredListings.length} Propert{filteredListings.length === 1 ? "y" : "ies"} Found
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredListings.map((listing) => (
                <PropertyCard key={listing.id} listing={listing} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
