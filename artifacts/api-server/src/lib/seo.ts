import { readFileSync } from "fs";
import path from "path";
import { db, listingsTable, blogPostsTable, siteSettingsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

// ---------------------------------------------------------------------------
// Template loading (once at startup)
// ---------------------------------------------------------------------------

let _template: string | null = null;

export function loadHtmlTemplate(publicDir: string): void {
  const templatePath = path.join(publicDir, "index.html");
  _template = readFileSync(templatePath, "utf-8");
}

function getTemplate(): string {
  if (!_template) throw new Error("HTML template not loaded — call loadHtmlTemplate first");
  return _template;
}

// ---------------------------------------------------------------------------
// Tag injection helpers
// ---------------------------------------------------------------------------

interface MetaTags {
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogUrl: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  jsonLd: object;
}

function injectTags(html: string, tags: MetaTags): string {
  let out = html;

  // <title>
  out = out.replace(/<title>[^<]*<\/title>/, `<title>${esc(tags.title)}</title>`);

  // <meta name="description">
  out = out.replace(
    /<meta name="description"[^>]*>/,
    `<meta name="description" content="${attr(tags.description)}" />`,
  );

  // OG tags
  out = out.replace(
    /<meta property="og:title"[^>]*>/,
    `<meta property="og:title" content="${attr(tags.ogTitle)}" />`,
  );
  out = out.replace(
    /<meta property="og:description"[^>]*>/,
    `<meta property="og:description" content="${attr(tags.ogDescription)}" />`,
  );
  out = out.replace(
    /<meta property="og:image"[^>]*>/,
    `<meta property="og:image" content="${attr(tags.ogImage)}" />`,
  );
  out = out.replace(
    /<meta property="og:url"[^>]*>/,
    `<meta property="og:url" content="${attr(tags.ogUrl)}" />`,
  );

  // Twitter tags
  out = out.replace(
    /<meta name="twitter:title"[^>]*>/,
    `<meta name="twitter:title" content="${attr(tags.twitterTitle)}" />`,
  );
  out = out.replace(
    /<meta name="twitter:description"[^>]*>/,
    `<meta name="twitter:description" content="${attr(tags.twitterDescription)}" />`,
  );
  // twitter:image may or may not exist in the template; add if missing
  if (/<meta name="twitter:image"[^>]*>/.test(out)) {
    out = out.replace(
      /<meta name="twitter:image"[^>]*>/,
      `<meta name="twitter:image" content="${attr(tags.twitterImage)}" />`,
    );
  } else {
    out = out.replace(
      /<meta name="twitter:description"[^>]*/,
      `<meta name="twitter:description" content="${attr(tags.twitterDescription)}" />\n    <meta name="twitter:image" content="${attr(tags.twitterImage)}"`,
    );
  }

  // JSON-LD — inject just before </head>
  const jsonLdBlock = `\n  <script type="application/ld+json">\n${JSON.stringify(tags.jsonLd, null, 2)}\n  </script>`;
  out = out.replace("</head>", `${jsonLdBlock}\n</head>`);

  return out;
}

// Escape HTML entities for text content
function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
// Escape for attribute values (double-quote safe)
function attr(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Truncate a string to a max length, appending "…" if cut
function truncate(s: string, max: number): string {
  if (s.length <= max) return s;
  return s.slice(0, max - 1) + "…";
}

// ---------------------------------------------------------------------------
// Per-route HTML generators
// ---------------------------------------------------------------------------

export async function buildHomeHtml(baseUrl: string): Promise<string | null> {
  // Pull tagline / description from site_settings if available
  const rows = await db.select().from(siteSettingsTable);
  const settings = Object.fromEntries(rows.map((r) => [r.key, r.value]));

  const description =
    settings["site_description"] ??
    "Discover premium homes, luxury apartments, and prime commercial spaces in Addis Ababa with GIFT Real Estate — 34 years of excellence.";

  const tags: MetaTags = {
    title: settings["site_title"] ?? "GIFT Real Estate — Addis Ababa's Most Trusted Property Partner",
    description,
    ogTitle: settings["site_title"] ?? "GIFT Real Estate — Addis Ababa's Most Trusted Property Partner",
    ogDescription: description,
    ogImage: `${baseUrl}/logo.png`,
    ogUrl: baseUrl,
    twitterTitle: settings["site_title"] ?? "GIFT Real Estate — Addis Ababa's Most Trusted Property Partner",
    twitterDescription: description,
    twitterImage: `${baseUrl}/logo.png`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "RealEstateAgent",
      name: "GIFT Real Estate",
      description,
      url: baseUrl,
      logo: `${baseUrl}/logo.png`,
      telephone: "+251114651234",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Addis Ababa",
        addressCountry: "ET",
      },
      foundingDate: "1990",
    },
  };

  return injectTags(getTemplate(), tags);
}

export async function buildListingHtml(slug: string, baseUrl: string): Promise<string | null> {
  const [listing] = await db
    .select()
    .from(listingsTable)
    .where(eq(listingsTable.slug, slug));

  if (!listing) return null;

  const priceFormatted = Number(listing.price).toLocaleString("en-US");
  const title = `${listing.title} — ${listing.status} | GIFT Real Estate`;
  const description = truncate(
    `${listing.status} in ${listing.neighborhood}. ${listing.bedrooms} bed, ${listing.bathrooms} bath, ${listing.sizeSqm} m². ${listing.priceUnit === "ETB/month" ? `ETB ${priceFormatted}/month` : `USD ${priceFormatted}`}. ${listing.description}`,
    160,
  );
  const image = listing.images?.[0] ?? `${baseUrl}/logo.png`;
  const url = `${baseUrl}/properties/${listing.slug}`;

  const tags: MetaTags = {
    title,
    description,
    ogTitle: title,
    ogDescription: description,
    ogImage: image,
    ogUrl: url,
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: image,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Residence",
      name: listing.title,
      description: listing.description,
      url,
      image: listing.images ?? [],
      numberOfRooms: listing.bedrooms,
      floorSize: {
        "@type": "QuantitativeValue",
        value: listing.sizeSqm,
        unitCode: "MTK",
      },
      address: {
        "@type": "PostalAddress",
        addressLocality: listing.neighborhood,
        addressRegion: listing.location,
        addressCountry: "ET",
      },
      offers: {
        "@type": "Offer",
        price: listing.price,
        priceCurrency: listing.priceUnit.includes("ETB") ? "ETB" : "USD",
        availability: "https://schema.org/InStock",
      },
    },
  };

  return injectTags(getTemplate(), tags);
}

export async function buildBlogPostHtml(slug: string, baseUrl: string): Promise<string | null> {
  const [post] = await db
    .select()
    .from(blogPostsTable)
    .where(eq(blogPostsTable.slug, slug));

  if (!post) return null;

  const title = `${post.title} | GIFT Real Estate Blog`;
  const description = truncate(post.excerpt, 160);
  // Avoid prepending the base URL to data URIs or already-absolute URLs
  const image =
    post.image.startsWith("http") || post.image.startsWith("data:")
      ? post.image
      : `${baseUrl}${post.image}`;
  const url = `${baseUrl}/blog/${post.slug}`;

  const tags: MetaTags = {
    title,
    description,
    ogTitle: title,
    ogDescription: description,
    ogImage: image,
    ogUrl: url,
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: image,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt,
      image,
      url,
      datePublished: post.date,
      author: {
        "@type": "Person",
        name: post.author,
      },
      publisher: {
        "@type": "Organization",
        name: "GIFT Real Estate",
        logo: {
          "@type": "ImageObject",
          url: `${baseUrl}/logo.png`,
        },
      },
    },
  };

  return injectTags(getTemplate(), tags);
}
