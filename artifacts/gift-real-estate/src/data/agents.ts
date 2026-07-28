export interface Agent {
  id: string;
  name: string;
  role: string;
  phone: string;
  email: string;
  bio: string;
  image: string;
}

export const agents: Agent[] = [
  {
    id: "dawit-tadesse",
    name: "Dawit Tadesse",
    role: "Managing Director",
    phone: "+251 91 123 4567",
    email: "dawit@giftrealestate.com",
    bio: "With over 25 years of experience in the Ethiopian real estate market, Dawit has been instrumental in shaping GIFT's vision and leading high-profile commercial and residential projects across Addis Ababa.",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400",
  },
  {
    id: "bethlehem-alemu",
    name: "Bethlehem Alemu",
    role: "Senior Investment Consultant",
    phone: "+251 91 234 5678",
    email: "bethlehem@giftrealestate.com",
    bio: "Bethlehem specializes in diaspora investments and luxury properties. Her deep understanding of the local market dynamics helps clients make informed, highly profitable investment decisions.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400",
  },
  {
    id: "yonas-mekonnen",
    name: "Yonas Mekonnen",
    role: "Head of Property Management",
    phone: "+251 92 345 6789",
    email: "yonas@giftrealestate.com",
    bio: "Yonas leads our property management division, ensuring that both landlords and tenants receive exceptional service. He manages a portfolio of over 200 premium rental properties in the capital.",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400",
  },
  {
    id: "senait-gebre",
    name: "Senait Gebre",
    role: "Lead Sales Agent - Residential",
    phone: "+251 93 456 7890",
    email: "senait@giftrealestate.com",
    bio: "Known for her relentless dedication and unparalleled client service, Senait is our top residential sales agent. She excels at finding the perfect home for families in Addis Ababa's most desirable neighborhoods.",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400",
  },
  {
    id: "abebe-kebede",
    name: "Abebe Kebede",
    role: "Commercial Real Estate Expert",
    phone: "+251 94 567 8901",
    email: "abebe@giftrealestate.com",
    bio: "Abebe focuses exclusively on commercial real estate, assisting businesses, NGOs, and corporations in securing prime office spaces and commercial plots that drive their operations forward.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
  }
];
