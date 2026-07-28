/**
 * Seed script — run once to populate DB from the existing static data files.
 * Usage: pnpm --filter @workspace/api-server run seed
 */
import { db, listingsTable, blogPostsTable, agentsTable, adminUsersTable } from "@workspace/db";
import bcrypt from "bcryptjs";

// ── Listings ────────────────────────────────────────────────────────────────
const listingsSeed = [
  {
    id: "luxury-villa-old-airport",
    slug: "luxury-villa-old-airport",
    title: "Magnificent Diplomatic Villa",
    type: "sale",
    price: "1250000",
    priceUnit: "USD",
    location: "Old Airport",
    neighborhood: "Diplomatic Zone",
    bedrooms: 5,
    bathrooms: 6,
    sizeSqm: 850,
    description: "An extraordinary residence located in the highly sought-after Old Airport diplomatic zone. This property features sprawling manicured gardens, a private swimming pool, and high-security walls. The interior boasts Italian marble flooring and custom woodwork throughout.",
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
      "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800",
    ],
    status: "Featured",
    featured: true,
    dateAdded: "2024-10-15T08:00:00Z",
  },
  {
    id: "modern-apartment-bole",
    slug: "modern-apartment-bole",
    title: "Bole Medhanialem Sky View Apartment",
    type: "sale",
    price: "280000",
    priceUnit: "USD",
    location: "Bole",
    neighborhood: "Medhanialem",
    bedrooms: 3,
    bathrooms: 2,
    sizeSqm: 145,
    description: "Experience modern Addis living at its finest. This 9th-floor luxury apartment offers panoramic views of the city skyline. Walking distance from major malls, cafes, and international standard restaurants. Fully equipped with a backup generator and 24/7 security.",
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800",
    ],
    status: "New",
    featured: true,
    dateAdded: "2024-11-01T10:30:00Z",
  },
  {
    id: "premium-office-kazanchis",
    slug: "premium-office-kazanchis",
    title: "ECA Adjacent Premium Office Space",
    type: "rent",
    price: "350000",
    priceUnit: "ETB/month",
    location: "Kazanchis",
    neighborhood: "ECA Area",
    bedrooms: 0,
    bathrooms: 4,
    sizeSqm: 400,
    description: "Strategically located open-plan office space just minutes from the UNECA headquarters. Features central AC, high-speed fiber internet ready, and dedicated underground parking for 4 vehicles. Ideal for international NGOs or corporate headquarters.",
    images: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800",
    ],
    status: "For Rent",
    featured: false,
    dateAdded: "2024-10-20T09:15:00Z",
  },
  {
    id: "family-home-cmc",
    slug: "family-home-cmc",
    title: "Contemporary Family Home",
    type: "rent",
    price: "120000",
    priceUnit: "ETB/month",
    location: "CMC",
    neighborhood: "Michael",
    bedrooms: 4,
    bathrooms: 3,
    sizeSqm: 250,
    description: "A beautifully maintained family home in a quiet, gated community in CMC. Features a large modern kitchen, spacious living areas, and a cozy backyard perfect for family gatherings. Close proximity to international schools and supermarkets.",
    images: [
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800",
    ],
    status: "For Rent",
    featured: true,
    dateAdded: "2024-11-05T14:00:00Z",
  },
  {
    id: "summit-luxury-residence",
    slug: "summit-luxury-residence",
    title: "Summit Luxury Residence",
    type: "sale",
    price: "680000",
    priceUnit: "USD",
    location: "Summit",
    neighborhood: "Fird Bet",
    bedrooms: 5,
    bathrooms: 4,
    sizeSqm: 450,
    description: "Elegant architecture defines this standalone house in Summit. Features high ceilings, a grand staircase, and a fully equipped chef's kitchen. The compound includes a small annex for staff and utility.",
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
    ],
    status: "New",
    featured: false,
    dateAdded: "2024-11-10T09:30:00Z",
  },
  {
    id: "bisrate-gabriel-condo",
    slug: "bisrate-gabriel-condo",
    title: "Upscale Condo Living",
    type: "rent",
    price: "85000",
    priceUnit: "ETB/month",
    location: "Bisrate Gabriel",
    neighborhood: "Laphto",
    bedrooms: 2,
    bathrooms: 2,
    sizeSqm: 110,
    description: "Fully furnished 2-bedroom condo located near Laphto Mall. Tastefully decorated with modern furniture, ready to move in. Includes access to building amenities such as a gym and communal terrace.",
    images: [
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
      "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800",
    ],
    status: "For Rent",
    featured: false,
    dateAdded: "2024-11-12T15:20:00Z",
  },
  {
    id: "gurd-shola-warehouse",
    slug: "gurd-shola-warehouse",
    title: "Spacious Commercial Warehouse",
    type: "rent",
    price: "450000",
    priceUnit: "ETB/month",
    location: "Gurd Shola",
    neighborhood: "Industrial Zone",
    bedrooms: 0,
    bathrooms: 2,
    sizeSqm: 1200,
    description: "Large capacity warehouse with high clearance, suitable for manufacturing or large-scale storage. Features heavy-vehicle access, a small integrated office block, and 3-phase electricity supply.",
    images: [
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
    ],
    status: "For Rent",
    featured: false,
    dateAdded: "2024-10-05T08:45:00Z",
  },
];

// ── Blog Posts ───────────────────────────────────────────────────────────────
const blogSeed = [
  {
    id: "addis-ababa-real-estate-trends-2024",
    slug: "addis-ababa-real-estate-trends-2024",
    title: "Addis Ababa Real Estate Trends to Watch in 2024",
    excerpt: "As the capital continues to expand, we explore the emerging neighborhoods and investment opportunities shaping the Ethiopian real estate market this year.",
    content: "The real estate market in Addis Ababa has seen unprecedented growth over the last decade. In 2024, we are witnessing a shift towards integrated community living and high-rise developments in areas like CMC and Ayat.\n\nHistorically, areas like Bole and Old Airport dominated luxury housing, but improving infrastructure and road networks are unlocking value in peripheral zones. Investors are increasingly looking at mixed-use developments that offer residential, commercial, and retail spaces in one location.\n\nAt GIFT Real Estate, we've observed a 25% year-over-year increase in inquiries for premium apartment complexes, indicating a strong preference for secure, managed properties over standalone houses among young professionals.",
    author: "Dawit Tadesse",
    date: "2024-11-05",
    category: "Market Insights",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800",
    publishedAt: "2024-11-05T09:00:00Z",
  },
  {
    id: "guide-to-buying-property-ethiopia",
    slug: "guide-to-buying-property-ethiopia",
    title: "A Comprehensive Guide to Buying Property in Ethiopia",
    excerpt: "Navigating the property market can be complex. Here is our step-by-step guide for diaspora and local buyers looking to invest in Addis Ababa.",
    content: "Purchasing property is one of the most significant investments you will make. For diaspora Ethiopians and locals alike, understanding the legal frameworks, financing options, and market dynamics is crucial.\n\nFirst, it's essential to verify the title deed and ensure the property is free from any encumbrances. Working with established real estate agencies like GIFT ensures that all due diligence is handled professionally.\n\nFinancing is another critical aspect. Several local banks now offer mortgage options specifically tailored for the diaspora community. When buying off-plan, always evaluate the track record of the developer. With over 34 years in the industry, GIFT Real Estate prides itself on delivering quality homes on schedule.",
    author: "Bethlehem Alemu",
    date: "2024-10-22",
    category: "Buying Guide",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
    publishedAt: "2024-10-22T09:00:00Z",
  },
  {
    id: "maximizing-rental-yields",
    slug: "maximizing-rental-yields",
    title: "How to Maximize Your Rental Yields in the Expat Market",
    excerpt: "Discover the key features and amenities that diplomats and expatriates look for when renting high-end properties in the capital.",
    content: "Addis Ababa's status as a major diplomatic hub creates a robust demand for high-quality rental properties. Landlords who cater to the specific needs of expatriates and diplomats can command premium rental rates.\n\nSecurity is paramount. Properties located in designated safe zones with high perimeter walls, backup generators, and robust water storage systems are highly sought after. Furthermore, modern finishing, reliable internet infrastructure, and well-maintained outdoor spaces significantly increase a property's appeal.\n\nFurnishing your property can also yield higher returns. Many expat tenants prefer turn-key solutions. Offering a tastefully furnished home with modern appliances can reduce vacancy periods and increase your monthly rental income by up to 30%.",
    author: "Yonas Mekonnen",
    date: "2024-10-10",
    category: "Investment Tips",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
    publishedAt: "2024-10-10T09:00:00Z",
  },
  {
    id: "sustainable-building-ethiopia",
    slug: "sustainable-building-ethiopia",
    title: "The Rise of Sustainable Architecture in Ethiopia",
    excerpt: "How modern Ethiopian developers are blending traditional design elements with contemporary sustainable building practices.",
    content: "Sustainability is no longer a buzzword; it is a necessity. As Addis Ababa grows, the environmental impact of construction is a pressing concern. Forward-thinking developers are now prioritizing energy efficiency and sustainable materials.\n\nWe are seeing an increase in the use of localized materials, which not only reduces the carbon footprint associated with transportation but also supports the local economy. Solar water heaters, rainwater harvesting systems, and passive cooling designs are becoming standard features in new premium developments.\n\nAt GIFT Real Estate, we are committed to integrating green building principles into our upcoming projects, ensuring that we not only build homes for today but preserve our beautiful city for future generations.",
    author: "Senait Gebre",
    date: "2024-09-28",
    category: "Architecture & Design",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
    publishedAt: "2024-09-28T09:00:00Z",
  },
];

// ── Agents ───────────────────────────────────────────────────────────────────
const agentsSeed = [
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
  },
];

async function seed() {
  console.log("Seeding database…");

  // Listings
  for (const listing of listingsSeed) {
    await db
      .insert(listingsTable)
      .values(listing)
      .onConflictDoNothing();
  }
  console.log(`✓ ${listingsSeed.length} listings`);

  // Blog posts
  for (const post of blogSeed) {
    await db
      .insert(blogPostsTable)
      .values(post)
      .onConflictDoNothing();
  }
  console.log(`✓ ${blogSeed.length} blog posts`);

  // Agents
  for (const agent of agentsSeed) {
    await db
      .insert(agentsTable)
      .values(agent)
      .onConflictDoNothing();
  }
  console.log(`✓ ${agentsSeed.length} agents`);

  // Default admin user (username: admin, password: gift2024!)
  // CHANGE THIS PASSWORD immediately after first login.
  const passwordHash = await bcrypt.hash("gift2024!", 12);
  await db
    .insert(adminUsersTable)
    .values({ username: "admin", passwordHash })
    .onConflictDoNothing();
  console.log("✓ Admin user (username: admin, password: gift2024! — CHANGE AFTER FIRST LOGIN)");

  console.log("✅ Seed complete");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
