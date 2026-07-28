import React from "react";
import { agents } from "@/data/agents";
import { Mail, Phone } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-[#FDFDF8] pt-24 pb-20">
      {/* Hero */}
      <div className="bg-[#0F2E24] text-white py-20 mb-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-20">
          <img src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1000" alt="Addis Ababa" className="w-full h-full object-cover" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="font-serif text-5xl font-bold mb-6">About GIFT Real Estate</h1>
          <p className="text-white/80 text-xl max-w-2xl font-light">
            Building Ethiopia’s future since 1990. We are more than a real estate agency; we are architects of communities and custodians of trust.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl">
        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
          <div className="bg-white p-10 border-t-4 border-[#1C4C3B] shadow-sm">
            <h2 className="font-serif text-3xl font-bold text-[#0F2E24] mb-4">Our Mission</h2>
            <p className="text-gray-700 leading-relaxed text-lg">
              To provide unparalleled real estate services in Ethiopia through transparency, ethical practices, and deep local expertise. We strive to connect families with their dream homes and investors with lucrative opportunities, contributing to the structural and economic growth of Addis Ababa.
            </p>
          </div>
          <div className="bg-white p-10 border-t-4 border-[#D9B93C] shadow-sm">
            <h2 className="font-serif text-3xl font-bold text-[#0F2E24] mb-4">Our Vision</h2>
            <p className="text-gray-700 leading-relaxed text-lg">
              To remain the most trusted, respected, and innovative real estate institution in East Africa. We envision a modernized Addis Ababa where quality housing and commercial infrastructure are accessible, sustainable, and built to world-class standards.
            </p>
          </div>
        </div>

        {/* History Timeline */}
        <div className="mb-24">
          <h2 className="font-serif text-4xl font-bold text-[#0F2E24] mb-12 text-center">34 Years of Excellence</h2>
          <div className="relative border-l-2 border-[#D9B93C] ml-6 md:mx-auto md:w-0">
            {[
              { year: "1990", title: "Foundation", desc: "GIFT Real Estate established in Addis Ababa with a small office in Piazza." },
              { year: "2002", title: "First Mega Project", desc: "Successfully completed and delivered a 50-villa complex in CMC, setting a new standard for gated communities." },
              { year: "2015", title: "Commercial Expansion", desc: "Launched the commercial real estate division, managing premium office spaces in Bole and Kazanchis." },
              { year: "2024", title: "Modern Era", desc: "Celebrating over three decades of trust with a portfolio of over 1,200 managed and sold properties." }
            ].map((milestone, idx) => (
              <div key={idx} className={`relative mb-12 md:w-1/2 ${idx % 2 === 0 ? "md:ml-auto md:pl-10" : "md:mr-auto md:pr-10 md:text-right"} pl-8 md:pl-0`}>
                <div className="absolute w-4 h-4 bg-[#1C4C3B] rounded-full top-2 -left-[9px] md:left-auto border-2 border-[#D9B93C] z-10" 
                     style={idx % 2 === 0 ? { left: "-9px" } : { right: "-9px" }} />
                <span className="text-[#D9B93C] font-bold text-xl block mb-1">{milestone.year}</span>
                <h3 className="font-serif text-2xl font-bold text-[#0F2E24] mb-2">{milestone.title}</h3>
                <p className="text-gray-600">{milestone.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Leadership Team */}
        <div>
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl font-bold text-[#0F2E24] mb-4">Meet Our Experts</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our team consists of industry veterans who bring decades of experience, integrity, and local knowledge to every transaction.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {agents.map((agent) => (
              <div key={agent.id} className="bg-white border border-gray-100 rounded-sm overflow-hidden group shadow-sm hover:shadow-xl transition-shadow">
                <div className="aspect-square overflow-hidden bg-gray-100">
                  <img 
                    src={agent.image} 
                    alt={agent.name} 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-serif text-xl font-bold text-[#0F2E24] mb-1">{agent.name}</h3>
                  <p className="text-[#1C4C3B] font-medium text-sm mb-4">{agent.role}</p>
                  <p className="text-gray-600 text-sm mb-6 line-clamp-3">{agent.bio}</p>
                  <div className="pt-4 border-t border-gray-100 space-y-2">
                    <a href={`tel:${agent.phone}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#1C4C3B]">
                      <Phone size={16} className="text-[#D9B93C]" /> {agent.phone}
                    </a>
                    <a href={`mailto:${agent.email}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#1C4C3B]">
                      <Mail size={16} className="text-[#D9B93C]" /> {agent.email}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
