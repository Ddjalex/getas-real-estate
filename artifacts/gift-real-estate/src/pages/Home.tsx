import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useQuery } from "@tanstack/react-query";
import { fetchListings, fetchHeroSlides, fetchSiteSettings, type HeroSlide } from "@/lib/api";
import { PropertyCard } from "@/components/PropertyCard";
import { SEO, localBusinessJsonLd, trackEvent } from "@/components/SEO";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Award, MapPin, ShieldCheck, TrendingUp, Building2, ArrowRight, Search } from "lucide-react";

const STORAGE_BASE = `${import.meta.env.BASE_URL?.replace(/\/$/, "") ?? ""}/api/storage`;
const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1920";

function resolveSlideUrl(path: string) {
  if (!path) return FALLBACK_IMAGE;
  if (path.startsWith("http")) return path;
  if (path.startsWith("/objects/")) return `${STORAGE_BASE}${path}`;
  return path;
}

function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((c) => {
        const next = (c + 1) % slides.length;
        setPrev(c);
        setTransitioning(true);
        setTimeout(() => { setPrev(null); setTransitioning(false); }, 900);
        return next;
      });
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const images = slides.length > 0 ? slides : [{ id: 0, imageUrl: FALLBACK_IMAGE, caption: "", displayOrder: 0, active: true, createdAt: "" }];

  return (
    <>
      {prev !== null && (
        <img
          key={`prev-${prev}`}
          src={resolveSlideUrl(images[prev].imageUrl)}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: transitioning ? 0 : 1, transition: "opacity 900ms ease-in-out" }}
          onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK_IMAGE; }}
        />
      )}
      <img
        key={`curr-${current}`}
        src={resolveSlideUrl(images[current].imageUrl)}
        alt={images[current].caption || "GETAS Real Estate"}
        className="absolute inset-0 w-full h-full object-cover ken-burns"
        style={{ opacity: 1, transition: "opacity 900ms ease-in-out" }}
        onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK_IMAGE; }}
      />
      {images.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => { setPrev(current); setCurrent(i); setTransitioning(true); setTimeout(() => { setPrev(null); setTransitioning(false); }, 900); }}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? "bg-[#E31E24] w-8" : "bg-white/50 w-2 hover:bg-white/80"}`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </>
  );
}

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { target: 21,   suffix: "+", label: "Years in Real Estate" },
  { target: 500,  suffix: "+", label: "Properties Delivered" },
  { target: 1200, suffix: "+", label: "Happy Clients" },
  { target: 98,   suffix: "%", label: "Satisfaction Rate" },
];

function formatStat(val: number) {
  const rounded = Math.round(val);
  if (rounded >= 1000) {
    const thousands = Math.floor(rounded / 1000);
    const hundreds  = String(rounded % 1000).padStart(3, "0");
    return `${thousands},${hundreds}`;
  }
  return `${rounded}`;
}

export default function Home() {
  const [, setLocation] = useLocation();
  const [searchMode, setSearchMode] = useState<"buy" | "rent">("buy");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    trackEvent("hero_search", { mode: searchMode, query: searchQuery });
    const params = new URLSearchParams();
    params.set("type", searchMode === "buy" ? "sale" : "rent");
    if (searchQuery.trim()) params.set("q", searchQuery.trim());
    setLocation(`/properties?${params.toString()}`);
  };

  const { data: allListings = [], isLoading } = useQuery({
    queryKey: ["listings"],
    queryFn: () => fetchListings(),
  });
  const { data: heroSlides = [] } = useQuery({
    queryKey: ["hero-slides"],
    queryFn: fetchHeroSlides,
  });
  const { data: settings } = useQuery({
    queryKey: ["site-settings"],
    queryFn: fetchSiteSettings,
    staleTime: 5 * 60 * 1000,
  });
  const featuredListings = allListings.filter((l) => l.featured).slice(0, 3);

  const homeRef       = useRef<HTMLDivElement>(null);
  const whySectionRef = useRef<HTMLElement>(null);
  const statRefs      = useRef<(HTMLDivElement | null)[]>([]);

  // Bidirectional scroll-reveal for [data-reveal] elements (animates on scroll down AND reverses on scroll up)
  useScrollReveal(homeRef);

  useEffect(() => {
    if (!homeRef.current) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      homeRef.current.querySelectorAll<HTMLElement>(
        ".hero-overline, .hero-headline, .hero-subline, .hero-ctas, " +
        ".section-enter, .property-card, .why-item, .cta-content, .featured-header"
      ).forEach((el) => {
        el.style.opacity   = "1";
        el.style.transform = "none";
      });
      statRefs.current.forEach((el, i) => {
        if (el) el.textContent = formatStat(STATS[i].target);
      });
      return;
    }

    const ctx = gsap.context(() => {
      const root = homeRef.current!;
      const q = <T extends Element>(sel: string) => gsap.utils.toArray<T>(sel, root);

      // Centered hero entrance — stagger elements up from below
      gsap.from(q(".hero-overline"),  { opacity: 0, y: -16, duration: 0.7, ease: "power2.out", delay: 0.3 });
      gsap.from(q(".hero-headline"),  { opacity: 0, y: 40,  duration: 1.1, ease: "power3.out", delay: 0.5 });
      gsap.from(q(".hero-subline"),   { opacity: 0, y: 28,  duration: 0.9, ease: "power2.out", delay: 0.85 });
      gsap.from(q(".hero-ctas"),      { opacity: 0, y: 24,  duration: 0.9, ease: "power2.out", delay: 1.1 });

      q<HTMLElement>(".section-enter").forEach((section) => {
        gsap.fromTo(section, { opacity: 0, y: 40 }, {
          opacity: 1, y: 0, ease: "none",
          scrollTrigger: { trigger: section, start: "top 88%", end: "top 30%", scrub: 1.2 },
        });
      });

      const cards = q<HTMLElement>(".property-card");
      if (cards.length) {
        gsap.from(cards, {
          opacity: 0, y: 44, scale: 0.96, duration: 0.9, stagger: 0.12, ease: "power2.out",
          scrollTrigger: { trigger: cards[0], start: "top 85%" },
        });
      }

      gsap.from(q(".featured-header"), {
        opacity: 0, x: -40, duration: 1, ease: "power2.out",
        scrollTrigger: { trigger: q(".featured-header")[0], start: "top 85%" },
      });

      const whySection = whySectionRef.current;
      const whyItems   = q<HTMLElement>(".why-item");
      const isMobile   = window.innerWidth < 768;

      if (!isMobile && whySection && whyItems.length) {
        gsap.set(whyItems, { opacity: 0, y: 48 });
        ScrollTrigger.create({
          trigger: whySection, start: "top top", end: "+=560", pin: true,
          onEnter: () => { gsap.to(whyItems, { opacity: 1, y: 0, duration: 0.9, stagger: 0.18, ease: "power2.out" }); },
        });
      } else if (whyItems.length) {
        gsap.from(whyItems, {
          opacity: 0, y: 36, duration: 0.8, stagger: 0.15, ease: "power2.out",
          scrollTrigger: { trigger: whyItems[0], start: "top 82%" },
        });
      }

      statRefs.current.forEach((el, i) => {
        if (!el) return;
        const stat  = STATS[i];
        const proxy = { val: 0 };
        gsap.from(el, { scale: 0.7, opacity: 0, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 85%", once: true } });
        gsap.to(proxy, {
          val: stat.target, duration: 1.8, ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
          onStart() { el.textContent = `0`; },
          onUpdate() { el.textContent = formatStat(proxy.val); },
        });
      });

      gsap.from(q(".cta-content"), { opacity: 0, y: 32, duration: 1, ease: "power2.out", scrollTrigger: { trigger: q(".cta-content")[0], start: "top 85%" } });

      document.fonts.ready.then(() => ScrollTrigger.refresh());
      window.addEventListener("load", () => ScrollTrigger.refresh(), { once: true });
      const timer = setTimeout(() => ScrollTrigger.refresh(), 600);
      return () => clearTimeout(timer);
    }, homeRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={homeRef} className="min-h-screen bg-[#FFFFFF]">
      <SEO
        path="/"
        jsonLd={localBusinessJsonLd()}
      />

      {/* Hero — Full-viewport */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background image/slider */}
        <div className="absolute inset-0 z-0">
          <HeroSlider slides={heroSlides} />
        </div>

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/55 z-10" />

        {/* Centered content */}
        <div className="relative z-20 container mx-auto px-6 text-center max-w-4xl pt-16 pb-20">
          <p className="hero-overline text-[#E31E24] text-xs font-bold tracking-[0.35em] uppercase mb-4">
            ESTABLISHED · ADDIS ABABA · 2005
          </p>

          <h1 className="hero-headline font-bold text-white text-4xl md:text-5xl lg:text-6xl leading-[1.05] mb-4 tracking-tight">
            Built to International Standards.<br className="hidden md:block" /> For 21 Years.
          </h1>

          <p className="hero-subline text-white/75 text-base md:text-lg leading-relaxed mb-7 max-w-2xl mx-auto hidden sm:block">
            A division of Get-As International Plc. — delivering luxury villas, apartments, and commercial developments across Addis Ababa since 2005.
          </p>

          {/* Buy / Rent toggle + search */}
          <div className="hero-ctas flex flex-col items-center gap-3 w-full max-w-2xl mx-auto">
            {/* Toggle */}
            <div className="flex bg-white/15 backdrop-blur-sm rounded-full p-1 gap-1">
              <button
                type="button"
                onClick={() => setSearchMode("buy")}
                className={`px-8 py-2.5 rounded-full font-bold text-sm tracking-wide transition-all duration-200 ${
                  searchMode === "buy"
                    ? "bg-[#1A1A1A] text-white shadow-md"
                    : "text-white hover:text-white/80"
                }`}
              >
                Buy
              </button>
              <button
                type="button"
                onClick={() => setSearchMode("rent")}
                className={`px-8 py-2.5 rounded-full font-bold text-sm tracking-wide transition-all duration-200 ${
                  searchMode === "rent"
                    ? "bg-[#1A1A1A] text-white shadow-md"
                    : "text-white hover:text-white/80"
                }`}
              >
                Rent
              </button>
            </div>

            {/* Search bar */}
            <form onSubmit={handleSearch} className="flex w-full rounded-lg overflow-hidden shadow-xl bg-white/95 backdrop-blur-sm">
              <div className="flex items-center pl-4 text-[#1A1A1A]/40 shrink-0">
                <Search size={18} />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by city, neighborhood, or property type..."
                className="flex-1 py-4 px-3 text-[#1A1A1A] text-sm bg-transparent outline-none placeholder:text-[#1A1A1A]/40"
              />
              <button
                type="submit"
                className="bg-[#1A1A1A] text-white px-7 py-4 font-bold text-sm tracking-wide hover:bg-[#E31E24] transition-colors shrink-0"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </section>


      {/* Featured Listings */}
      {(isLoading || featuredListings.length > 0) && (
        <section className="section-enter py-24 bg-[#F5F5F5]">
          <div className="container mx-auto px-4">
            <div className="featured-header mb-12">
              <div className="h-0.5 w-12 bg-[#E31E24] mb-4" />
              <p className="text-[#E31E24] font-bold tracking-[0.2em] uppercase text-xs mb-3">HANDPICKED FOR YOU</p>
              <div className="flex items-end justify-between">
                <h2 className="font-bold text-4xl md:text-5xl text-[#1A1A1A] tracking-tight">Featured Properties</h2>
                <Link href="/properties" className="hidden md:flex items-center gap-2 text-[#1A1A1A] font-bold text-sm tracking-wider uppercase hover:text-[#E31E24] transition-colors">
                  VIEW ALL <ArrowRight size={18} />
                </Link>
              </div>
            </div>
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1,2,3].map((i) => <div key={i} className="h-80 bg-white animate-pulse" />)}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {featuredListings.map((listing) => (
                  <PropertyCard key={listing.id} listing={listing} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* CTA Banner — image background with red fade */}
      <section className="section-enter relative overflow-hidden min-h-[460px] flex items-center">
        {/* Background image */}
        <img
          src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1400&q=80"
          alt="GETAS Real Estate — Addis Ababa Properties"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Red gradient: solid on left, fades to transparent ~60% across */}
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to right, #E31E24 0%, #E31E24 42%, rgba(227,30,36,0.85) 52%, rgba(227,30,36,0.3) 65%, transparent 80%)" }}
        />
        {/* On mobile: full red overlay so text stays readable */}
        <div className="absolute inset-0 bg-[#E31E24]/80 lg:hidden" />

        {/* Content */}
        <div className="cta-content relative z-10 container mx-auto px-10 md:px-16 py-20 max-w-2xl mr-auto">
          <div className="h-px w-12 bg-[#1A1A1A]/30 mb-8" />
          <h2 className="font-bold text-4xl md:text-5xl text-[#1A1A1A] mb-5 tracking-tight leading-[1.05]">
            Ready to Find<br />Your Property?
          </h2>
          <p className="text-[#1A1A1A]/70 text-base max-w-md mb-10 leading-relaxed">
            Whether you're buying, renting, or investing, our expert team is ready to guide you every step of the way.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/contact"
              onClick={() => trackEvent("cta_click", { button: "Book a Visit" })}
              className="bg-[#1A1A1A] text-white px-9 py-4 font-bold text-sm tracking-widest uppercase hover:bg-white hover:text-[#1A1A1A] transition-colors inline-flex items-center justify-center gap-2"
            >
              BOOK A VISIT <ArrowRight size={15} />
            </Link>
            <Link
              href="/properties"
              className="border-2 border-[#1A1A1A] text-[#1A1A1A] px-9 py-4 font-bold text-sm tracking-widest uppercase hover:bg-[#1A1A1A] hover:text-white transition-colors inline-flex items-center justify-center"
            >
              BROWSE PROPERTIES
            </Link>
          </div>
        </div>
      </section>

      {/* Why GETAS */}
      <section ref={whySectionRef} className="section-enter bg-[#1A1A1A] py-24 relative overflow-hidden">
        {/* Decorative watermark */}
        <div className="absolute right-[-2rem] top-1/2 -translate-y-1/2 text-white/[0.025] font-bold text-[18rem] leading-none select-none pointer-events-none">
          21+
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="mb-14">
            <div className="h-0.5 w-12 bg-[#E31E24] mb-4" />
            <p className="text-[#E31E24] font-bold tracking-[0.2em] uppercase text-xs mb-3">OUR COMMITMENT</p>
            <h2 className="font-bold text-4xl md:text-5xl text-white tracking-tight">Why Choose GETAS</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2">
            {[
              { num: "01", icon: <Award size={32} className="text-[#E31E24]" />, title: "21+ Years in Real Estate", desc: "Part of Get-As International Plc., delivering quality developments across Ethiopia since 2005." },
              { num: "02", icon: <MapPin size={32} className="text-[#E31E24]" />, title: "Local Expertise", desc: "Deep knowledge of Addis Ababa — from Kazanchis to Bole — and each neighborhood's investment potential." },
              { num: "03", icon: <ShieldCheck size={32} className="text-[#E31E24]" />, title: "Verified Developments", desc: "Every property is built and vetted to meet international standards with full legal compliance." },
              { num: "04", icon: <TrendingUp size={32} className="text-[#E31E24]" />, title: "Long-Term Value", desc: "We develop properties — luxury apartments, commercial spaces, mixed-use — that generate lasting returns." },
            ].map((item, i) => (
              <div
                key={i}
                className={`why-item flex gap-6 items-start py-10 px-6 border-b border-white/10 hover:bg-white/[0.025] transition-colors
                  ${i % 2 === 0 ? 'md:border-r md:border-r-white/10 md:pr-12' : 'md:pl-12'}
                  ${i >= 2 ? 'md:border-b-0' : ''}`}
              >
                <div className="shrink-0 text-[#E31E24]/20 font-bold text-6xl leading-none w-16 text-right mt-1">
                  {item.num}
                </div>
                <div className="flex-1">
                  <div className="mb-4 p-2.5 bg-[#E31E24]/10 inline-block">{item.icon}</div>
                  <h3 className="font-bold text-xl text-white mb-3 tracking-tight">{item.title}</h3>
                  <p className="text-white/55 leading-relaxed text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Properties by Type */}
      <section className="section-enter bg-[#F5F5F5] py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="h-0.5 w-12 bg-[#E31E24] mb-4 mx-auto" />
            <p className="text-[#E31E24] font-bold tracking-[0.2em] uppercase text-xs mb-3">EXPLORE BY CATEGORY</p>
            <h2 className="font-bold text-4xl md:text-5xl text-[#1A1A1A] tracking-tight mb-3">
              All Ethiopian Properties by Type
            </h2>
            <p className="text-[#1A1A1A]/55 text-base max-w-lg mx-auto">
              Browse our diverse selection of real estate properties in Ethiopia
            </p>
          </div>

          {(() => {
            const ALL_PROP_TYPES = [
              { label: "Houses",     value: "house",     img: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&q=70" },
              { label: "Apartments", value: "apartment", img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=70" },
              { label: "Villas",     value: "villa",     img: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&q=70" },
              { label: "Condos",     value: "condo",     img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=70" },
              { label: "Townhouses", value: "townhouse", img: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&q=70" },
              { label: "Land",       value: "land",      img: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=70" },
            ];
            const visible = ALL_PROP_TYPES
              .map((pt) => ({
                ...pt,
                count: allListings.filter((l) =>
                  (l.propertyType ?? "").toLowerCase() === pt.value ||
                  // fallback: keyword match title/description for legacy listings without propertyType
                  (!(l.propertyType) && (
                    l.title.toLowerCase().includes(pt.value) ||
                    (l.description ?? "").toLowerCase().includes(pt.value)
                  ))
                ).length,
              }))
              .filter((pt) => isLoading || pt.count > 0);

            if (!isLoading && visible.length === 0) return null;

            const cols = visible.length <= 3
              ? `grid-cols-${visible.length} md:grid-cols-${visible.length}`
              : "grid-cols-2 md:grid-cols-3 lg:grid-cols-6";

            return (
              <div className={`grid ${cols} gap-4`}>
                {(isLoading ? ALL_PROP_TYPES.map(pt => ({ ...pt, count: 0 })) : visible).map(({ label, value, img, count }, idx) => (
                  <div key={value} data-reveal style={{ transitionDelay: `${idx * 60}ms` }}>
                    <Link
                      href={`/properties?q=${value}`}
                      className="group relative overflow-hidden rounded-lg aspect-[3/4] block shadow-md hover:shadow-xl transition-shadow duration-300"
                    >
                      <img
                        src={img}
                        alt={`${label} in Ethiopia`}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <p className="text-white font-bold text-sm leading-snug mb-1">
                          {label} for Sale in Ethiopia
                        </p>
                        <p className="text-white/65 text-xs">{count} propert{count === 1 ? "y" : "ies"}</p>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      </section>

      {/* Explore Addis Ababa Subcities — dynamic: only shows locations that have listings */}
      {(() => {
        // Static descriptions for known Addis Ababa subcities
        const SUBCITY_META: Record<string, string> = {
          "bole":             "Vibrant commercial district with many shopping, dining, and entertainment options.",
          "yeka":             "Residential area with breathtaking views of the city.",
          "arada":            "Historic center with vibrant markets and cultural attractions.",
          "lideta":           "Family-friendly neighborhood with convenient amenities.",
          "kolfe keraniyo":   "Diverse area with both residential and commercial properties.",
          "nifas silk lafto": "Growing district with new developments and amenities.",
          "kirkos":           "Central location with business districts and government offices.",
          "addis ketema":     "Bustling area with markets and transportation hubs.",
          "gulele":           "Scenic northern district blending greenery with urban living.",
          "akaky kaliti":     "Rapidly expanding industrial and residential suburb.",
        };

        // Derive unique subcities from actual listings, sorted by count desc
        const countByLocation = allListings.reduce<Record<string, number>>((acc, l) => {
          const key = l.location?.trim();
          if (key) acc[key] = (acc[key] ?? 0) + 1;
          return acc;
        }, {});

        const subcities = Object.entries(countByLocation)
          .map(([name, count]) => ({
            name,
            count,
            description:
              SUBCITY_META[name.toLowerCase()] ??
              `Explore ${count} propert${count === 1 ? "y" : "ies"} available in ${name}.`,
          }))
          .sort((a, b) => b.count - a.count);

        if (subcities.length === 0) return null;

        return (
          <section className="section-enter bg-white py-24 border-t border-gray-100">
            <div className="container mx-auto px-4">
              {/* Header */}
              <div className="text-center mb-12">
                <div className="h-0.5 w-12 bg-[#E31E24] mb-4 mx-auto" />
                <p className="text-[#E31E24] font-bold tracking-[0.2em] uppercase text-xs mb-3">DISCOVER YOUR AREA</p>
                <h2 className="font-bold text-4xl md:text-5xl text-[#1A1A1A] tracking-tight mb-3">
                  Explore Addis Ababa Subcities
                </h2>
                <p className="text-[#1A1A1A]/55 text-base max-w-2xl mx-auto">
                  Discover properties in Addis Ababa's diverse subcities, each offering unique living experiences and investment opportunities.
                </p>
              </div>

              {/* Subcity cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                {subcities.map(({ name, count, description }) => (
                  <Link
                    key={name}
                    href={`/properties?location=${encodeURIComponent(name)}`}
                    className="group border border-gray-200 rounded-lg p-6 hover:border-[#E31E24] hover:shadow-md transition-all duration-200 bg-white"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <MapPin size={18} className="text-[#E31E24] shrink-0 mt-0.5" />
                      <h3 className="font-bold text-[#1A1A1A] text-base group-hover:text-[#E31E24] transition-colors leading-snug">
                        {name}
                      </h3>
                    </div>
                    <p className="text-[#1A1A1A]/55 text-sm leading-relaxed mb-4">{description}</p>
                    <p className="text-xs font-bold text-[#E31E24] tracking-wide">
                      {count} propert{count === 1 ? "y" : "ies"} →
                    </p>
                  </Link>
                ))}
              </div>

              {/* View all link */}
              <div className="text-center">
                <Link
                  href="/properties"
                  className="inline-flex items-center gap-2 text-[#1A1A1A] font-bold text-sm underline underline-offset-4 hover:text-[#E31E24] transition-colors tracking-wide"
                >
                  View All Locations <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </section>
        );
      })()}
    </div>
  );
}
