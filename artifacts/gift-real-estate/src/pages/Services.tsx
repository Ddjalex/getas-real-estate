import React from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { fetchServices } from "@/lib/api";
import { ArrowRight, Layers } from "lucide-react";
import { SEO } from "@/components/SEO";

const BASE = import.meta.env.BASE_URL?.replace(/\/$/, "") ?? "";
const STORAGE_BASE = `${BASE}/api/storage`;

function resolveImageUrl(path: string) {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  if (path.startsWith("/objects/")) return `${STORAGE_BASE}${path}`;
  return path;
}

export default function Services() {
  const { data: services = [], isLoading } = useQuery({
    queryKey: ["services"],
    queryFn: fetchServices,
  });

  return (
    <div className="min-h-screen bg-[#FDFDF8] pt-24 pb-20">
      <SEO
        title="Real Estate Services — GIFT Real Estate Addis Ababa"
        description="Comprehensive property sales, rentals, management and investment consultancy services from GIFT Real Estate, Addis Ababa's most trusted agency since 1990."
        path="/services"
      />
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <span className="text-[#D9B93C] font-bold tracking-widest uppercase text-sm mb-3 block">What We Do</span>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#0F2E24] mb-6">Comprehensive Real Estate Services</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            A full-service agency providing end-to-end solutions for buyers, sellers, landlords, and investors in Addis Ababa.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
            {[1,2,3,4,5,6].map((i) => (
              <div key={i} className="bg-white p-8 rounded-sm shadow-sm border border-gray-100 animate-pulse">
                <div className="w-20 h-20 rounded-full bg-gray-100 mb-6" />
                <div className="h-6 bg-gray-100 rounded mb-4 w-3/4" />
                <div className="space-y-2">
                  <div className="h-4 bg-gray-100 rounded" />
                  <div className="h-4 bg-gray-100 rounded w-5/6" />
                  <div className="h-4 bg-gray-100 rounded w-4/6" />
                </div>
              </div>
            ))}
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Layers size={48} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg">No services listed yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
            {services.map((service) => (
              <div key={service.id} className="bg-white rounded-sm shadow-sm border border-gray-100 hover:shadow-xl hover:border-[#1C4C3B]/30 transition-all group overflow-hidden flex flex-col">
                {service.image ? (
                  <div className="aspect-[16/9] overflow-hidden">
                    <img
                      src={resolveImageUrl(service.image)}
                      alt={service.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <div className="aspect-[16/9] bg-[#0F2E24]/5 flex items-center justify-center">
                    <Layers size={40} className="text-[#1C4C3B]/30" />
                  </div>
                )}
                <div className="p-8 flex flex-col flex-grow">
                  <h3 className="font-serif text-2xl font-bold text-[#0F2E24] mb-4">{service.title}</h3>
                  <p className="text-gray-600 leading-relaxed mb-6 flex-grow">{service.description}</p>
                  <Link href="/contact" className="inline-flex items-center gap-2 text-[#1C4C3B] font-bold hover:text-[#D9B93C] transition-colors">
                    Enquire Now <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Process Section */}
        <div className="bg-[#0F2E24] rounded-sm p-12 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#D9B93C] rounded-full blur-[100px] opacity-20 -mr-20 -mt-20"></div>
          <div className="relative z-10">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-12 text-center">The GIFT Experience</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { step: "01", title: "Consultation", desc: "We sit down to understand your exact requirements, budget, and timeline." },
                { step: "02", title: "Curation", desc: "Our team selects a tailored portfolio of properties that match your criteria." },
                { step: "03", title: "Viewing", desc: "Accompanied tours of shortlisted properties with honest, expert insights." },
                { step: "04", title: "Closing", desc: "We handle negotiations, legal checks, and paperwork for a seamless handover." }
              ].map((process, i) => (
                <div key={i} className="text-center">
                  <div className="text-5xl font-serif font-black text-[#1C4C3B] mb-4 opacity-50">{process.step}</div>
                  <h4 className="font-bold text-xl text-[#D9B93C] mb-2">{process.title}</h4>
                  <p className="text-white/70 text-sm">{process.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
