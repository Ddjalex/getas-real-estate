import React from "react";
import { Link } from "wouter";
import { Home, Key, Building, Settings, Briefcase, ArrowRight } from "lucide-react";

export default function Services() {
  const services = [
    {
      icon: <Home size={40} />,
      title: "Property Sales",
      desc: "Whether you are looking for a luxury villa in Old Airport or a modern apartment in Bole, our sales team guides you through the entire purchasing process. We handle viewings, negotiations, and ensure all legal documentation is flawless.",
    },
    {
      icon: <Key size={40} />,
      title: "Rental & Leasing",
      desc: "We connect landlords with high-quality tenants, including expats and diplomats. Our rigorous vetting process ensures reliable tenancy, and we help you find the perfect rental property that meets your exact lifestyle needs.",
    },
    {
      icon: <Settings size={40} />,
      title: "Property Management",
      desc: "Protect your investment with our comprehensive management services. We handle rent collection, routine maintenance, tenant disputes, and legal compliance so you can enjoy passive income without the operational headaches.",
    },
    {
      icon: <Briefcase size={40} />,
      title: "Investment Consultancy",
      desc: "Addis Ababa's real estate market is dynamic. Leverage our 34 years of data and experience to make informed investment decisions. We advise on high-yield areas, off-plan purchases, and commercial land acquisitions.",
    },
    {
      icon: <Building size={40} />,
      title: "Commercial Real Estate",
      desc: "From finding the perfect headquarters for your NGO to securing retail space in high-traffic zones, our commercial team understands the specific requirements of businesses operating in Ethiopia.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FDFDF8] pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <span className="text-[#D9B93C] font-bold tracking-widest uppercase text-sm mb-3 block">What We Do</span>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#0F2E24] mb-6">Comprehensive Real Estate Services</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            A full-service agency providing end-to-end solutions for buyers, sellers, landlords, and investors in Addis Ababa.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {services.map((service, idx) => (
            <div key={idx} className="bg-white p-8 rounded-sm shadow-sm border border-gray-100 hover:shadow-xl hover:border-[#1C4C3B]/30 transition-all group">
              <div className="text-[#1C4C3B] mb-6 group-hover:text-[#D9B93C] transition-colors bg-[#FDFDF8] w-20 h-20 rounded-full flex items-center justify-center border border-[#1C4C3B]/10">
                {service.icon}
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#0F2E24] mb-4">{service.title}</h3>
              <p className="text-gray-600 leading-relaxed mb-6">{service.desc}</p>
              <Link href="/contact" className="inline-flex items-center gap-2 text-[#1C4C3B] font-bold hover:text-[#D9B93C] transition-colors">
                Enquire Now <ArrowRight size={16} />
              </Link>
            </div>
          ))}
        </div>

        {/* Process Section */}
        <div className="bg-[#0F2E24] rounded-sm p-12 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#D9B93C] rounded-full blur-[100px] opacity-20 -mr-20 -mt-20"></div>
          <div className="relative z-10">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-12 text-center">The GIFT Experience</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { step: "01", title: "Consultation", desc: "We sit down to understand your exact requirements, budget, and timeline." },
                { step: "02", title: "Curation", desc: "Our team selects a tailored portfolio of properties that match your criteria." },
                { step: "03", title: "Viewing", desc: "Accompanied tours of shortlisted properties with honest, expert insights." },
                { step: "04", title: "Closing", desc: "We handle negotiations, legal checks, and paperwork for a seamless handover." }
              ].map((process, i) => (
                <div key={i} className="text-center">
                  <div className="text-5xl font-serif font-black text-[#1C4C3B] mb-4 opacity-50">{process.step}</div>
                  <h4 className="font-bold text-xl text-[#D9B93C] mb-2">{process.title}</h4>
                  <p className="text-white/70 text-sm">{process.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
