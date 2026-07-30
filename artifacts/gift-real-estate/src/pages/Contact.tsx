import React, { useState } from "react";
import { MapPin, Phone, Mail, MessageCircle, Clock, Send, Globe, Info } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { submitInquiry, fetchSiteSettings } from "@/lib/api";
import { SEO, trackEvent } from "@/components/SEO";

export default function Contact() {
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

  const phone = settings?.phone || "+251 11 465 1234";
  const whatsapp = settings?.whatsapp || "+251911234567";
  const location = settings?.location || "Bole Sub-City, Woreda 03\nAddis Ababa, Ethiopia";
  const email = settings?.email || "info@getasrealestate.com";
  const portfolio = settings?.portfolio || "";
  const otherInfo = settings?.otherInfo || "";

  // Build phone href — strip spaces
  const phoneHref = `tel:${phone.replace(/\s/g, "")}`;
  const whatsappNum = whatsapp.replace(/[\s+]/g, "");
  const whatsappHref = `https://wa.me/${whatsappNum}`;

  const contactItems = [
    { icon: <MapPin className="text-[#E31E24]" size={24} />, title: "Our Office", text: location },
    { icon: <Phone className="text-[#E31E24]" size={24} />, title: "Phone", text: phone },
    { icon: <Mail className="text-[#E31E24]" size={24} />, title: "Email", text: email },
    { icon: <MessageCircle className="text-[#E31E24]" size={24} />, title: "WhatsApp", text: whatsapp },
    ...(portfolio ? [{ icon: <Globe className="text-[#E31E24]" size={24} />, title: "Portfolio / Website", text: portfolio }] : []),
    ...(otherInfo ? [{ icon: <Info className="text-[#E31E24]" size={24} />, title: "Additional Info", text: otherInfo }] : []),
    { icon: <Clock className="text-[#E31E24]" size={24} />, title: "Business Hours", text: "Mon–Fri: 8:30am – 6:00pm\nSat: 9:00am – 3:00pm" },
  ];

  return (
    <div className="min-h-screen bg-[#FFFFFF] pt-24 pb-20">
      <SEO
        title="Contact Us — Get in Touch with GETAS Real Estate"
        description="Contact GETAS Real Estate in Addis Ababa. Call, WhatsApp, or send a message to our expert team for property inquiries, viewings, and investment advice."
        path="/contact"
      />

      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#1A1A1A] mb-4">Get in Touch</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Whether you're looking to buy, sell, or rent, our team of experts is ready to assist you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Form */}
          <div className="bg-white p-8 md:p-10 rounded-sm shadow-xl border-t-4 border-[#E31E24]">
            <h2 className="font-serif text-3xl font-bold text-[#1A1A1A] mb-6">Send us a Message</h2>

            {inquiry.isSuccess ? (
              <div className="bg-green-50 text-green-800 p-6 rounded-sm text-center border border-green-200">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600"><Send size={24} /></div>
                <h3 className="font-bold text-xl mb-2">Message Sent Successfully!</h3>
                <p>Thank you for contacting GETAS Real Estate. An agent will be in touch shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">First Name *</label>
                    <input required type="text" value={form.name.split(" ")[0]} onChange={(e) => setForm({ ...form, name: `${e.target.value} ${form.name.split(" ").slice(1).join(" ")}`.trim() })} className="w-full border-b-2 border-gray-200 bg-gray-50 px-4 py-3 focus:outline-none focus:border-[#E31E24] transition-colors" placeholder="John" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Last Name</label>
                    <input type="text" onChange={(e) => setForm({ ...form, name: `${form.name.split(" ")[0]} ${e.target.value}`.trim() })} className="w-full border-b-2 border-gray-200 bg-gray-50 px-4 py-3 focus:outline-none focus:border-[#E31E24] transition-colors" placeholder="Doe" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Email Address *</label>
                  <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full border-b-2 border-gray-200 bg-gray-50 px-4 py-3 focus:outline-none focus:border-[#E31E24] transition-colors" placeholder="john@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Phone Number</label>
                  <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full border-b-2 border-gray-200 bg-gray-50 px-4 py-3 focus:outline-none focus:border-[#E31E24] transition-colors" placeholder="+251..." />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Subject</label>
                  <select value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="w-full border-b-2 border-gray-200 bg-gray-50 px-4 py-3 focus:outline-none focus:border-[#E31E24] transition-colors appearance-none">
                    <option>Property Inquiry (Buy)</option>
                    <option>Property Inquiry (Rent)</option>
                    <option>Property Management</option>
                    <option>Investment Consultation</option>
                    <option>General Inquiry</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Your Message *</label>
                  <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full border-b-2 border-gray-200 bg-gray-50 px-4 py-3 focus:outline-none focus:border-[#E31E24] transition-colors resize-none" placeholder="Tell us what you're looking for…" />
                </div>
                {inquiry.isError && <p className="text-red-600 text-sm">Failed to send. Please try again.</p>}
                <button type="submit" disabled={inquiry.isPending} className="w-full bg-[#E31E24] text-white px-8 py-4 font-bold tracking-widest uppercase rounded-sm hover:bg-[#1A1A1A] transition-colors shadow-lg flex items-center justify-center gap-3 disabled:opacity-60">
                  <Send size={18} /> {inquiry.isPending ? "Sending…" : "Send Message"}
                </button>
              </form>
            )}
          </div>

          {/* Info */}
          <div className="space-y-10">
            <div>
              <h2 className="font-serif text-3xl font-bold text-[#1A1A1A] mb-8">Contact Information</h2>
              <div className="space-y-6">
                {contactItems.map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-12 h-12 bg-[#E31E24]/10 rounded-sm flex items-center justify-center flex-shrink-0">{item.icon}</div>
                    <div>
                      <h3 className="font-bold text-[#1A1A1A] text-sm uppercase tracking-wider mb-1">{item.title}</h3>
                      <p className="text-gray-600 whitespace-pre-line leading-relaxed">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-4">
              <a
                href={phoneHref}
                onClick={() => trackEvent("cta_click", { button: "Call Now" })}
                className="flex-1 bg-[#E31E24] text-white px-6 py-4 rounded-sm font-bold text-center hover:bg-[#1A1A1A] transition-colors"
              >
                Call Now
              </a>
              <a
                href={whatsappHref}
                onClick={() => trackEvent("cta_click", { button: "WhatsApp" })}
                target="_blank" rel="noreferrer"
                className="flex-1 bg-[#25D366] text-white px-6 py-4 rounded-sm font-bold text-center hover:bg-[#1da551] transition-colors"
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
