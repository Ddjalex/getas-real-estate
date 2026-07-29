import React, { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Phone } from "lucide-react";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    // Check immediately in case the page is already scrolled on mount
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

  const isHomePage = location === "/";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-in-out ${
        isScrolled || !isHomePage
          ? "bg-[#0F2E24] shadow-lg py-2"
          : "bg-[#0F2E24]/0 backdrop-blur-none py-5"
      }`}
      style={{
        // Cinematic 700ms ease for the background fade-in
        transitionProperty: "background-color, box-shadow, padding",
        transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-4 group">
          <img
            src="/logo.png"
            alt="GIFT Real Estate logo"
            className="transition-all duration-700 object-contain drop-shadow-md"
            style={{ width: isScrolled ? 50 : 58, height: isScrolled ? 50 : 58 }}
          />
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
              className={`text-sm font-medium transition-colors duration-300 hover:text-[#D9B93C] ${
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
        <div
          className={`lg:hidden absolute top-full left-0 right-0 border-t border-white/10 shadow-xl flex flex-col pb-6 px-4 transition-all duration-700 ${
            isScrolled ? "bg-[#0F2E24]" : "bg-[#0F2E24]/90 backdrop-blur-sm"
          }`}
        >
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
