/**
 * Quick smoke-test for SSR meta tag injection.
 * Run: tsx --tsconfig tsconfig.json src/scripts/test-seo.ts
 */
import { readFileSync, writeFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { db, listingsTable, blogPostsTable } from "@workspace/db";
import { asc } from "drizzle-orm";
import {
  loadHtmlTemplate,
  buildHomeHtml,
  buildListingHtml,
  buildBlogPostHtml,
} from "../lib/seo.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load the index.html from the frontend source (stand-in for the production build)
const templatePath = path.resolve(__dirname, "../../../../artifacts/gift-real-estate/index.html");
const rawTemplate = readFileSync(templatePath, "utf-8");

// Patch loadHtmlTemplate to use the dev template file
// (in production it reads from dist/public/index.html)
const fakePublicDir = path.dirname(templatePath);
loadHtmlTemplate(fakePublicDir);

const BASE = "https://giftrealestate.com";

async function checkTags(label: string, html: string | null) {
  if (!html) { console.error(`❌ ${label}: returned null`); return; }

  const title = html.match(/<title>([^<]+)<\/title>/)?.[1] ?? "(not found)";
  const desc  = html.match(/<meta name="description" content="([^"]+)"/)?.[1] ?? "(not found)";
  const ogTitle = html.match(/<meta property="og:title" content="([^"]+)"/)?.[1] ?? "(not found)";
  const ogImg   = html.match(/<meta property="og:image" content="([^"]+)"/)?.[1] ?? "(not found)";
  const ogUrl   = html.match(/<meta property="og:url" content="([^"]+)"/)?.[1] ?? "(not found)";
  const hasJsonLd = html.includes('application/ld+json');

  const generic = "GIFT Real Estate — built on Replit";
  const isGeneric = title.includes(generic) || desc.includes(generic);

  console.log(`\n${isGeneric ? "❌" : "✅"} ${label}`);
  console.log(`   title     : ${title.slice(0, 80)}`);
  console.log(`   desc      : ${desc.slice(0, 80)}`);
  console.log(`   og:title  : ${ogTitle.slice(0, 80)}`);
  console.log(`   og:image  : ${ogImg.slice(0, 80)}`);
  console.log(`   og:url    : ${ogUrl.slice(0, 80)}`);
  console.log(`   JSON-LD   : ${hasJsonLd ? "present ✓" : "MISSING ✗"}`);
}

const [firstListing] = await db.select().from(listingsTable).orderBy(asc(listingsTable.createdAt)).limit(1);
const [firstPost]    = await db.select().from(blogPostsTable).orderBy(asc(blogPostsTable.publishedAt)).limit(1);

console.log(`\nUsing listing slug: ${firstListing?.slug}`);
console.log(`Using blog slug   : ${firstPost?.slug}`);

await checkTags("Homepage",                  await buildHomeHtml(BASE));
await checkTags(`Listing (${firstListing?.slug})`,  await buildListingHtml(firstListing?.slug ?? "", BASE));
await checkTags(`Blog post (${firstPost?.slug})`,   await buildBlogPostHtml(firstPost?.slug ?? "", BASE));

// Also verify a bad slug returns null
const nullResult = await buildListingHtml("nonexistent-slug-xyz", BASE);
console.log(`\n${nullResult === null ? "✅" : "❌"} Unknown slug correctly returns null`);

process.exit(0);
