import React, { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAgents, fetchSiteSettings } from "@/lib/api";
import { SEO, localBusinessJsonLd } from "@/components/SEO";
import { Mail, Phone } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const BASE = import.meta.env.BASE_URL?.replace(/\/$/, "") ?? "";
const STORAGE_BASE = `${BASE}/api/storage`;
function resolveImg(path: string) {
  if (!path) return path;
  if (path.startsWith("http")) return path;
  if (path.startsWith("/objects/")) return `${STORAGE_BASE}${path}`;
  return path;
}

type Milestone = { year: string; title: string; desc: string };

const DEFAULT_HERO_HEADING = "About GETAS Real Estate";
const DEFAULT_HERO_SUBTEXT =
  "A division of Get-As International Plc., bringing over 20 years of real estate expertise to Addis Ababa. We deliver high-quality residential, commercial, and mixed-use developments that shape the city's modern skyline.";
const DEFAULT_MISSION =
  "To deliver high-quality residential, commercial, and mixed-use developments that meet international standards while reflecting local needs. We are committed to transparency, ethical practices, and long-term value creation for families, businesses, and investors across Ethiopia.";
const DEFAULT_VISION =
  "To be East Africa's most trusted real estate developer — building communities where quality housing and modern commercial infrastructure are accessible, sustainable, and built to world-class standards. We envision a modernized Addis Ababa shaped by integrity and innovation.";
const DEFAULT_MILESTONES: Milestone[] = [
  { year: "1994", title: "Foundation", desc: "Get-As International Plc. established in Addis Ababa by two brothers with a shared vision of entrepreneurship and growth." },
  { year: "2005", title: "Real Estate Division", desc: "GET-As entered real estate development, backed by the technical and material support of Dugda Construction and sister companies." },
  { year: "2015", title: "Commercial Expansion", desc: "Expanded into premium commercial and mixed-use developments, serving businesses, NGOs, and corporations across Addis Ababa." },
  { year: "2024", title: "Luxury Living", desc: "Delivered landmark luxury apartment projects at Kazanchis and Summit 72, setting a new benchmark for urban living in Ethiopia." },
];

export default function About() {
  const pageRef = useRef<HTMLDivElement>(null);
  useScrollReveal(pageRef);

  const { data: agents = [] } = useQuery({
    queryKey: ["agents"],
    queryFn: fetchAgents,
  });

  const { data: settings } = useQuery({
    queryKey: ["site-settings"],
    queryFn: fetchSiteSettings,
    staleTime: 5 * 60 * 1000,
  });

  const heroHeading = settings?.about_hero_heading || DEFAULT_HERO_HEADING;
  const heroSubtext = settings?.about_hero_subtext || DEFAULT_HERO_SUBTEXT;
  const mission = settings?.about_mission || DEFAULT_MISSION;
  const vision = settings?.about_vision || DEFAULT_VISION;

  let milestones: Milestone[] = DEFAULT_MILESTONES;
  if (settings?.about_milestones) {
    try { milestones = JSON.parse(settings.about_milestones); } catch { /* keep defaults */ }
  }

  return (
    <div ref={pageRef} className="min-h-screen bg-[#FFFFFF] pt-24 pb-20">
      <SEO
        title="About GETAS Real Estate — 20+ Years of Excellence in Addis Ababa"
        description="A division of Get-As International Plc., GETAS Real Estate has been delivering premium residential and commercial properties across Addis Ababa since 2005."
        path="/about"
        jsonLd={localBusinessJsonLd()}
      />

      {/* Hero — Split structural layout */}
      <div data-reveal className="bg-[#1A1A1A] border-t-4 border-[#E31E24] mb-0 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img
            src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1400"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10 py-20">
          <div className="max-w-3xl">
            <div className="h-0.5 w-12 bg-[#E31E24] mb-4" />
            <p className="text-[#E31E24] font-bold tracking-[0.2em] uppercase text-xs mb-4">GET-AS INTERNATIONAL PLC. · EST. 1994</p>
            <h1 className="font-bold text-5xl md:text-6xl text-white tracking-tight leading-[1.05] mb-6">{heroHeading}</h1>
            <p className="text-white/60 text-lg max-w-2xl leading-relaxed">{heroSubtext}</p>
          </div>
        </div>
      </div>

      {/* Mission & Vision — dark structural blocks */}
      <div data-reveal className="bg-[#0D0D0D] py-16 mb-0">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            <div className="p-10 md:p-12 border-r border-white/5">
              <div className="h-1 w-10 bg-[#E31E24] mb-6" />
              <h2 className="font-bold text-3xl text-white tracking-tight mb-5">Our Mission</h2>
              <p className="text-white/60 leading-relaxed text-base">{mission}</p>
            </div>
            <div className="p-10 md:p-12">
              <div className="h-1 w-10 bg-[#E31E24] mb-6" />
              <h2 className="font-bold text-3xl text-white tracking-tight mb-5">Our Vision</h2>
              <p className="text-white/60 leading-relaxed text-base">{vision}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl">
        {/* History Timeline */}
        {milestones.length > 0 && (
          <div data-reveal className="py-20 border-b border-gray-100">
            <div className="mb-12">
              <div className="h-0.5 w-12 bg-[#E31E24] mb-4" />
              <p className="text-[#E31E24] font-bold tracking-[0.2em] uppercase text-xs mb-3">SINCE 1994</p>
              <h2 className="font-bold text-4xl text-[#1A1A1A] tracking-tight">Our History</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0">
              {milestones.map((milestone, idx) => (
                <div key={idx} className="border-l-2 border-[#E31E24]/20 pl-8 pr-6 py-6 hover:border-[#E31E24] transition-colors group">
                  <span className="text-[#E31E24] font-bold text-3xl block mb-2 tracking-tight">{milestone.year}</span>
                  <h3 className="font-bold text-lg text-[#1A1A1A] mb-3 tracking-tight group-hover:text-[#E31E24] transition-colors">{milestone.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{milestone.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Leadership Team */}
        <div data-reveal className="py-20">
          <div className="mb-12">
            <div className="h-0.5 w-12 bg-[#E31E24] mb-4" />
            <p className="text-[#E31E24] font-bold tracking-[0.2em] uppercase text-xs mb-3">THE PEOPLE BEHIND GETAS</p>
            <h2 className="font-bold text-4xl text-[#1A1A1A] tracking-tight">Our Leadership Team</h2>
          </div>
          {agents.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1,2,3].map((i) => <div key={i} className="h-72 bg-gray-100 animate-pulse" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {agents.map((agent) => (
                <div key={agent.id} className="bg-white border border-gray-100 overflow-hidden group hover:border-[#E31E24]/30 transition-colors">
                  <div className="aspect-square overflow-hidden bg-gray-100">
                    <img
                      src={resolveImg(agent.image)}
                      alt={`${agent.name} — ${agent.role} at GETAS Real Estate`}
                      width={400} height={400}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6 border-t-4 border-transparent group-hover:border-[#E31E24] transition-colors">
                    <h3 className="font-bold text-xl text-[#1A1A1A] mb-1 tracking-tight">{agent.name}</h3>
                    <p className="text-[#E31E24] font-bold text-xs uppercase tracking-widest mb-4">{agent.role}</p>
                    <p className="text-gray-500 text-sm leading-relaxed mb-5">{agent.bio}</p>
                    <div className="flex flex-col gap-2 text-sm pt-4 border-t border-gray-100">
                      <a href={`tel:${agent.phone}`} className="flex items-center gap-2 text-[#1A1A1A] hover:text-[#E31E24] transition-colors font-medium text-xs">
                        <Phone size={12} className="text-[#E31E24]" /> {agent.phone}
                      </a>
                      <a href={`mailto:${agent.email}`} className="flex items-center gap-2 text-[#1A1A1A] hover:text-[#E31E24] transition-colors font-medium text-xs">
                        <Mail size={12} className="text-[#E31E24]" /> {agent.email}
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
