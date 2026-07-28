import React, { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { GiftBadge } from "./Badge";
import { Menu, X, Phone } from "lucide-react";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-[#0F2E24] ${
        isScrolled ? "shadow-lg py-2" : "py-4"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-4 group">
          <GiftBadge size={isScrolled ? 50 : 60} className="transition-all duration-300" />
          <div className="hidden sm:block">
            <h1 className="text-[#D9B93C] font-serif text-xl md:text-2xl font-bold tracking-wide">
              GIFT
            </h1>
            <p className="text-white/80 text-xs tracking-widest uppercase mt-0.5">
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
              className={`text-sm font-medium transition-colors hover:text-[#D9B93C] ${
                location === link.path ? "text-[#D9B93C]" : "text-white"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Action Section */}
        <div className="hidden lg:flex items-center gap-6">
          <div className="flex items-center gap-2 text-[#D9B93C]">
            <Phone size={18} />
            <span className="text-sm font-medium">+251 11 465 1234</span>
          </div>
          <Link
            href="/contact"
            className="bg-[#D9B93C] text-[#0F2E24] px-6 py-2.5 rounded-sm font-bold text-sm transition-all hover:bg-white hover:text-[#0F2E24] shadow-md"
            data-testid="link-book-visit"
          >
            Book a Visit
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
        <div className="lg:hidden absolute top-full left-0 right-0 bg-[#0F2E24] border-t border-white/10 shadow-xl flex flex-col pb-6 px-4">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`py-4 border-b border-white/5 text-lg font-medium transition-colors ${
                location === link.path ? "text-[#D9B93C]" : "text-white"
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="mt-6 flex flex-col gap-4">
            <div className="flex items-center justify-center gap-2 text-[#D9B93C] py-2">
              <Phone size={20} />
              <span className="font-medium">+251 11 465 1234</span>
            </div>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="bg-[#D9B93C] text-[#0F2E24] text-center px-6 py-3 rounded-sm font-bold w-full"
            >
              Book a Visit
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
