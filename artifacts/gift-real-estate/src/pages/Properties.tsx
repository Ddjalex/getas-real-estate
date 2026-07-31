import React, { useState, useMemo, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchListings } from "@/lib/api";
import { PropertyCard } from "@/components/PropertyCard";
import { SEO } from "@/components/SEO";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function Properties() {
  const pageRef = useRef<HTMLDivElement>(null);
  useScrollReveal(pageRef);

  const [filterType, setFilterType]         = useState<string>("all");
  const [filterLocation, setFilterLocation] = useState<string>("all");
  const [filterBeds, setFilterBeds]         = useState<string>("all");
  const [searchQuery, setSearchQuery]       = useState<string>("");

  // Read URL params set by the hero search / Buy-Rent toggle
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const type   = params.get("type");
    const q      = params.get("q");
    if (type === "sale" || type === "rent") setFilterType(type);
    if (q) setSearchQuery(q);
  }, []);

  const { data: listings = [], isLoading } = useQuery({
    queryKey: ["listings"],
    queryFn: () => fetchListings(),
  });

  const uniqueLocations = useMemo(
    () => Array.from(new Set(listings.map((l) => l.location))).sort(),
    [listings]
  );

  const filteredListings = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return listings.filter((listing) => {
      const matchType     = filterType === "all" || listing.type === filterType;
      const matchLocation = filterLocation === "all" || listing.location.toLowerCase() === filterLocation;
      const matchBeds     = filterBeds === "all" || (filterBeds === "4+" ? listing.bedrooms >= 4 : listing.bedrooms.toString() === filterBeds);
      const matchQuery    = !q || [listing.title, listing.location, listing.neighborhood, listing.description]
        .some((f) => f?.toLowerCase().includes(q));
      return matchType && matchLocation && matchBeds && matchQuery;
    });
  }, [listings, filterType, filterLocation, filterBeds, searchQuery]);

  const clearAll = () => {
    setFilterType("all");
    setFilterLocation("all");
    setFilterBeds("all");
    setSearchQuery("");
  };

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
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Text search */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Search</label>
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="City, neighborhood, type…"
                  className="w-full bg-[#1A1A1A] border border-white/10 pl-9 pr-8 py-2.5 text-white text-sm focus:outline-none focus:border-[#E31E24] transition-colors placeholder:text-white/30"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white">
                    <X size={13} />
                  </button>
                )}
              </div>
            </div>

            {/* Purpose */}
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

            {/* Location */}
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

            {/* Bedrooms */}
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
          </div>

          {/* Active filters / clear */}
          {(filterType !== "all" || filterLocation !== "all" || filterBeds !== "all" || searchQuery) && (
            <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/10">
              <span className="text-white/40 text-xs uppercase tracking-wider">Active filters:</span>
              {filterType !== "all" && (
                <span className="bg-[#E31E24]/20 text-[#E31E24] text-xs px-3 py-1 font-bold">
                  {filterType === "sale" ? "For Sale" : "For Rent"}
                </span>
              )}
              {filterLocation !== "all" && (
                <span className="bg-white/10 text-white text-xs px-3 py-1">{filterLocation}</span>
              )}
              {filterBeds !== "all" && (
                <span className="bg-white/10 text-white text-xs px-3 py-1">{filterBeds} beds</span>
              )}
              {searchQuery && (
                <span className="bg-white/10 text-white text-xs px-3 py-1">"{searchQuery}"</span>
              )}
              <button
                onClick={clearAll}
                className="ml-auto text-white/40 hover:text-white text-xs uppercase tracking-wider flex items-center gap-1 transition-colors"
              >
                <X size={12} /> Clear all
              </button>
            </div>
          )}
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
