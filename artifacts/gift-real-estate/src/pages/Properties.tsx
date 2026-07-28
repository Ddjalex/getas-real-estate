import React, { useState, useMemo } from "react";
import { listings } from "@/data/listings";
import { PropertyCard } from "@/components/PropertyCard";
import { Search } from "lucide-react";

export default function Properties() {
  const [filterType, setFilterType] = useState<string>("all");
  const [filterLocation, setFilterLocation] = useState<string>("all");
  const [filterBeds, setFilterBeds] = useState<string>("all");

  const filteredListings = useMemo(() => {
    return listings.filter((listing) => {
      const matchType = filterType === "all" || listing.type === filterType;
      // Simple location string match
      const matchLocation = filterLocation === "all" || listing.location.toLowerCase() === filterLocation;
      const matchBeds = filterBeds === "all" || (filterBeds === "4+" ? listing.bedrooms >= 4 : listing.bedrooms.toString() === filterBeds);
      
      return matchType && matchLocation && matchBeds;
    });
  }, [filterType, filterLocation, filterBeds]);

  // Extract unique locations for the dropdown
  const uniqueLocations = Array.from(new Set(listings.map(l => l.location))).sort();

  return (
    <div className="min-h-screen bg-[#FDFDF8] pt-24 pb-16">
      <div className="bg-[#0F2E24] text-white py-12 mb-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Properties in Addis Ababa</h1>
          <p className="text-white/80 max-w-2xl mx-auto">
            Browse our exclusive portfolio of residential and commercial properties available for sale and rent.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Filter Bar */}
        <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-200 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Purpose</label>
              <select 
                value={filterType} 
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-sm px-4 py-2.5 text-[#14261F] focus:outline-none focus:border-[#1C4C3B]"
              >
                <option value="all">Any (Sale & Rent)</option>
                <option value="sale">For Sale</option>
                <option value="rent">For Rent</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Location</label>
              <select 
                value={filterLocation} 
                onChange={(e) => setFilterLocation(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-sm px-4 py-2.5 text-[#14261F] focus:outline-none focus:border-[#1C4C3B]"
              >
                <option value="all">All Areas</option>
                {uniqueLocations.map(loc => (
                  <option key={loc} value={loc.toLowerCase()}>{loc}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Bedrooms</label>
              <select 
                value={filterBeds} 
                onChange={(e) => setFilterBeds(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-sm px-4 py-2.5 text-[#14261F] focus:outline-none focus:border-[#1C4C3B]"
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
                className="w-full bg-[#1C4C3B] text-white px-6 py-2.5 rounded-sm font-bold flex items-center justify-center gap-2 hover:bg-[#0F2E24] transition-colors"
                onClick={() => { /* Filters apply instantly via state, this is just visual */ }}
              >
                <Search size={18} />
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-serif font-bold text-[#0F2E24]">
            Showing {filteredListings.length} {filteredListings.length === 1 ? 'Property' : 'Properties'}
          </h2>
        </div>

        {/* Listings Grid */}
        {filteredListings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredListings.map((listing) => (
              <PropertyCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white border border-dashed border-gray-300 rounded-sm">
            <h3 className="font-serif text-2xl font-bold text-gray-400 mb-2">No properties found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your filters to see more results.</p>
            <button 
              onClick={() => { setFilterType('all'); setFilterLocation('all'); setFilterBeds('all'); }}
              className="text-[#1C4C3B] font-bold underline hover:text-[#D9B93C]"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
