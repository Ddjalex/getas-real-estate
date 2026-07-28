import React, { useEffect, useRef } from "react";
import { Link } from "wouter";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useQuery } from "@tanstack/react-query";
import { fetchListings } from "@/lib/api";
import { PropertyCard } from "@/components/PropertyCard";
import { SEO, localBusinessJsonLd, trackEvent } from "@/components/SEO";
import { Search, MapPin, Building2, ShieldCheck, Award, TrendingUp } from "lucide-react";

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
    <div ref={homeRef} className="min-h-screen bg-[#FDFDF8]">
      <SEO
        path="/"
        jsonLd={localBusinessJsonLd()}
      />

      {/* Hero */}
      <section className="relative h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[#0F2E24]/60 mix-blend-multiply z-10" />
          <img
            src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1920"
            alt="Addis Ababa luxury real estate"
            width={1920} height={1080}
            loading="eager"
            className="ken-burns w-full h-full object-cover"
          />
        </div>

        <div className="container relative z-20 mx-auto px-4 text-center mt-16">
          <span className="hero-badge inline-block px-4 py-1 border border-[#D9B93C] text-[#D9B93C] text-sm font-bold tracking-widest uppercase mb-6 rounded-sm backdrop-blur-sm bg-black/20">
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
              className="flex-1 bg-[#D9B93C] text-[#0F2E24] px-8 py-4 font-bold text-sm tracking-widest uppercase rounded-sm hover:bg-[#c8a82f] transition-colors shadow-lg flex items-center justify-center gap-2"
            >
              <Search size={18} /> View All Properties
            </Link>
            <a
              href="tel:+251114651234"
              onClick={() => trackEvent("cta_click", { button: "Call Now" })}
              className="flex-1 border-2 border-white text-white px-8 py-4 font-bold text-sm tracking-widest uppercase rounded-sm hover:bg-white hover:text-[#0F2E24] transition-colors shadow-lg flex items-center justify-center gap-2"
            >
              Call Now
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section-enter bg-[#0F2E24] py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {STATS.map((stat, i) => (
              <div key={i} className="text-white">
                <div ref={(el) => { statRefs.current[i] = el; }} className="font-serif text-4xl font-bold text-[#D9B93C] mb-1">
                  0{stat.suffix}
                </div>
                <div className="text-white/70 text-sm uppercase tracking-widest font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="section-enter py-20 bg-[#FDFDF8]">
        <div className="container mx-auto px-4">
          <div className="featured-header flex items-end justify-between mb-12">
            <div>
              <p className="text-[#D9B93C] font-bold tracking-widest uppercase text-sm mb-2">Handpicked for You</p>
              <h2 className="font-serif text-4xl font-bold text-[#0F2E24]">Featured Properties</h2>
            </div>
            <Link href="/properties" className="text-[#1C4C3B] font-bold text-sm tracking-wider uppercase border-b-2 border-[#D9B93C] pb-1 hover:text-[#D9B93C] transition-colors hidden md:block">
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

      {/* Why GIFT */}
      <section ref={whySectionRef} className="section-enter bg-[#0F2E24] py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-[#D9B93C] font-bold tracking-widest uppercase text-sm mb-3">Our Commitment</p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-white">Why Choose GIFT</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <Award size={36} className="text-[#D9B93C]" />, title: "34 Years of Trust", desc: "A proven track record since 1990 in Ethiopia's real estate market." },
              { icon: <MapPin size={36} className="text-[#D9B93C]" />, title: "Local Expertise", desc: "Deep knowledge of every Addis Ababa neighborhood and its investment potential." },
              { icon: <ShieldCheck size={36} className="text-[#D9B93C]" />, title: "Verified Listings", desc: "Every property is thoroughly vetted for legal compliance and quality." },
              { icon: <TrendingUp size={36} className="text-[#D9B93C]" />, title: "Investment ROI", desc: "We help you find properties that generate long-term value and returns." },
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

      {/* Testimonials */}
      <section className="section-enter py-20 bg-[#FDFDF8]">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <p className="text-[#D9B93C] font-bold tracking-widest uppercase text-sm mb-2">Client Stories</p>
            <h2 className="font-serif text-4xl font-bold text-[#0F2E24]">What Our Clients Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Tesfaye Bekele", role: "Property Investor", quote: "GIFT helped me find a premium villa in Old Airport. Their professionalism and market knowledge are unmatched in Addis Ababa." },
              { name: "Meron Haile", role: "Diaspora Buyer", quote: "As an Ethiopian living abroad, I trusted GIFT to handle my first investment property. The process was smooth and transparent." },
              { name: "NGO Director", role: "Corporate Client", quote: "We've leased three office spaces through GIFT. They understand the unique needs of international organizations." },
            ].map((t, i) => (
              <div key={i} className="testimonial-card bg-white border border-gray-100 p-8 rounded-sm shadow-sm">
                <p className="text-gray-700 leading-relaxed mb-6 italic">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#1C4C3B] rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-[#0F2E24] text-sm">{t.name}</div>
                    <div className="text-gray-400 text-xs">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="section-enter bg-[#D9B93C] py-20">
        <div className="container mx-auto px-4 text-center cta-content">
          <Building2 size={48} className="text-[#0F2E24]/40 mx-auto mb-6" />
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#0F2E24] mb-4">Ready to Find Your Property?</h2>
          <p className="text-[#0F2E24]/80 text-lg max-w-2xl mx-auto mb-10">
            Whether you're buying, renting, or investing, our expert team is ready to guide you every step of the way.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              onClick={() => trackEvent("cta_click", { button: "Book a Visit" })}
              className="bg-[#0F2E24] text-white px-10 py-4 font-bold text-sm tracking-widest uppercase rounded-sm hover:bg-[#1C4C3B] transition-colors shadow-lg"
            >
              Book a Visit
            </Link>
            <Link href="/properties" className="border-2 border-[#0F2E24] text-[#0F2E24] px-10 py-4 font-bold text-sm tracking-widest uppercase rounded-sm hover:bg-[#0F2E24] hover:text-white transition-colors">
              Browse Properties
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
