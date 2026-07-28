import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchListings } from "@/lib/api";
import { PropertyCard } from "@/components/PropertyCard";
import { SEO } from "@/components/SEO";
import { Search } from "lucide-react";

export default function Properties() {
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
    <div className="min-h-screen bg-[#FDFDF8] pt-24 pb-16">
      <SEO
        title="Properties in Addis Ababa — For Sale & Rent"
        description="Browse premium residential and commercial properties for sale and rent across Addis Ababa. Villas, apartments, office spaces and more from GIFT Real Estate."
        path="/properties"
      />

      <div className="bg-[#0F2E24] text-white py-12 mb-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Properties in Addis Ababa</h1>
          <p className="text-white/80 max-w-2xl mx-auto">
            Browse our exclusive portfolio of residential and commercial properties available for sale and rent.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-200 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Purpose</label>
              <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-sm px-4 py-2.5 text-[#14261F] focus:outline-none focus:border-[#1C4C3B]">
                <option value="all">Any (Sale & Rent)</option>
                <option value="sale">For Sale</option>
                <option value="rent">For Rent</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Location</label>
              <select value={filterLocation} onChange={(e) => setFilterLocation(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-sm px-4 py-2.5 text-[#14261F] focus:outline-none focus:border-[#1C4C3B]">
                <option value="all">All Areas</option>
                {uniqueLocations.map((loc) => (
                  <option key={loc} value={loc.toLowerCase()}>{loc}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Bedrooms</label>
              <select value={filterBeds} onChange={(e) => setFilterBeds(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-sm px-4 py-2.5 text-[#14261F] focus:outline-none focus:border-[#1C4C3B]">
                <option value="all">Any Beds</option>
                <option value="1">1 Bed</option>
                <option value="2">2 Beds</option>
                <option value="3">3 Beds</option>
                <option value="4+">4+ Beds</option>
              </select>
            </div>
            <div className="flex items-end">
              <button onClick={() => { setFilterType("all"); setFilterLocation("all"); setFilterBeds("all"); }} className="w-full border border-gray-300 text-gray-600 px-4 py-2.5 rounded-sm hover:bg-gray-50 transition-colors text-sm font-medium flex items-center justify-center gap-2">
                <Search size={16} /> Clear Filters
              </button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1,2,3,4,5,6].map((i) => <div key={i} className="h-80 bg-gray-100 rounded-sm animate-pulse" />)}
          </div>
        ) : filteredListings.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="text-lg font-medium">No properties found matching your filters.</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-6">{filteredListings.length} propert{filteredListings.length === 1 ? "y" : "ies"} found</p>
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
