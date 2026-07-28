export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  image: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: "addis-ababa-real-estate-trends-2024",
    title: "Addis Ababa Real Estate Trends to Watch in 2024",
    excerpt: "As the capital continues to expand, we explore the emerging neighborhoods and investment opportunities shaping the Ethiopian real estate market this year.",
    content: "The real estate market in Addis Ababa has seen unprecedented growth over the last decade. In 2024, we are witnessing a shift towards integrated community living and high-rise developments in areas like CMC and Ayat. \n\nHistorically, areas like Bole and Old Airport dominated luxury housing, but improving infrastructure and road networks are unlocking value in peripheral zones. Investors are increasingly looking at mixed-use developments that offer residential, commercial, and retail spaces in one location. This is driven by the growing middle class and the continued presence of international organizations in the diplomatic capital of Africa.\n\nAt GIFT Real Estate, we've observed a 25% year-over-year increase in inquiries for premium apartment complexes, indicating a strong preference for secure, managed properties over standalone houses among young professionals.",
    author: "Dawit Tadesse",
    date: "2024-11-05",
    category: "Market Insights",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800",
  },
  {
    id: "guide-to-buying-property-ethiopia",
    title: "A Comprehensive Guide to Buying Property in Ethiopia",
    excerpt: "Navigating the property market can be complex. Here is our step-by-step guide for diaspora and local buyers looking to invest in Addis Ababa.",
    content: "Purchasing property is one of the most significant investments you will make. For diaspora Ethiopians and locals alike, understanding the legal frameworks, financing options, and market dynamics is crucial.\n\nFirst, it's essential to verify the title deed and ensure the property is free from any encumbrances. Working with established real estate agencies like GIFT ensures that all due diligence is handled professionally. \n\nFinancing is another critical aspect. Several local banks now offer mortgage options specifically tailored for the diaspora community. When buying off-plan, always evaluate the track record of the developer. With over 34 years in the industry, GIFT Real Estate prides itself on delivering quality homes on schedule.",
    author: "Bethlehem Alemu",
    date: "2024-10-22",
    category: "Buying Guide",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
  },
  {
    id: "maximizing-rental-yields",
    title: "How to Maximize Your Rental Yields in the Expat Market",
    excerpt: "Discover the key features and amenities that diplomats and expatriates look for when renting high-end properties in the capital.",
    content: "Addis Ababa's status as a major diplomatic hub creates a robust demand for high-quality rental properties. Landlords who cater to the specific needs of expatriates and diplomats can command premium rental rates.\n\nSecurity is paramount. Properties located in designated safe zones with high perimeter walls, backup generators, and robust water storage systems are highly sought after. Furthermore, modern finishing, reliable internet infrastructure, and well-maintained outdoor spaces significantly increase a property's appeal.\n\nFurnishing your property can also yield higher returns. Many expat tenants prefer turn-key solutions. Offering a tastefully furnished home with modern appliances can reduce vacancy periods and increase your monthly rental income by up to 30%.",
    author: "Yonas Mekonnen",
    date: "2024-10-10",
    category: "Investment Tips",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
  },
  {
    id: "sustainable-building-ethiopia",
    title: "The Rise of Sustainable Architecture in Ethiopia",
    excerpt: "How modern Ethiopian developers are blending traditional design elements with contemporary sustainable building practices.",
    content: "Sustainability is no longer a buzzword; it is a necessity. As Addis Ababa grows, the environmental impact of construction is a pressing concern. Forward-thinking developers are now prioritizing energy efficiency and sustainable materials.\n\nWe are seeing an increase in the use of localized materials, which not only reduces the carbon footprint associated with transportation but also supports the local economy. Solar water heaters, rainwater harvesting systems, and passive cooling designs are becoming standard features in new premium developments.\n\nAt GIFT Real Estate, we are committed to integrating green building principles into our upcoming projects, ensuring that we not only build homes for today but preserve our beautiful city for future generations.",
    author: "Senait Gebre",
    date: "2024-09-28",
    category: "Architecture & Design",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
  }
];
