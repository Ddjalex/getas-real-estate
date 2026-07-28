import React from "react";
import { Link } from "wouter";
import { listings } from "@/data/listings";
import { PropertyCard } from "@/components/PropertyCard";
import { Search, MapPin, Building2, ShieldCheck, Award, TrendingUp } from "lucide-react";

export default function Home() {
  const featuredListings = listings.filter((l) => l.featured).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#FDFDF8]">
      {/* Hero Section */}
      <section className="relative h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[#0F2E24]/60 mix-blend-multiply z-10" />
          <img
            src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1920"
            alt="Addis Ababa Real Estate"
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="container relative z-20 mx-auto px-4 text-center mt-16">
          <span className="inline-block px-4 py-1 border border-[#D9B93C] text-[#D9B93C] text-sm font-bold tracking-widest uppercase mb-6 rounded-sm backdrop-blur-sm bg-black/20">
            Est. 1990
          </span>
          <h1 className="font-serif text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg max-w-4xl mx-auto leading-tight">
            Addis Ababa's Most Trusted Real Estate Partner
          </h1>
          <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-light drop-shadow-md">
            Discover premium homes, luxury apartments, and prime commercial spaces with a legacy of 34 years of excellence.
          </p>

          {/* Search UI (Static) */}
          <div className="bg-white p-3 rounded-md shadow-2xl max-w-4xl mx-auto flex flex-col md:flex-row gap-3">
            <div className="flex-1 flex items-center border border-gray-200 rounded-sm px-4 py-3">
              <MapPin className="text-[#1C4C3B] mr-3" size={20} />
              <select className="w-full bg-transparent border-none text-[#14261F] focus:outline-none appearance-none font-medium">
                <option value="">Any Location (Bole, CMC...)</option>
                <option value="bole">Bole</option>
                <option value="cmc">CMC</option>
                <option value="sarbet">Sarbet</option>
              </select>
            </div>
            <div className="flex-1 flex items-center border border-gray-200 rounded-sm px-4 py-3">
              <Building2 className="text-[#1C4C3B] mr-3" size={20} />
              <select className="w-full bg-transparent border-none text-[#14261F] focus:outline-none appearance-none font-medium">
                <option value="">Property Type</option>
                <option value="villa">Villa / House</option>
                <option value="apartment">Apartment</option>
                <option value="commercial">Commercial</option>
              </select>
            </div>
            <Link
              href="/properties"
              className="bg-[#1C4C3B] text-white px-8 py-3 rounded-sm font-bold flex items-center justify-center gap-2 hover:bg-[#0F2E24] transition-colors"
            >
              <Search size={20} />
              Find Property
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Band */}
      <section className="bg-[#0F2E24] py-16 relative z-30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-white/10 text-center">
            <div className="px-4">
              <div className="text-4xl md:text-5xl font-serif font-bold text-[#D9B93C] mb-2">34+</div>
              <div className="text-white/80 text-sm font-medium tracking-wide uppercase">Years in Business</div>
            </div>
            <div className="px-4">
              <div className="text-4xl md:text-5xl font-serif font-bold text-[#D9B93C] mb-2">500+</div>
              <div className="text-white/80 text-sm font-medium tracking-wide uppercase">Properties Sold</div>
            </div>
            <div className="px-4">
              <div className="text-4xl md:text-5xl font-serif font-bold text-[#D9B93C] mb-2">1,200+</div>
              <div className="text-white/80 text-sm font-medium tracking-wide uppercase">Happy Clients</div>
            </div>
            <div className="px-4">
              <div className="text-4xl md:text-5xl font-serif font-bold text-[#D9B93C] mb-2">98%</div>
              <div className="text-white/80 text-sm font-medium tracking-wide uppercase">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-24 bg-[#FDFDF8]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-[#D9B93C] font-bold tracking-widest uppercase text-sm mb-3">Exclusive Listings</h2>
              <h3 className="font-serif text-4xl text-[#0F2E24] font-bold">Featured Properties</h3>
            </div>
            <Link
              href="/properties"
              className="inline-flex border-2 border-[#1C4C3B] text-[#1C4C3B] px-6 py-2 rounded-sm font-bold hover:bg-[#1C4C3B] hover:text-white transition-colors"
            >
              View All Properties
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredListings.map((listing) => (
              <PropertyCard key={listing.id} listing={listing} />
            ))}
          </div>
        </div>
      </section>

      {/* Why GIFT Section */}
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-[#D9B93C] font-bold tracking-widest uppercase text-sm mb-3">Why Choose Us</h2>
            <h3 className="font-serif text-4xl text-[#0F2E24] font-bold mb-6">The GIFT Difference</h3>
            <p className="text-gray-600 text-lg">
              Since 1990, we have been the standard-bearers for quality, transparency, and trust in the Ethiopian real estate market.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto bg-[#FDFDF8] border border-[#1C4C3B]/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-[#1C4C3B] transition-colors duration-300">
                <Award size={32} className="text-[#1C4C3B] group-hover:text-[#D9B93C] transition-colors" />
              </div>
              <h4 className="font-serif text-xl font-bold text-[#0F2E24] mb-3">Decades of Experience</h4>
              <p className="text-gray-600">With 34 years of localized knowledge, we understand the nuances of every neighborhood in Addis Ababa.</p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto bg-[#FDFDF8] border border-[#1C4C3B]/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-[#1C4C3B] transition-colors duration-300">
                <ShieldCheck size={32} className="text-[#1C4C3B] group-hover:text-[#D9B93C] transition-colors" />
              </div>
              <h4 className="font-serif text-xl font-bold text-[#0F2E24] mb-3">Absolute Transparency</h4>
              <p className="text-gray-600">Clear title deeds, honest appraisals, and straightforward legal processes for peace of mind.</p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 mx-auto bg-[#FDFDF8] border border-[#1C4C3B]/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-[#1C4C3B] transition-colors duration-300">
                <TrendingUp size={32} className="text-[#1C4C3B] group-hover:text-[#D9B93C] transition-colors" />
              </div>
              <h4 className="font-serif text-xl font-bold text-[#0F2E24] mb-3">Investment Focused</h4>
              <p className="text-gray-600">We guide diaspora and local buyers toward properties that offer maximum rental yield and capital appreciation.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-[#0F2E24] text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-[#D9B93C] font-bold tracking-widest uppercase text-sm mb-3">Client Stories</h2>
            <h3 className="font-serif text-4xl font-bold">Trusted by Thousands</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Dr. Samuel T.",
                role: "Diaspora Investor, USA",
                text: "Buying property from abroad is daunting. GIFT handled everything—from viewing to title transfer—with utmost professionalism. I now own a beautiful villa in CMC."
              },
              {
                name: "Hanna M.",
                role: "Homeowner, Bole",
                text: "The team at GIFT didn't just sell us a house; they found us a home. Their knowledge of Bole's micro-neighborhoods is unmatched."
              },
              {
                name: "Elias K.",
                role: "Business Owner",
                text: "We leased our corporate headquarters through GIFT. The negotiation was transparent and the space exactly met our demanding specifications."
              }
            ].map((testimonial, i) => (
              <div key={i} className="bg-white/5 border border-white/10 p-8 rounded-sm">
                <div className="flex text-[#D9B93C] mb-6">
                  {[...Array(5)].map((_, j) => <span key={j}>★</span>)}
                </div>
                <p className="text-white/90 italic mb-6 leading-relaxed">"{testimonial.text}"</p>
                <div>
                  <div className="font-bold font-serif text-lg text-white">{testimonial.name}</div>
                  <div className="text-[#D9B93C] text-sm">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-24 bg-[#D9B93C] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10">
          {/* Abstract pattern placeholder */}
          <svg viewBox="0 0 100 100" className="w-full h-full fill-current"><circle cx="50" cy="50" r="40"/></svg>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#0F2E24] mb-6">
            Ready to find your dream property?
          </h2>
          <p className="text-[#0F2E24]/80 text-lg mb-10 max-w-2xl mx-auto font-medium">
            Speak with one of our senior agents today for a personalized consultation on the Addis Ababa real estate market.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-[#0F2E24] text-white px-10 py-4 rounded-sm font-bold text-lg hover:bg-white hover:text-[#0F2E24] transition-colors shadow-xl"
          >
            Book a Consultation
          </Link>
        </div>
      </section>
    </div>
  );
}
