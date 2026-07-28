import React, { useState } from "react";
import { MapPin, Phone, Mail, MessageCircle, Clock, Send } from "lucide-react";

export default function Contact() {
  const [formStatus, setFormStatus] = useState<"idle" | "submitted">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("submitted");
    setTimeout(() => setFormStatus("idle"), 3000);
  };

  return (
    <div className="min-h-screen bg-[#FDFDF8] pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#0F2E24] mb-4">Get in Touch</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Whether you're looking to buy, sell, or rent, our team of experts is ready to assist you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Contact Form */}
          <div className="bg-white p-8 md:p-10 rounded-sm shadow-xl border-t-4 border-[#1C4C3B]">
            <h2 className="font-serif text-3xl font-bold text-[#0F2E24] mb-6">Send us a Message</h2>
            
            {formStatus === "submitted" ? (
              <div className="bg-green-50 text-green-800 p-6 rounded-sm text-center border border-green-200">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                  <Send size={24} />
                </div>
                <h3 className="font-bold text-xl mb-2">Message Sent Successfully!</h3>
                <p>Thank you for contacting GIFT Real Estate. An agent will be in touch shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">First Name</label>
                    <input required type="text" className="w-full border-b-2 border-gray-200 bg-gray-50 px-4 py-3 focus:outline-none focus:border-[#1C4C3B] transition-colors" placeholder="John" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Last Name</label>
                    <input required type="text" className="w-full border-b-2 border-gray-200 bg-gray-50 px-4 py-3 focus:outline-none focus:border-[#1C4C3B] transition-colors" placeholder="Doe" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Email Address</label>
                  <input required type="email" className="w-full border-b-2 border-gray-200 bg-gray-50 px-4 py-3 focus:outline-none focus:border-[#1C4C3B] transition-colors" placeholder="john@example.com" />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Phone Number</label>
                  <input type="tel" className="w-full border-b-2 border-gray-200 bg-gray-50 px-4 py-3 focus:outline-none focus:border-[#1C4C3B] transition-colors" placeholder="+251..." />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Subject</label>
                  <select className="w-full border-b-2 border-gray-200 bg-gray-50 px-4 py-3 focus:outline-none focus:border-[#1C4C3B] transition-colors appearance-none">
                    <option>Property Inquiry (Buy)</option>
                    <option>Property Inquiry (Rent)</option>
                    <option>Property Management</option>
                    <option>General Question</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Message</label>
                  <textarea required rows={5} className="w-full border-b-2 border-gray-200 bg-gray-50 px-4 py-3 focus:outline-none focus:border-[#1C4C3B] transition-colors resize-none" placeholder="How can we help you?"></textarea>
                </div>
                
                <button type="submit" className="bg-[#1C4C3B] text-white px-8 py-4 rounded-sm font-bold hover:bg-[#0F2E24] transition-colors shadow-md w-full md:w-auto flex items-center justify-center gap-2">
                  <Send size={18} />
                  Submit Inquiry
                </button>
              </form>
            )}
          </div>

          {/* Contact Info & Map */}
          <div>
            <div className="bg-[#0F2E24] text-white p-8 rounded-sm mb-8 shadow-xl">
              <h3 className="font-serif text-2xl font-bold text-[#D9B93C] mb-8">Head Office</h3>
              
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center shrink-0">
                    <MapPin size={24} className="text-[#D9B93C]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Address</h4>
                    <p className="text-white/70">
                      GIFT Tower, 8th Floor<br />
                      Bole Road, Near Olympia<br />
                      Addis Ababa, Ethiopia
                    </p>
                  </div>
                </li>
                
                <li className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center shrink-0">
                    <Phone size={24} className="text-[#D9B93C]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Phone</h4>
                    <p className="text-white/70">+251 11 465 1234<br />+251 91 123 4567 (Mobile)</p>
                  </div>
                </li>

                <li className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center shrink-0">
                    <Mail size={24} className="text-[#D9B93C]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Email</h4>
                    <p className="text-white/70">info@giftrealestate.com<br />sales@giftrealestate.com</p>
                  </div>
                </li>

                <li className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center shrink-0">
                    <Clock size={24} className="text-[#D9B93C]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Business Hours</h4>
                    <p className="text-white/70">Monday - Friday: 8:30 AM - 5:30 PM<br />Saturday: 9:00 AM - 1:00 PM<br />Sunday: Closed</p>
                  </div>
                </li>
              </ul>

              <div className="mt-8 pt-8 border-t border-white/20">
                <a 
                  href="https://wa.me/251911234567" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-[#25D366] text-white px-6 py-4 rounded-sm font-bold hover:bg-[#128C7E] transition-colors"
                >
                  <MessageCircle size={24} />
                  Chat on WhatsApp
                </a>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="w-full h-[300px] bg-gray-200 rounded-sm border border-gray-300 flex flex-col items-center justify-center text-gray-500 overflow-hidden shadow-sm">
              <MapPin size={48} className="mb-4 text-[#1C4C3B]/50" />
              <p className="font-bold text-lg">GIFT Tower Location</p>
              <p className="text-sm">(Interactive map coming soon)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
