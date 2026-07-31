import React, { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Phone } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchSiteSettings } from "@/lib/api";
import logoSrc from "@/assets/logo.png";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden]     = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  const { data: settings } = useQuery({
    queryKey: ["site-settings"],
    queryFn: fetchSiteSettings,
    staleTime: 5 * 60 * 1000,
  });
  const phone = settings?.phone || "";

  useEffect(() => {
    let lastY = window.scrollY;
    const handleScroll = () => {
      const currentY = window.scrollY;
      setIsScrolled(currentY > 40);
      // Hide when scrolling down past 80px; reveal when scrolling up
      if (currentY > 80) {
        setIsHidden(currentY > lastY);
      } else {
        setIsHidden(false);
      }
      lastY = currentY;
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Properties", path: "/properties" },
    { name: "About", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Blog", path: "/blog" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-[#1A1A1A] shadow-lg border-t-2 border-[#E31E24] transition-transform duration-300 ${isHidden ? "-translate-y-full" : "translate-y-0"}`}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between py-3">
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-4 group">
          <img
            src={logoSrc}
            alt="GETAS Real Estate logo"
            className="transition-all duration-300 object-contain drop-shadow-md w-12 h-12"
          />
          <div className="hidden sm:block">
            <h1 className="text-[#E31E24] font-bold text-xl tracking-wide">
              GETAS
            </h1>
            <p className="text-white/70 text-[10px] tracking-[0.25em] uppercase mt-0.5">
              Real Estate
            </p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={`text-xs font-semibold tracking-[0.15em] uppercase transition-colors duration-300 hover:text-[#E31E24] ${
                location === link.path ? "text-[#E31E24]" : "text-white"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Action Section */}
        <div className="hidden lg:flex items-center gap-6">
          <div className="flex items-center gap-2 text-[#E31E24]">
            <Phone size={16} />
            <span className="text-xs font-semibold tracking-wide">{phone}</span>
          </div>
          <Link
            href="/contact"
            className="bg-[#E31E24] text-white px-6 py-3 font-bold text-xs tracking-[0.2em] uppercase transition-all hover:bg-white hover:text-[#1A1A1A]"
            data-testid="link-book-visit"
          >
            BOOK A VISIT
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="lg:hidden text-white p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          data-testid="button-mobile-menu"
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#1A1A1A] border-t border-white/10 shadow-xl flex flex-col pb-6 px-4">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`py-4 border-b border-white/5 text-sm font-semibold tracking-widest uppercase transition-colors ${
                location === link.path ? "text-[#E31E24]" : "text-white"
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="mt-6 flex flex-col gap-4">
            <div className="flex items-center justify-center gap-2 text-[#E31E24] py-2">
              <Phone size={18} />
              <span className="font-medium text-sm">{phone}</span>
            </div>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="bg-[#E31E24] text-white text-center px-6 py-3 font-bold text-xs tracking-[0.2em] uppercase w-full"
            >
              BOOK A VISIT
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
