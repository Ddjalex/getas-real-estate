import React, { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useQuery } from "@tanstack/react-query";
import { fetchListings, fetchHeroSlides, fetchSiteSettings, type HeroSlide } from "@/lib/api";
import { PropertyCard } from "@/components/PropertyCard";
import { SEO, localBusinessJsonLd, trackEvent } from "@/components/SEO";
import { Search, MapPin, Building2, ShieldCheck, Award, TrendingUp } from "lucide-react";

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
    <div className="absolute inset-0 z-0">
      <div className="absolute inset-0 bg-black/65 z-10" />

      {/* Previous slide (fades out) */}
      {prev !== null && (
        <img
          key={`prev-${prev}`}
          src={resolveSlideUrl(images[prev].imageUrl)}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: transitioning ? 0 : 1, transition: "opacity 900ms ease-in-out" }}
        />
      )}

      {/* Current slide (fades in) */}
      <img
        key={`curr-${current}`}
        src={resolveSlideUrl(images[current].imageUrl)}
        alt={images[current].caption || "GETAS Real Estate"}
        className="absolute inset-0 w-full h-full object-cover ken-burns"
        style={{ opacity: 1, transition: "opacity 900ms ease-in-out" }}
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
    </div>
  );
}

gsap.registerPlugin(ScrollTrigger);

const HEADLINE_WORDS = ["Addis", "Ababa's", "Most", "Trusted", "Real", "Estate", "Partner"];

const STATS = [
  { target: 34,   suffix: "+", label: "Years in Business" },
  { target: 500,  suffix: "+", label: "Properties Sold" },
  { target: 1200, suffix: "+", label: "Happy Clients" },
  { target: 98,   suffix: "%", label: "Satisfaction Rate" },
];

function formatStat(val: number, suffix: string) {
  const rounded = Math.round(val);
  if (rounded >= 1000) {
    const thousands = Math.floor(rounded / 1000);
    const hundreds  = String(rounded % 1000).padStart(3, "0");
    return `${thousands},${hundreds}${suffix}`;
  }
  return `${rounded}${suffix}`;
}

export default function Home() {
  const { data: allListings = [] } = useQuery({
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
        ".hero-word, .hero-badge, .hero-sub, .hero-search, " +
        ".section-enter, .property-card, .why-item, .testimonial-card, .cta-content, .featured-header"
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

      gsap.from(q(".hero-word"), { yPercent: 110, opacity: 0, duration: 1.2, stagger: 0.07, ease: "power3.out", delay: 0.15 });
      gsap.from(q(".hero-badge"), { opacity: 0, y: 20, duration: 0.8, ease: "power2.out", delay: 0.05 });
      gsap.from(q(".hero-sub"),   { opacity: 0, y: 24, duration: 1.0, ease: "power2.out", delay: 0.8 });
      gsap.from(q(".hero-search"),{ opacity: 0, y: 28, duration: 1.0, ease: "power2.out", delay: 1.0 });

      q<HTMLElement>(".section-enter").forEach((section) => {
        gsap.fromTo(section, { opacity: 0, y: 40 }, {
          opacity: 1, y: 0, ease: "none",
          scrollTrigger: { trigger: section, start: "top 88%", end: "top 30%", scrub: 1.2 },
        });
      });

      const cards = q<HTMLElement>(".property-card");
      if (cards.length) {
        gsap.from(cards, {
          opacity: 0, y: 44, scale: 0.94, duration: 0.9, stagger: 0.12, ease: "power2.out",
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
          onStart() { el.textContent = `0${stat.suffix}`; },
          onUpdate() { el.textContent = formatStat(proxy.val, stat.suffix); },
        });
      });

      const testimonials = q<HTMLElement>(".testimonial-card");
      if (testimonials.length) {
        gsap.from(testimonials, { opacity: 0, x: 40, duration: 0.9, stagger: 0.14, ease: "power2.out", scrollTrigger: { trigger: testimonials[0], start: "top 85%" } });
      }
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

      {/* Hero */}
      <section className="relative h-[70vh] sm:h-[85vh] min-h-[480px] flex items-center justify-center overflow-hidden">
        <HeroSlider slides={heroSlides} />

        <div className="container relative z-20 mx-auto px-4 text-center mt-14 sm:mt-16">
          <span className="hero-badge inline-block px-4 py-1 border border-[#E31E24] text-[#E31E24] text-sm font-bold tracking-widest uppercase mb-6 rounded-sm backdrop-blur-sm bg-black/20">
            Est. 1990
          </span>
          <h1 className="font-serif text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-lg max-w-4xl mx-auto leading-tight">
            {HEADLINE_WORDS.map((word, i) => (
              <span key={i} className="inline-block overflow-hidden align-bottom" style={{ marginRight: "0.28em" }}>
                <span className="hero-word inline-block">{word}</span>
              </span>
            ))}
          </h1>
          <p className="hero-sub text-white/90 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-light drop-shadow-md">
            Discover premium homes, luxury apartments, and prime commercial spaces with a legacy of 34 years of excellence.
          </p>
          <div className="hero-search flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <Link
              href="/properties"
              onClick={() => trackEvent("cta_click", { button: "View All Properties" })}
              className="flex-1 bg-[#E31E24] text-[#1A1A1A] px-8 py-4 font-bold text-sm tracking-widest uppercase rounded-sm hover:bg-[#c8a82f] transition-colors shadow-lg flex items-center justify-center gap-2"
            >
              <Search size={18} /> View All Properties
            </Link>
            {phone && (
              <a
                href={`tel:${phone.replace(/\s/g, "")}`}
                onClick={() => trackEvent("cta_click", { button: "Call Now" })}
                className="flex-1 border-2 border-white text-white px-8 py-4 font-bold text-sm tracking-widest uppercase rounded-sm hover:bg-white hover:text-[#1A1A1A] transition-colors shadow-lg flex items-center justify-center gap-2"
              >
                Call Now
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section-enter bg-[#1A1A1A] py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {STATS.map((stat, i) => (
              <div key={i} className="text-white">
                <div ref={(el) => { statRefs.current[i] = el; }} className="font-serif text-4xl font-bold text-[#E31E24] mb-1">
                  0{stat.suffix}
                </div>
                <div className="text-white/70 text-sm uppercase tracking-widest font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="section-enter py-20 bg-[#FFFFFF]">
        <div className="container mx-auto px-4">
          <div className="featured-header flex items-end justify-between mb-12">
            <div>
              <p className="text-[#E31E24] font-bold tracking-widest uppercase text-sm mb-2">Handpicked for You</p>
              <h2 className="font-serif text-4xl font-bold text-[#1A1A1A]">Featured Properties</h2>
            </div>
            <Link href="/properties" className="text-[#E31E24] font-bold text-sm tracking-wider uppercase border-b-2 border-[#E31E24] pb-1 hover:text-[#E31E24] transition-colors hidden md:block">
              View All →
            </Link>
          </div>
          {featuredListings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredListings.map((listing) => (
                <PropertyCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1,2,3].map((i) => <div key={i} className="h-80 bg-gray-100 rounded-sm animate-pulse" />)}
            </div>
          )}
        </div>
      </section>

      {/* Why GETAS */}
      <section ref={whySectionRef} className="section-enter bg-[#1A1A1A] py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-[#E31E24] font-bold tracking-widest uppercase text-sm mb-3">Our Commitment</p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-white">Why Choose GETAS</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <Award size={36} className="text-[#E31E24]" />, title: "34 Years of Trust", desc: "A proven track record since 1990 in Ethiopia's real estate market." },
              { icon: <MapPin size={36} className="text-[#E31E24]" />, title: "Local Expertise", desc: "Deep knowledge of every Addis Ababa neighborhood and its investment potential." },
              { icon: <ShieldCheck size={36} className="text-[#E31E24]" />, title: "Verified Listings", desc: "Every property is thoroughly vetted for legal compliance and quality." },
              { icon: <TrendingUp size={36} className="text-[#E31E24]" />, title: "Investment ROI", desc: "We help you find properties that generate long-term value and returns." },
            ].map((item, i) => (
              <div key={i} className="why-item bg-white/5 border border-white/10 p-8 rounded-sm hover:bg-white/10 transition-colors">
                <div className="mb-4">{item.icon}</div>
                <h3 className="font-serif text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-white/70 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="section-enter bg-[#E31E24] py-20">
        <div className="container mx-auto px-4 text-center cta-content">
          <Building2 size={48} className="text-[#1A1A1A]/40 mx-auto mb-6" />
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#1A1A1A] mb-4">Ready to Find Your Property?</h2>
          <p className="text-[#1A1A1A]/80 text-lg max-w-2xl mx-auto mb-10">
            Whether you're buying, renting, or investing, our expert team is ready to guide you every step of the way.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              onClick={() => trackEvent("cta_click", { button: "Book a Visit" })}
              className="bg-[#1A1A1A] text-white px-10 py-4 font-bold text-sm tracking-widest uppercase rounded-sm hover:bg-[#E31E24] transition-colors shadow-lg"
            >
              Book a Visit
            </Link>
            <Link href="/properties" className="border-2 border-[#1A1A1A] text-[#1A1A1A] px-10 py-4 font-bold text-sm tracking-widest uppercase rounded-sm hover:bg-[#1A1A1A] hover:text-white transition-colors">
              Browse Properties
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
