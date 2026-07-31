import React from "react";
import { Link } from "wouter";
import { MapPin, Phone, Mail, MessageCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchSiteSettings } from "@/lib/api";
import logoSrc from "@/assets/logo.png";

export function Footer() {
  const { data: settings } = useQuery({
    queryKey: ["site-settings"],
    queryFn: fetchSiteSettings,
    staleTime: 5 * 60 * 1000,
  });

  const phone = settings?.phone || "";
  const whatsapp = settings?.whatsapp || "";
  const location = settings?.location || "";
  const email = settings?.email || "";
  const whatsappNum = whatsapp.replace(/[\s+]/g, "");

  return (
    <footer className="bg-[#111111] text-white border-t-[6px] border-[#E31E24]">
      <div className="container mx-auto px-4 md:px-8 pt-16 pb-0">
        {/* Main grid — asymmetric: wide brand col + 3 narrow cols */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2.2fr_1fr_1fr_1.4fr] gap-12 pb-14 border-b border-white/10">

          {/* Brand + Newsletter */}
          <div className="flex flex-col items-start">
            <img src={logoSrc} alt="GETAS Real Estate" className="h-14 w-auto mb-5 object-contain" />
            <h3 className="font-bold text-lg text-white mb-1 tracking-tight">GETAS Real Estate</h3>
            <p className="text-white/50 text-sm leading-relaxed mb-8 max-w-xs">
              A division of Get-As International Plc. Delivering premium residential and commercial developments across Addis Ababa since 2005.
            </p>
            <p className="text-[#E31E24] font-bold text-[0.65rem] tracking-[0.25em] uppercase mb-3">
              Market Insights Newsletter
            </p>
            <div className="flex w-full max-w-sm">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 bg-white/8 text-white placeholder:text-white/35 text-sm px-4 py-3 border border-white/15 focus:border-[#E31E24] outline-none transition-colors"
              />
              <button className="bg-[#E31E24] text-white px-5 py-3 font-bold text-[0.65rem] tracking-[0.2em] uppercase hover:bg-white hover:text-[#1A1A1A] transition-colors shrink-0">
                JOIN
              </button>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="font-bold text-[0.65rem] tracking-[0.22em] uppercase mb-6 text-white/80 pb-3 border-b border-white/10">
              Explore
            </h4>
            <ul className="flex flex-col gap-3.5">
              {[
                { name: "Properties", path: "/properties" },
                { name: "Why GETAS", path: "/about" },
                { name: "Services", path: "/services" },
                { name: "Insights", path: "/blog" },
                { name: "Contact", path: "/contact" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.path}
                    className="text-white/55 hover:text-[#E31E24] transition-colors text-sm flex items-center gap-2.5 group"
                  >
                    <span className="h-px w-3 bg-[#E31E24]/30 group-hover:w-5 group-hover:bg-[#E31E24] transition-all duration-200" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold text-[0.65rem] tracking-[0.22em] uppercase mb-6 text-white/80 pb-3 border-b border-white/10">
              Company
            </h4>
            <ul className="flex flex-col gap-3.5">
              {[
                { name: "About Us", path: "/about" },
                { name: "Our Agents", path: "/agents" },
                { name: "Careers", path: "/careers" },
                { name: "Contact", path: "/contact" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.path}
                    className="text-white/55 hover:text-[#E31E24] transition-colors text-sm flex items-center gap-2.5 group"
                  >
                    <span className="h-px w-3 bg-[#E31E24]/30 group-hover:w-5 group-hover:bg-[#E31E24] transition-all duration-200" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact — icon-boxed */}
          <div>
            <h4 className="font-bold text-[0.65rem] tracking-[0.22em] uppercase mb-6 text-white/80 pb-3 border-b border-white/10">
              Contact
            </h4>
            <ul className="flex flex-col gap-4">
              {location && (
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[#E31E24]/12 border border-[#E31E24]/20 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin size={13} className="text-[#E31E24]" />
                  </div>
                  <span className="text-white/55 text-sm leading-relaxed whitespace-pre-line pt-1">{location}</span>
                </li>
              )}
              {phone && (
                <li className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#E31E24]/12 border border-[#E31E24]/20 flex items-center justify-center shrink-0">
                    <Phone size={13} className="text-[#E31E24]" />
                  </div>
                  <a href={`tel:${phone.replace(/\s/g, "")}`} className="text-white/55 text-sm hover:text-[#E31E24] transition-colors">{phone}</a>
                </li>
              )}
              {email && (
                <li className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#E31E24]/12 border border-[#E31E24]/20 flex items-center justify-center shrink-0">
                    <Mail size={13} className="text-[#E31E24]" />
                  </div>
                  <a href={`mailto:${email}`} className="text-white/55 text-sm hover:text-[#E31E24] transition-colors">{email}</a>
                </li>
              )}
              {whatsapp && (
                <li className="mt-2">
                  <a
                    href={`https://wa.me/${whatsappNum}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#E31E24] text-white px-5 py-2.5 font-bold text-[0.65rem] tracking-[0.2em] uppercase hover:bg-white hover:text-[#1A1A1A] transition-colors"
                  >
                    <MessageCircle size={13} />
                    Chat on WhatsApp
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Copyright bar — red accent left + aligned layout */}
        <div className="py-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="h-4 w-0.5 bg-[#E31E24] shrink-0" />
            <p className="text-white/35 text-xs tracking-wide">
              © {new Date().getFullYear()} GETAS Real Estate · Get-As International Plc. · Est. 1994
            </p>
          </div>
          <div className="flex gap-6 pl-3 md:pl-0">
            <span className="text-white/35 text-xs hover:text-white/65 cursor-pointer transition-colors tracking-wide">Privacy Policy</span>
            <span className="text-white/35 text-xs hover:text-white/65 cursor-pointer transition-colors tracking-wide">Terms of Service</span>
          </div>
        </div>

        {/* Neo Digital Solutions credit */}
        <div className="border-t border-white/5 py-4 flex justify-center">
          <a
            href="https://neodigitalsolutions.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-medium tracking-wide select-none"
            style={{ textDecoration: "none" }}
          >
            <span className="neo-credit-text">Made with</span>
            <span className="neo-credit-heart text-xs">❤️</span>
            <span className="neo-credit-text">by Neodigitalsolutions</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
