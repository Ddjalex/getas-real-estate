import { Helmet } from "react-helmet-async";

const SITE_NAME = "GIFT Real Estate";
const DEFAULT_DESCRIPTION =
  "Addis Ababa's most trusted real estate agency since 1990. Browse premium properties for sale and rent in Ethiopia.";
const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200";
const SITE_URL = "https://giftrealestate.et";

// Replace with real GA4 Measurement ID when available
const GA4_ID = "G-XXXXXXXXXX";
// Replace with real Search Console verification token
const GSC_TOKEN = "your-google-site-verification-token";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  path?: string;
  type?: "website" | "article" | "product";
  noindex?: boolean;
  jsonLd?: object | object[];
}

export function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  image = DEFAULT_IMAGE,
  path = "",
  type = "website",
  noindex = false,
  jsonLd,
}: SEOProps) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Premium Real Estate in Addis Ababa`;
  const canonical = `${SITE_URL}${path}`;
  const ogImage = image.startsWith("http") ? image : `${SITE_URL}${image}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />

      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Google Search Console verification placeholder */}
      <meta name="google-site-verification" content={GSC_TOKEN} />

      {/* Open Graph */}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={canonical} />
      <meta property="og:type" content={type} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* JSON-LD structured data */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(Array.isArray(jsonLd) ? jsonLd : [jsonLd])}
        </script>
      )}

      {/* GA4 — replace G-XXXXXXXXXX with your Measurement ID */}
      <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`} />
      <script>{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${GA4_ID}');
      `}</script>
    </Helmet>
  );
}

// ── Structured data helpers ──────────────────────────────────────────────────

export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["RealEstateAgent", "LocalBusiness"],
    name: "GIFT Real Estate",
    url: SITE_URL,
    logo: `${SITE_URL}/gift-logo.png`,
    image: DEFAULT_IMAGE,
    description: DEFAULT_DESCRIPTION,
    foundingDate: "1990",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Addis Ababa",
      addressCountry: "ET",
    },
    telephone: "",
    priceRange: "$$$$",
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  };
}

// GA4 event tracker
export function trackEvent(
  eventName: string,
  params?: Record<string, string | number | boolean>
) {
  if (typeof window !== "undefined" && (window as Window & { gtag?: (...args: unknown[]) => void }).gtag) {
    (window as Window & { gtag?: (...args: unknown[]) => void }).gtag?.("event", eventName, params);
  }
}
