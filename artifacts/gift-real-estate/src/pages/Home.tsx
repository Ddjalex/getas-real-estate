import React, { useEffect, useRef } from "react";
import { Link } from "wouter";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { listings } from "@/data/listings";
import { PropertyCard } from "@/components/PropertyCard";
import { Search, MapPin, Building2, ShieldCheck, Award, TrendingUp } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

// Headline split — words grouped into visual lines
const HEADLINE_WORDS = ["Addis", "Ababa's", "Most", "Trusted", "Real", "Estate", "Partner"];

// Stat data with animation targets
const STATS = [
  { target: 34,   suffix: "+",  label: "Years in Business" },
  { target: 500,  suffix: "+",  label: "Properties Sold" },
  { target: 1200, suffix: "+",  label: "Happy Clients" },
  { target: 98,   suffix: "%",  label: "Satisfaction Rate" },
];

function formatStat(val: number, suffix: string) {
  const rounded = Math.round(val);
  if (rounded >= 1000) {
    const thousands = Math.floor(rounded / 1000);
    const hundreds = String(rounded % 1000).padStart(3, "0");
    return `${thousands},${hundreds}${suffix}`;
  }
  return `${rounded}${suffix}`;
}

export default function Home() {
  const featuredListings = listings.filter((l) => l.featured).slice(0, 3);

  const homeRef        = useRef<HTMLDivElement>(null);
  const statRefs       = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      // Instant reveals for reduced-motion users — no jank, no pinning
      if (!homeRef.current) return;
      homeRef.current.querySelectorAll<HTMLElement>(
        ".hero-word, .hero-badge, .hero-sub, .hero-search, .section-enter, .property-card, .why-item, .testimonial-card, .cta-content"
      ).forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "none";
      });
      // Fill stat counters immediately
      statRefs.current.forEach((el, i) => {
        if (el) el.textContent = formatStat(STATS[i].target, STATS[i].suffix);
      });
      return;
    }

    const ctx = gsap.context(() => {
      // ─────────────────────────────────────────────────────────────
      // 1. HERO — Ken Burns is handled via CSS animation class
      // ─────────────────────────────────────────────────────────────

      // 2. HEADLINE WORD REVEAL — masked slide-up stagger
      const words = gsap.utils.toArray<HTMLElement>(".hero-word");
      gsap.from(words, {
        yPercent: 110,
        opacity: 0,
        duration: 1.2,
        stagger: 0.07,
        ease: "power3.out",
        delay: 0.2,
      });

      // Hero badge + subtitle + search bar sequence
      gsap.from(".hero-badge", {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: "power2.out",
        delay: 0.1,
      });
      gsap.from(".hero-sub", {
        opacity: 0,
        y: 24,
        duration: 1,
        ease: "power2.out",
        delay: 0.85,
      });
      gsap.from(".hero-search", {
        opacity: 0,
        y: 28,
        duration: 1,
        ease: "power2.out",
        delay: 1.05,
      });

      // ─────────────────────────────────────────────────────────────
      // 3. SECTION SCROLL TRANSITIONS — scrubbed scale + fade
      // ─────────────────────────────────────────────────────────────
      gsap.utils.toArray<HTMLElement>(".section-enter").forEach((section) => {
        gsap.fromTo(
          section,
          { opacity: 0.6, scale: 1.03 },
          {
            opacity: 1,
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top 90%",
              end: "top 30%",
              scrub: 1.5,
            },
          }
        );
      });

      // ─────────────────────────────────────────────────────────────
      // 4. FULL-BLEED IMAGE REVEALS — scrubbed zoom-in + fade
      // ─────────────────────────────────────────────────────────────
      gsap.utils.toArray<HTMLElement>(".img-reveal").forEach((img) => {
        gsap.fromTo(
          img,
          { scale: 1.15, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: img,
              start: "top 90%",
              end: "top 30%",
              scrub: 1.2,
            },
          }
        );
      });

      // ─────────────────────────────────────────────────────────────
      // 5. PINNED "WHY GIFT" SECTION (desktop only)
      // ─────────────────────────────────────────────────────────────
      const isMobile = window.innerWidth < 768;
      const whySection = document.querySelector<HTMLElement>(".why-section");
      const whyItems   = gsap.utils.toArray<HTMLElement>(".why-item");

      if (!isMobile && whySection && whyItems.length) {
        gsap.set(whyItems, { opacity: 0, y: 48 });

        ScrollTrigger.create({
          trigger: whySection,
          start: "top top",
          end: "+=560",
          pin: true,
          onEnter: () => {
            gsap.to(whyItems, {
              opacity: 1,
              y: 0,
              duration: 0.9,
              stagger: 0.18,
              ease: "power2.out",
            });
          },
        });
      } else if (whyItems.length) {
        // Mobile: simple scroll-triggered fade-in (no pin)
        gsap.from(whyItems, {
          opacity: 0,
          y: 36,
          duration: 0.8,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: whySection,
            start: "top 80%",
          },
        });
      }

      // ─────────────────────────────────────────────────────────────
      // 6. PROPERTY CARD STAGGER — horizontal drift + scale
      // ─────────────────────────────────────────────────────────────
      const cards = gsap.utils.toArray<HTMLElement>(".property-card");
      if (cards.length) {
        gsap.from(cards, {
          opacity: 0,
          y: 40,
          scale: 0.94,
          duration: 0.9,
          stagger: 0.12,
          ease: "power2.out",
          scrollTrigger: {
            trigger: cards[0],
            start: "top 85%",
          },
        });
      }

      // Section heading slides
      gsap.from(".featured-header", {
        opacity: 0,
        x: -40,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: { trigger: ".featured-header", start: "top 85%" },
      });

      // ─────────────────────────────────────────────────────────────
      // 8. ANIMATED STAT COUNTERS — count-up + scale-in
      // ─────────────────────────────────────────────────────────────
      statRefs.current.forEach((el, i) => {
        if (!el) return;
        const stat = STATS[i];

        // Initial display
        el.textContent = `0${stat.suffix}`;

        const proxy = { val: 0 };
        gsap.to(proxy, {
          val: stat.target,
          duration: 1.8,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
          onUpdate() {
            el.textContent = formatStat(proxy.val, stat.suffix);
          },
        });

        gsap.from(el, {
          scale: 0.7,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        });
      });

      // ─────────────────────────────────────────────────────────────
      // TESTIMONIAL CARDS — staggered fade from right
      // ─────────────────────────────────────────────────────────────
      const testimonials = gsap.utils.toArray<HTMLElement>(".testimonial-card");
      if (testimonials.length) {
        gsap.from(testimonials, {
          opacity: 0,
          x: 40,
          duration: 0.9,
          stagger: 0.14,
          ease: "power2.out",
          scrollTrigger: { trigger: testimonials[0], start: "top 85%" },
        });
      }

      // ─────────────────────────────────────────────────────────────
      // CTA BANNER — fade + scale
      // ─────────────────────────────────────────────────────────────
      gsap.from(".cta-content", {
        opacity: 0,
        y: 32,
        scale: 0.97,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: { trigger: ".cta-content", start: "top 85%" },
      });
    }, homeRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={homeRef} className="min-h-screen bg-[#FDFDF8]">

      {/* ── Hero Section ── */}
      <section className="relative h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[#0F2E24]/60 mix-blend-multiply z-10" />
          {/* Ken Burns via CSS animation class */}
          <img
            src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1920"
            alt="Addis Ababa Real Estate"
            className="ken-burns w-full h-full object-cover"
          />
        </div>

        <div className="container relative z-20 mx-auto px-4 text-center mt-16">
          <span className="hero-badge inline-block px-4 py-1 border border-[#D9B93C] text-[#D9B93C] text-sm font-bold tracking-widest uppercase mb-6 rounded-sm backdrop-blur-sm bg-black/20">
            Est. 1990
          </span>

          {/* Headline — split into word spans for masked reveal */}
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

          {/* Search UI */}
          <div className="hero-search bg-white p-3 rounded-md shadow-2xl max-w-4xl mx-auto flex flex-col md:flex-row gap-3">
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

      {/* ── Stats Band ── */}
      <section className="section-enter bg-[#0F2E24] py-16 relative z-30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-white/10 text-center">
            {STATS.map((stat, i) => (
              <div key={i} className="px-4">
                <div
                  ref={(el) => { statRefs.current[i] = el; }}
                  className="text-4xl md:text-5xl font-serif font-bold text-[#D9B93C] mb-2"
                >
                  {formatStat(stat.target, stat.suffix)}
                </div>
                <div className="text-white/80 text-sm font-medium tracking-wide uppercase">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Properties ── */}
      <section className="section-enter py-24 bg-[#FDFDF8]">
        <div className="container mx-auto px-4">
          <div className="featured-header flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
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
              <div key={listing.id} className="property-card">
                <PropertyCard listing={listing} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why GIFT Section (pinned on desktop) ── */}
      <section className="why-section section-enter py-24 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-[#D9B93C] font-bold tracking-widest uppercase text-sm mb-3">Why Choose Us</h2>
            <h3 className="font-serif text-4xl text-[#0F2E24] font-bold mb-6">The GIFT Difference</h3>
            <p className="text-gray-600 text-lg">
              Since 1990, we have been the standard-bearers for quality, transparency, and trust in the Ethiopian real estate market.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="why-item text-center group">
              <div className="w-20 h-20 mx-auto bg-[#FDFDF8] border border-[#1C4C3B]/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-[#1C4C3B] transition-colors duration-300">
                <Award size={32} className="text-[#1C4C3B] group-hover:text-[#D9B93C] transition-colors" />
              </div>
              <h4 className="font-serif text-xl font-bold text-[#0F2E24] mb-3">Decades of Experience</h4>
              <p className="text-gray-600">With 34 years of localized knowledge, we understand the nuances of every neighborhood in Addis Ababa.</p>
            </div>
            <div className="why-item text-center group">
              <div className="w-20 h-20 mx-auto bg-[#FDFDF8] border border-[#1C4C3B]/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-[#1C4C3B] transition-colors duration-300">
                <ShieldCheck size={32} className="text-[#1C4C3B] group-hover:text-[#D9B93C] transition-colors" />
              </div>
              <h4 className="font-serif text-xl font-bold text-[#0F2E24] mb-3">Absolute Transparency</h4>
              <p className="text-gray-600">Clear title deeds, honest appraisals, and straightforward legal processes for peace of mind.</p>
            </div>
            <div className="why-item text-center group">
              <div className="w-20 h-20 mx-auto bg-[#FDFDF8] border border-[#1C4C3B]/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-[#1C4C3B] transition-colors duration-300">
                <TrendingUp size={32} className="text-[#1C4C3B] group-hover:text-[#D9B93C] transition-colors" />
              </div>
              <h4 className="font-serif text-xl font-bold text-[#0F2E24] mb-3">Investment Focused</h4>
              <p className="text-gray-600">We guide diaspora and local buyers toward properties that offer maximum rental yield and capital appreciation.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="section-enter py-24 bg-[#0F2E24] text-white">
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
                text: "Buying property from abroad is daunting. GIFT handled everything—from viewing to title transfer—with utmost professionalism. I now own a beautiful villa in CMC.",
              },
              {
                name: "Hanna M.",
                role: "Homeowner, Bole",
                text: "The team at GIFT didn't just sell us a house; they found us a home. Their knowledge of Bole's micro-neighborhoods is unmatched.",
              },
              {
                name: "Elias K.",
                role: "Business Owner",
                text: "We leased our corporate headquarters through GIFT. The negotiation was transparent and the space exactly met our demanding specifications.",
              },
            ].map((testimonial, i) => (
              <div key={i} className="testimonial-card bg-white/5 border border-white/10 p-8 rounded-sm">
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

      {/* ── CTA Banner ── */}
      <section className="section-enter py-24 bg-[#D9B93C] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10">
          <svg viewBox="0 0 100 100" className="w-full h-full fill-current"><circle cx="50" cy="50" r="40"/></svg>
        </div>
        <div className="cta-content container mx-auto px-4 text-center relative z-10">
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
