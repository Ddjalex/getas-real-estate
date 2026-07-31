import React, { useRef } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { fetchServices } from "@/lib/api";
import { ArrowRight, Layers } from "lucide-react";
import { SEO } from "@/components/SEO";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const BASE = import.meta.env.BASE_URL?.replace(/\/$/, "") ?? "";
const STORAGE_BASE = `${BASE}/api/storage`;

function resolveImageUrl(path: string) {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  if (path.startsWith("/objects/")) return `${STORAGE_BASE}${path}`;
  return path;
}

export default function Services() {
  const pageRef = useRef<HTMLDivElement>(null);
  useScrollReveal(pageRef);

  const { data: services = [], isLoading } = useQuery({
    queryKey: ["services"],
    queryFn: fetchServices,
  });

  return (
    <div ref={pageRef} className="min-h-screen bg-[#FFFFFF] pt-24 pb-20">
      <SEO
        title="Real Estate Services — GETAS Real Estate Addis Ababa"
        description="Comprehensive property sales, rentals, management and investment consultancy services from GETAS Real Estate, Addis Ababa's most trusted agency since 2005."
        path="/services"
      />

      {/* Page Hero */}
      <div data-reveal className="bg-[#1A1A1A] border-t-4 border-[#E31E24] py-14 mb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="h-0.5 w-12 bg-[#E31E24] mb-4" />
          <p className="text-[#E31E24] font-bold tracking-[0.2em] uppercase text-xs mb-3">WHAT WE DO</p>
          <h1 className="font-bold text-4xl md:text-5xl text-white tracking-tight mb-3">
            Comprehensive Real Estate Services
          </h1>
          <p className="text-white/60 text-base max-w-2xl">
            A full-service agency providing end-to-end solutions for buyers, sellers, landlords, and investors in Addis Ababa.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {[1,2,3,4,5,6].map((i) => (
              <div key={i} className="bg-white border border-gray-100 animate-pulse">
                <div className="aspect-[16/9] bg-gray-100" />
                <div className="p-8">
                  <div className="h-6 bg-gray-100 mb-4 w-3/4" />
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-100" />
                    <div className="h-4 bg-gray-100 w-5/6" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-20 text-gray-400 border border-gray-100 bg-gray-50">
            <Layers size={40} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg font-bold text-[#1A1A1A]">No services listed yet.</p>
          </div>
        ) : (
          <div data-reveal className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {services.map((service) => (
              <div key={service.id} className="bg-white border border-gray-100 hover:border-[#E31E24]/40 transition-all group overflow-hidden flex flex-col">
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
                  <div className="aspect-[16/9] bg-[#0D0D0D] flex items-center justify-center">
                    <Layers size={36} className="text-[#E31E24]/30" />
                  </div>
                )}
                <div className="p-8 flex flex-col flex-grow border-t-4 border-transparent group-hover:border-[#E31E24] transition-colors">
                  <h3 className="font-bold text-xl text-[#1A1A1A] mb-4 tracking-tight">{service.title}</h3>
                  <p className="text-gray-500 leading-relaxed mb-6 flex-grow text-sm">{service.description}</p>
                  <Link href="/contact" className="inline-flex items-center gap-2 text-[#E31E24] font-bold text-xs uppercase tracking-widest hover:gap-4 transition-all">
                    Enquire Now <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Process Section */}
        <div data-reveal className="bg-[#0D0D0D] border-t-4 border-[#E31E24] p-12 md:p-16 text-white">
          <div className="mb-10">
            <div className="h-0.5 w-12 bg-[#E31E24] mb-4" />
            <p className="text-[#E31E24] font-bold tracking-[0.2em] uppercase text-xs mb-3">HOW WE WORK</p>
            <h2 className="font-bold text-3xl md:text-4xl tracking-tight">The GETAS Experience</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-0">
            {[
              { step: "01", title: "Consultation", desc: "We sit down to understand your exact requirements, budget, and timeline." },
              { step: "02", title: "Curation", desc: "Our team selects a tailored portfolio of properties that match your criteria." },
              { step: "03", title: "Viewing", desc: "Accompanied tours of shortlisted properties with honest, expert insights." },
              { step: "04", title: "Closing", desc: "We handle negotiations, legal checks, and paperwork for a seamless handover." }
            ].map((process, i) => (
              <div key={i} className="relative py-8 px-6 border-l border-white/10 first:border-l-0 md:first:border-l-0">
                <div className="text-6xl font-bold text-[#E31E24]/20 mb-4 leading-none tracking-tight">{process.step}</div>
                <h4 className="font-bold text-lg text-white mb-3 tracking-tight">{process.title}</h4>
                <p className="text-white/50 text-sm leading-relaxed">{process.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
