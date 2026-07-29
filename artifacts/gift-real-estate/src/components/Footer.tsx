import React from "react";
import { Link } from "wouter";
import { MapPin, Phone, Mail, MessageCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#0F2E24] text-white pt-16 pb-8 border-t-[6px] border-[#D9B93C]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Info */}
          <div className="col-span-1 lg:col-span-1 flex flex-col items-start">
            <img src="/logo.png" alt="GIFT Real Estate" className="h-16 w-auto mb-6 object-contain" />
            <h3 className="font-serif text-2xl font-bold text-[#D9B93C] mb-2">GIFT Real Estate</h3>
            <p className="text-white/70 text-sm leading-relaxed mb-6">
              Ethiopia’s most trusted real estate partner since 1990. We build communities, not just houses.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-6 text-white border-b border-white/20 pb-2 inline-block">
              Quick Links
            </h4>
            <ul className="flex flex-col gap-3">
              {[
                { name: "Home", path: "/" },
                { name: "Properties for Sale", path: "/properties?type=sale" },
                { name: "Properties for Rent", path: "/properties?type=rent" },
                { name: "About the Company", path: "/about" },
                { name: "Our Services", path: "/services" },
                { name: "Market Insights Blog", path: "/blog" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.path}
                    className="text-white/70 hover:text-[#D9B93C] transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-6 text-white border-b border-white/20 pb-2 inline-block">
              Contact Us
            </h4>
            <ul className="flex flex-col gap-4">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-[#D9B93C] shrink-0 mt-1" />
                <span className="text-white/70 text-sm">
                  GIFT Tower, 8th Floor
                  <br />
                  Bole Road, Near Olympia
                  <br />
                  Addis Ababa, Ethiopia
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-[#D9B93C] shrink-0" />
                <span className="text-white/70 text-sm">+251 11 465 1234</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-[#D9B93C] shrink-0" />
                <span className="text-white/70 text-sm">info@giftrealestate.com</span>
              </li>
            </ul>
          </div>

          {/* WhatsApp / CTA */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-6 text-white border-b border-white/20 pb-2 inline-block">
              Need Assistance?
            </h4>
            <p className="text-white/70 text-sm mb-6">
              Our agents are available to chat with you directly.
            </p>
            <a
              href="https://wa.me/251911234567"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#D9B93C] text-[#0F2E24] px-5 py-3 rounded-sm font-bold text-sm transition-all hover:bg-white hover:text-[#0F2E24]"
            >
              <MessageCircle size={20} />
              Chat on WhatsApp
            </a>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/50 text-sm">
            © {new Date().getFullYear()} GIFT Real Estate. Est. 1990. All rights reserved.
          </p>
          <div className="flex gap-4">
            <span className="text-white/50 text-sm hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
            <span className="text-white/50 text-sm hover:text-white cursor-pointer transition-colors">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
