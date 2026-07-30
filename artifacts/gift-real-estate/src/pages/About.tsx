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

      {/* Hero */}
      <div data-reveal className="bg-[#1A1A1A] text-white py-20 mb-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-20">
          <img src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1000" alt="Addis Ababa real estate" width={1000} height={600} loading="lazy" className="w-full h-full object-cover" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="font-serif text-5xl font-bold mb-6">{heroHeading}</h1>
          <p className="text-white/80 text-xl max-w-2xl font-light">{heroSubtext}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl">
        {/* Mission & Vision */}
        <div data-reveal className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
          <div className="bg-white p-10 border-t-4 border-[#E31E24] shadow-sm">
            <h2 className="font-serif text-3xl font-bold text-[#1A1A1A] mb-4">Our Mission</h2>
            <p className="text-gray-700 leading-relaxed text-lg">{mission}</p>
          </div>
          <div className="bg-white p-10 border-t-4 border-[#E31E24] shadow-sm">
            <h2 className="font-serif text-3xl font-bold text-[#1A1A1A] mb-4">Our Vision</h2>
            <p className="text-gray-700 leading-relaxed text-lg">{vision}</p>
          </div>
        </div>

        {/* History Timeline */}
        {milestones.length > 0 && (
          <div data-reveal className="mb-24">
            <h2 className="font-serif text-4xl font-bold text-[#1A1A1A] mb-12 text-center">Our History</h2>
            <div className="relative border-l-2 border-[#E31E24] ml-6 md:mx-auto md:w-0">
              {milestones.map((milestone, idx) => (
                <div key={idx} className={`relative mb-12 md:w-1/2 ${idx % 2 === 0 ? "md:ml-auto md:pl-10" : "md:mr-auto md:pr-10 md:text-right"} pl-8 md:pl-0`}>
                  <div className="absolute w-4 h-4 bg-[#E31E24] rounded-full top-2 -left-[9px] md:left-auto border-2 border-[#E31E24] z-10"
                       style={idx % 2 === 0 ? { left: "-9px" } : { right: "-9px" }} />
                  <span className="text-[#E31E24] font-bold text-xl block mb-1">{milestone.year}</span>
                  <h3 className="font-serif text-2xl font-bold text-[#1A1A1A] mb-2">{milestone.title}</h3>
                  <p className="text-gray-600">{milestone.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Leadership Team */}
        <div data-reveal className="mb-24">
          <div className="text-center mb-12">
            <p className="text-[#E31E24] font-bold tracking-widest uppercase text-sm mb-2">The People Behind GETAS</p>
            <h2 className="font-serif text-4xl font-bold text-[#1A1A1A]">Our Leadership Team</h2>
          </div>
          {agents.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1,2,3].map((i) => <div key={i} className="h-72 bg-gray-100 rounded-sm animate-pulse" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {agents.map((agent) => (
                <div key={agent.id} className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden group">
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={resolveImg(agent.image)}
                      alt={`${agent.name} — ${agent.role} at GETAS Real Estate`}
                      width={400} height={400}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-serif text-xl font-bold text-[#1A1A1A] mb-1">{agent.name}</h3>
                    <p className="text-[#E31E24] font-bold text-sm uppercase tracking-wider mb-4">{agent.role}</p>
                    <p className="text-gray-600 text-sm leading-relaxed mb-6">{agent.bio}</p>
                    <div className="flex flex-col gap-2 text-sm">
                      <a href={`tel:${agent.phone}`} className="flex items-center gap-2 text-[#E31E24] hover:underline">
                        <Phone size={14} /> {agent.phone}
                      </a>
                      <a href={`mailto:${agent.email}`} className="flex items-center gap-2 text-[#E31E24] hover:underline">
                        <Mail size={14} /> {agent.email}
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
