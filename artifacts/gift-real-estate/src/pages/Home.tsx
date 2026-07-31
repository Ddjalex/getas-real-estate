import React, { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useQuery } from "@tanstack/react-query";
import { fetchListings, fetchHeroSlides, fetchSiteSettings, type HeroSlide } from "@/lib/api";
import { PropertyCard } from "@/components/PropertyCard";
import { SEO, localBusinessJsonLd, trackEvent } from "@/components/SEO";
import { Award, MapPin, ShieldCheck, TrendingUp, Building2, ArrowRight } from "lucide-react";

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
      {/* Previous slide (fades out) */}
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

      {/* Current slide (fades in) */}
      <img
        key={`curr-${current}`}
        src={resolveSlideUrl(images[current].imageUrl)}
        alt={images[current].caption || "GETAS Real Estate"}
        className="absolute inset-0 w-full h-full object-cover ken-burns"
        style={{ opacity: 1, transition: "opacity 900ms ease-in-out" }}
        onError={(e) => { (e.currentTarget as HTMLImageElement).src = FALLBACK_IMAGE; }}
      />

      {/* Dot indicators (only if >1 slide) */}
      {images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => { setPrev(current); setCurrent(i); setTransitioning(true); setTimeout(() => { setPrev(null); setTransitioning(false); }, 900); }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${i === current ? "bg-[#E31E24] w-5" : "bg-white/50 hover:bg-white/80"}`}
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
  { target: 21,   suffix: "+", label: "Years in Real Estate", unit: "YEARS" },
  { target: 500,  suffix: "+", label: "Properties Delivered", unit: "PROPERTIES" },
  { target: 1200, suffix: "+", label: "Happy Clients", unit: "CLIENTS" },
  { target: 98,   suffix: "%", label: "Satisfaction Rate", unit: "SATISFACTION" },
];

function formatStat(val: number, suffix: string) {
  const rounded = Math.round(val);
  if (rounded >= 1000) {
    const thousands = Math.floor(rounded / 1000);
    const hundreds  = String(rounded % 1000).padStart(3, "0");
    return `${thousands},${hundreds}`;
  }
  return `${rounded}`;
}

export default function Home() {
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
  const phone = settings?.phone || "";
  const featuredListings = allListings.filter((l) => l.featured).slice(0, 3);

  const homeRef       = useRef<HTMLDivElement>(null);
  const whySectionRef = useRef<HTMLElement>(null);
  const statRefs      = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!homeRef.current) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      homeRef.current.querySelectorAll<HTMLElement>(
        ".hero-left-panel, .hero-right-panel, .hero-overline, .hero-headline, .hero-subline, .hero-ctas, " +
        ".section-enter, .property-card, .why-item, .cta-content, .featured-header"
      ).forEach((el) => {
        el.style.opacity   = "1";
        el.style.transform = "none";
      });
      statRefs.current.forEach((el, i) => {
        if (el) el.textContent = formatStat(STATS[i].target, STATS[i].suffix);
      });
      return;
    }

    const ctx = gsap.context(() => {
      const root = homeRef.current!;
      const q = <T extends Element>(sel: string) => gsap.utils.toArray<T>(sel, root);

      // Split-screen hero entrance
      gsap.from(q(".hero-left-panel"), { x: -80, opacity: 0, duration: 1.2, ease: "power3.out", delay: 0.1 });
      gsap.from(q(".hero-right-panel"), { x: 80, opacity: 0, duration: 1.2, ease: "power3.out", delay: 0.1 });
      gsap.from(q(".hero-overline"), { opacity: 0, y: -20, duration: 0.8, ease: "power2.out", delay: 0.4 });
      gsap.from(q(".hero-headline"), { opacity: 0, y: 30, duration: 1.0, ease: "power3.out", delay: 0.6 });
      gsap.from(q(".hero-subline"), { opacity: 0, y: 24, duration: 0.9, ease: "power2.out", delay: 0.9 });
      gsap.from(q(".hero-ctas"), { opacity: 0, y: 28, duration: 0.9, ease: "power2.out", delay: 1.1 });

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
          onUpdate() { el.textContent = formatStat(proxy.val, stat.suffix); },
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

      {/* Hero — Split Screen Layout */}
      <section className="relative min-h-[85vh] flex flex-col md:flex-row overflow-hidden">
        {/* LEFT PANEL — Dark brand panel */}
        <div className="hero-left-panel relative bg-[#1A1A1A] w-full md:w-1/2 flex items-center justify-center p-8 md:p-12 diagonal-split-left border-t-4 border-[#E31E24]">
          <div className="max-w-xl w-full">
            {/* Red accent bar */}
            <div className="h-1 w-16 bg-[#E31E24] mb-6"></div>
            
            {/* Overline */}
            <p className="hero-overline text-white/60 text-xs font-bold tracking-[0.3em] uppercase mb-6 leading-relaxed">
              ESTABLISHED · ADDIS ABABA · 2005
            </p>

            {/* Headline */}
            <h1 className="hero-headline font-bold text-white text-4xl md:text-5xl lg:text-6xl leading-[1.1] mb-6 tracking-tight">
              Built to International Standards. For 21 Years.
            </h1>
            {/* Alternative headlines (commented for future use):
            <h1 className="hero-headline font-bold text-white text-4xl md:text-5xl lg:text-6xl leading-[1.1] mb-6 tracking-tight">
              Addis Ababa's Premier Developer, Since 2005.
            </h1>
            <h1 className="hero-headline font-bold text-white text-4xl md:text-5xl lg:text-6xl leading-[1.1] mb-6 tracking-tight">
              Part of Get-As International. Built to Last.
            </h1>
            */}

            {/* Subline */}
            <p className="hero-subline text-white/70 text-base md:text-lg leading-relaxed mb-10 max-w-md">
              A division of Get-As International Plc. — delivering luxury villas, apartments, and commercial developments across Addis Ababa since 2005.
            </p>

            {/* CTAs */}
            <div className="hero-ctas flex flex-col sm:flex-row gap-4">
              <Link
                href="/properties"
                onClick={() => trackEvent("cta_click", { button: "View All Properties" })}
                className="bg-[#E31E24] text-white px-8 py-4 font-bold text-xs tracking-[0.2em] uppercase hover:bg-white hover:text-[#1A1A1A] transition-colors flex items-center justify-center gap-3"
              >
                VIEW PROPERTIES <ArrowRight size={18} />
              </Link>
              {phone && (
                <a
                  href={`tel:${phone.replace(/\s/g, "")}`}
                  onClick={() => trackEvent("cta_click", { button: "Call Now" })}
                  className="border-2 border-white/30 text-white px-8 py-4 font-bold text-xs tracking-[0.2em] uppercase hover:bg-white hover:text-[#1A1A1A] hover:border-white transition-colors flex items-center justify-center"
                >
                  CALL NOW
                </a>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL — Architectural image */}
        <div className="hero-right-panel relative bg-black w-full md:w-1/2 min-h-[50vh] md:min-h-full diagonal-split-right overflow-hidden">
          <HeroSlider slides={heroSlides} />
          <div className="absolute inset-0 bg-black/30 z-10" />
        </div>
      </section>

      {/* Stats — Horizontal strip with dividers */}
      <section className="section-enter bg-[#0D0D0D] py-16 border-t-2 border-[#E31E24]/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
            {STATS.map((stat, i) => (
              <div key={i} className="text-center px-6 py-4 relative">
                {i > 0 && (
                  <div className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 h-20 w-[1px] bg-[#E31E24]/30" />
                )}
                <div className="flex items-baseline justify-center gap-2 mb-2">
                  <div ref={(el) => { statRefs.current[i] = el; }} className="font-bold text-5xl md:text-6xl text-white tracking-tight">
                    0
                  </div>
                  <span className="text-[#E31E24] font-bold text-2xl md:text-3xl">{stat.suffix}</span>
                </div>
                <div className="text-white/50 text-xs uppercase tracking-[0.25em] font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Listings — hidden entirely when no featured properties exist */}
      {(isLoading || featuredListings.length > 0) && (
        <section className="section-enter py-24 bg-[#F5F5F5]">
          <div className="container mx-auto px-4">
            <div className="featured-header mb-12">
              <div className="h-0.5 w-12 bg-[#E31E24] mb-4"></div>
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

      {/* Why GETAS — Brick-offset grid layout */}
      <section ref={whySectionRef} className="section-enter bg-[#1A1A1A] py-24">
        <div className="container mx-auto px-4">
          <div className="mb-16">
            <div className="h-0.5 w-12 bg-[#E31E24] mb-4"></div>
            <p className="text-[#E31E24] font-bold tracking-[0.2em] uppercase text-xs mb-3">OUR COMMITMENT</p>
            <h2 className="font-bold text-4xl md:text-5xl text-white tracking-tight">Why Choose GETAS</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {[
              { num: "01", icon: <Award size={40} className="text-[#E31E24]" />, title: "21+ Years in Real Estate", desc: "Part of Get-As International Plc., delivering quality developments across Ethiopia since 2005." },
              { num: "02", icon: <MapPin size={40} className="text-[#E31E24]" />, title: "Local Expertise", desc: "Deep knowledge of Addis Ababa — from Kazanchis to Bole — and each neighborhood's investment potential." },
              { num: "03", icon: <ShieldCheck size={40} className="text-[#E31E24]" />, title: "Verified Developments", desc: "Every property is built and vetted to meet international standards with full legal compliance." },
              { num: "04", icon: <TrendingUp size={40} className="text-[#E31E24]" />, title: "Long-Term Value", desc: "We develop properties — luxury apartments, commercial spaces, mixed-use — that generate lasting returns." },
            ].map((item, i) => (
              <div 
                key={i} 
                className="why-item bg-[#0D0D0D] border-l-4 border-[#E31E24] p-8 md:p-10 hover:bg-[#111] transition-colors"
                style={{ marginTop: i % 2 === 1 && window.innerWidth >= 768 ? '4rem' : '0' }}
              >
                <div className="text-[#E31E24]/30 font-bold text-7xl mb-4 leading-none">{item.num}</div>
                <div className="mb-5">{item.icon}</div>
                <h3 className="font-bold text-2xl text-white mb-4 tracking-tight">{item.title}</h3>
                <p className="text-white/60 leading-relaxed text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner — Left-aligned structural layout */}
      <section className="section-enter bg-[#E31E24] py-20">
        <div className="container mx-auto px-4">
          <div className="cta-content max-w-4xl">
            <Building2 size={56} className="text-[#1A1A1A]/20 mb-8" />
            <h2 className="font-bold text-4xl md:text-5xl text-[#1A1A1A] mb-4 tracking-tight">Ready to Find Your Property?</h2>
            <div className="h-0.5 w-32 bg-[#1A1A1A]/20 my-6"></div>
            <p className="text-[#1A1A1A]/70 text-lg max-w-2xl mb-10 leading-relaxed">
              Whether you're buying, renting, or investing, our expert team is ready to guide you every step of the way.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/contact"
                onClick={() => trackEvent("cta_click", { button: "Book a Visit" })}
                className="bg-[#1A1A1A] text-white px-10 py-4 font-bold text-xs tracking-[0.2em] uppercase hover:bg-[#0D0D0D] transition-colors inline-flex items-center justify-center"
              >
                BOOK A VISIT
              </Link>
              <Link 
                href="/properties" 
                className="border-2 border-[#1A1A1A] text-[#1A1A1A] px-10 py-4 font-bold text-xs tracking-[0.2em] uppercase hover:bg-[#1A1A1A] hover:text-white transition-colors inline-flex items-center justify-center"
              >
                BROWSE PROPERTIES
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
