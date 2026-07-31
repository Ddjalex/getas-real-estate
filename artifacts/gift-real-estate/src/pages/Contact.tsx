import React, { useState, useRef } from "react";
import { MapPin, Phone, Mail, MessageCircle, Clock, Send, Globe, Info } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { submitInquiry, fetchSiteSettings } from "@/lib/api";
import { SEO, trackEvent } from "@/components/SEO";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function Contact() {
  const pageRef = useRef<HTMLDivElement>(null);
  useScrollReveal(pageRef);

  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "Property Inquiry (Buy)", message: "" });

  const { data: settings } = useQuery({
    queryKey: ["site-settings"],
    queryFn: fetchSiteSettings,
    staleTime: 5 * 60 * 1000,
  });

  const inquiry = useMutation({
    mutationFn: () =>
      submitInquiry({
        name: form.name,
        email: form.email,
        phone: form.phone,
        message: `[${form.subject}]\n\n${form.message}`,
      }),
    onSuccess: () => {
      trackEvent("cta_click", { button: "Submit Inquiry" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    inquiry.mutate();
  };

  const phone = settings?.phone || "";
  const whatsapp = settings?.whatsapp || "";
  const location = settings?.location || "";
  const email = settings?.email || "";
  const portfolio = settings?.portfolio || "";
  const otherInfo = settings?.otherInfo || "";

  const phoneHref = `tel:${phone.replace(/\s/g, "")}`;
  const whatsappNum = whatsapp.replace(/[\s+]/g, "");
  const whatsappHref = `https://wa.me/${whatsappNum}`;

  const contactItems = [
    { icon: <MapPin className="text-[#E31E24]" size={20} />, title: "Our Office", text: location },
    { icon: <Phone className="text-[#E31E24]" size={20} />, title: "Phone", text: phone },
    { icon: <Mail className="text-[#E31E24]" size={20} />, title: "Email", text: email },
    { icon: <MessageCircle className="text-[#E31E24]" size={20} />, title: "WhatsApp", text: whatsapp },
    ...(portfolio ? [{ icon: <Globe className="text-[#E31E24]" size={20} />, title: "Portfolio / Website", text: portfolio }] : []),
    ...(otherInfo ? [{ icon: <Info className="text-[#E31E24]" size={20} />, title: "Additional Info", text: otherInfo }] : []),
    { icon: <Clock className="text-[#E31E24]" size={20} />, title: "Business Hours", text: "Mon–Fri: 8:30am – 6:00pm\nSat: 9:00am – 3:00pm" },
  ];

  return (
    <div ref={pageRef} className="min-h-screen bg-[#FFFFFF] pt-24 pb-20">
      <SEO
        title="Contact Us — Get in Touch with GETAS Real Estate"
        description="Contact GETAS Real Estate in Addis Ababa. Call, WhatsApp, or send a message to our expert team for property inquiries, viewings, and investment advice."
        path="/contact"
      />

      {/* Page Hero */}
      <div data-reveal className="bg-[#1A1A1A] border-t-4 border-[#E31E24] py-14 mb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="h-0.5 w-12 bg-[#E31E24] mb-4" />
          <p className="text-[#E31E24] font-bold tracking-[0.2em] uppercase text-xs mb-3">REACH OUT</p>
          <h1 className="font-bold text-4xl md:text-5xl text-white tracking-tight mb-3">Get in Touch</h1>
          <p className="text-white/60 text-base max-w-xl">
            Whether you're looking to buy, sell, or rent, our team of experts is ready to assist you.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl">
        <div data-reveal className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Form */}
          <div className="bg-white border border-gray-100 border-t-4 border-t-[#E31E24] p-8 md:p-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-6 w-1 bg-[#E31E24]" />
              <h2 className="font-bold text-2xl text-[#1A1A1A] tracking-tight">Send us a Message</h2>
            </div>

            {inquiry.isSuccess ? (
              <div className="bg-[#0D0D0D] text-white p-8 text-center">
                <div className="w-14 h-14 bg-[#E31E24]/10 flex items-center justify-center mx-auto mb-4 text-[#E31E24]"><Send size={22} /></div>
                <h3 className="font-bold text-xl mb-2 tracking-tight">Message Sent!</h3>
                <p className="text-white/60 text-sm">Thank you for contacting GETAS Real Estate. An agent will be in touch shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">First Name *</label>
                    <input
                      required
                      type="text"
                      value={form.name.split(" ")[0]}
                      onChange={(e) => setForm({ ...form, name: `${e.target.value} ${form.name.split(" ").slice(1).join(" ")}`.trim() })}
                      className="w-full bg-gray-50 border border-gray-200 px-4 py-3 focus:outline-none focus:border-[#E31E24] transition-colors text-[#1A1A1A]"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Last Name</label>
                    <input
                      type="text"
                      onChange={(e) => setForm({ ...form, name: `${form.name.split(" ")[0]} ${e.target.value}`.trim() })}
                      className="w-full bg-gray-50 border border-gray-200 px-4 py-3 focus:outline-none focus:border-[#E31E24] transition-colors text-[#1A1A1A]"
                      placeholder="Doe"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email Address *</label>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 px-4 py-3 focus:outline-none focus:border-[#E31E24] transition-colors text-[#1A1A1A]"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 px-4 py-3 focus:outline-none focus:border-[#E31E24] transition-colors text-[#1A1A1A]"
                    placeholder="+251..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Subject</label>
                  <select
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 px-4 py-3 focus:outline-none focus:border-[#E31E24] transition-colors text-[#1A1A1A] appearance-none"
                  >
                    <option>Property Inquiry (Buy)</option>
                    <option>Property Inquiry (Rent)</option>
                    <option>Property Management</option>
                    <option>Investment Consultation</option>
                    <option>General Inquiry</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Your Message *</label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 px-4 py-3 focus:outline-none focus:border-[#E31E24] transition-colors resize-none text-[#1A1A1A]"
                    placeholder="Tell us what you're looking for…"
                  />
                </div>
                {inquiry.isError && <p className="text-[#E31E24] text-xs font-bold">Failed to send. Please try again.</p>}
                <button
                  type="submit"
                  disabled={inquiry.isPending}
                  className="w-full bg-[#E31E24] text-white px-8 py-4 font-bold tracking-[0.2em] uppercase hover:bg-[#1A1A1A] transition-colors flex items-center justify-center gap-3 disabled:opacity-60 text-xs"
                >
                  <Send size={16} /> {inquiry.isPending ? "Sending…" : "Send Message"}
                </button>
              </form>
            )}
          </div>

          {/* Contact Info */}
          <div className="space-y-10">
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="h-6 w-1 bg-[#E31E24]" />
                <h2 className="font-bold text-2xl text-[#1A1A1A] tracking-tight">Contact Information</h2>
              </div>
              <div className="space-y-0 border border-gray-100">
                {contactItems.map((item, i) => (
                  <div key={i} className={`flex gap-5 p-5 ${i > 0 ? "border-t border-gray-100" : ""}`}>
                    <div className="w-10 h-10 bg-[#E31E24]/5 flex items-center justify-center flex-shrink-0">{item.icon}</div>
                    <div>
                      <h3 className="font-bold text-[#1A1A1A] text-xs uppercase tracking-widest mb-1">{item.title}</h3>
                      <p className="text-gray-500 text-sm whitespace-pre-line leading-relaxed">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <a
                href={phoneHref}
                onClick={() => trackEvent("cta_click", { button: "Call Now" })}
                className="bg-[#E31E24] text-white px-6 py-4 font-bold text-xs tracking-[0.2em] uppercase text-center hover:bg-[#1A1A1A] transition-colors"
              >
                Call Now
              </a>
              <a
                href={whatsappHref}
                onClick={() => trackEvent("cta_click", { button: "WhatsApp" })}
                target="_blank" rel="noreferrer"
                className="bg-[#25D366] text-white px-6 py-4 font-bold text-xs tracking-[0.2em] uppercase text-center hover:bg-[#1da551] transition-colors"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
