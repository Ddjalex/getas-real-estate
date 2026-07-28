import React, { useState } from "react";
import { MapPin, Phone, Mail, MessageCircle, Clock, Send } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { submitInquiry } from "@/lib/api";
import { SEO, trackEvent } from "@/components/SEO";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "Property Inquiry (Buy)", message: "" });

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

  return (
    <div className="min-h-screen bg-[#FDFDF8] pt-24 pb-20">
      <SEO
        title="Contact Us — Get in Touch with GIFT Real Estate"
        description="Contact GIFT Real Estate in Addis Ababa. Call, WhatsApp, or send a message to our expert team for property inquiries, viewings, and investment advice."
        path="/contact"
      />

      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#0F2E24] mb-4">Get in Touch</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Whether you're looking to buy, sell, or rent, our team of experts is ready to assist you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Form */}
          <div className="bg-white p-8 md:p-10 rounded-sm shadow-xl border-t-4 border-[#1C4C3B]">
            <h2 className="font-serif text-3xl font-bold text-[#0F2E24] mb-6">Send us a Message</h2>

            {inquiry.isSuccess ? (
              <div className="bg-green-50 text-green-800 p-6 rounded-sm text-center border border-green-200">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600"><Send size={24} /></div>
                <h3 className="font-bold text-xl mb-2">Message Sent Successfully!</h3>
                <p>Thank you for contacting GIFT Real Estate. An agent will be in touch shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">First Name *</label>
                    <input required type="text" value={form.name.split(" ")[0]} onChange={(e) => setForm({ ...form, name: `${e.target.value} ${form.name.split(" ").slice(1).join(" ")}`.trim() })} className="w-full border-b-2 border-gray-200 bg-gray-50 px-4 py-3 focus:outline-none focus:border-[#1C4C3B] transition-colors" placeholder="John" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Last Name</label>
                    <input type="text" onChange={(e) => setForm({ ...form, name: `${form.name.split(" ")[0]} ${e.target.value}`.trim() })} className="w-full border-b-2 border-gray-200 bg-gray-50 px-4 py-3 focus:outline-none focus:border-[#1C4C3B] transition-colors" placeholder="Doe" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Email Address *</label>
                  <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full border-b-2 border-gray-200 bg-gray-50 px-4 py-3 focus:outline-none focus:border-[#1C4C3B] transition-colors" placeholder="john@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Phone Number</label>
                  <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full border-b-2 border-gray-200 bg-gray-50 px-4 py-3 focus:outline-none focus:border-[#1C4C3B] transition-colors" placeholder="+251..." />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Subject</label>
                  <select value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="w-full border-b-2 border-gray-200 bg-gray-50 px-4 py-3 focus:outline-none focus:border-[#1C4C3B] transition-colors appearance-none">
                    <option>Property Inquiry (Buy)</option>
                    <option>Property Inquiry (Rent)</option>
                    <option>Property Management</option>
                    <option>Investment Consultation</option>
                    <option>General Inquiry</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Your Message *</label>
                  <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full border-b-2 border-gray-200 bg-gray-50 px-4 py-3 focus:outline-none focus:border-[#1C4C3B] transition-colors resize-none" placeholder="Tell us what you're looking for…" />
                </div>
                {inquiry.isError && <p className="text-red-600 text-sm">Failed to send. Please try again.</p>}
                <button type="submit" disabled={inquiry.isPending} className="w-full bg-[#1C4C3B] text-white px-8 py-4 font-bold tracking-widest uppercase rounded-sm hover:bg-[#0F2E24] transition-colors shadow-lg flex items-center justify-center gap-3 disabled:opacity-60">
                  <Send size={18} /> {inquiry.isPending ? "Sending…" : "Send Message"}
                </button>
              </form>
            )}
          </div>

          {/* Info */}
          <div className="space-y-10">
            <div>
              <h2 className="font-serif text-3xl font-bold text-[#0F2E24] mb-8">Contact Information</h2>
              <div className="space-y-6">
                {[
                  { icon: <MapPin className="text-[#D9B93C]" size={24} />, title: "Our Office", text: "Bole Sub-City, Woreda 03\nAddis Ababa, Ethiopia" },
                  { icon: <Phone className="text-[#D9B93C]" size={24} />, title: "Phone", text: "+251 11 465 1234\n+251 91 123 4567" },
                  { icon: <Mail className="text-[#D9B93C]" size={24} />, title: "Email", text: "info@giftrealestate.com\nsales@giftrealestate.com" },
                  { icon: <MessageCircle className="text-[#D9B93C]" size={24} />, title: "WhatsApp", text: "+251 91 123 4567" },
                  { icon: <Clock className="text-[#D9B93C]" size={24} />, title: "Business Hours", text: "Mon–Fri: 8:30am – 6:00pm\nSat: 9:00am – 3:00pm" },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-12 h-12 bg-[#1C4C3B]/10 rounded-sm flex items-center justify-center flex-shrink-0">{item.icon}</div>
                    <div>
                      <h3 className="font-bold text-[#0F2E24] text-sm uppercase tracking-wider mb-1">{item.title}</h3>
                      <p className="text-gray-600 whitespace-pre-line leading-relaxed">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-4">
              <a
                href="tel:+251114651234"
                onClick={() => trackEvent("cta_click", { button: "Call Now" })}
                className="flex-1 bg-[#1C4C3B] text-white px-6 py-4 rounded-sm font-bold text-center hover:bg-[#0F2E24] transition-colors"
              >
                Call Now
              </a>
              <a
                href="https://wa.me/251911234567"
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
