import React, { useRef } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { fetchBlogPosts } from "@/lib/api";
import { SEO } from "@/components/SEO";
import { ArrowRight, Calendar, User } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const BASE = import.meta.env.BASE_URL?.replace(/\/$/, "") ?? "";
const STORAGE_BASE = `${BASE}/api/storage`;
function resolveImg(path: string) {
  if (!path) return path;
  if (path.startsWith("http")) return path;
  if (path.startsWith("/objects/")) return `${STORAGE_BASE}${path}`;
  return path;
}

export default function Blog() {
  const pageRef = useRef<HTMLDivElement>(null);
  useScrollReveal(pageRef);

  const { data: blogPosts = [], isLoading } = useQuery({
    queryKey: ["blog"],
    queryFn: () => fetchBlogPosts(),
  });

  return (
    <div ref={pageRef} className="min-h-screen bg-[#FFFFFF] pt-24 pb-20">
      <SEO
        title="Market Insights — Real Estate News & Investment Tips"
        description="Expert analysis, investment tips, and the latest news on the Addis Ababa real estate market from GETAS Real Estate's team of professionals."
        path="/blog"
      />

      {/* Page Hero */}
      <div data-reveal className="bg-[#1A1A1A] border-t-4 border-[#E31E24] py-14 mb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="h-0.5 w-12 bg-[#E31E24] mb-4" />
          <p className="text-[#E31E24] font-bold tracking-[0.2em] uppercase text-xs mb-3">ANALYSIS & INTELLIGENCE</p>
          <h1 className="font-bold text-4xl md:text-5xl text-white tracking-tight mb-3">
            Market Insights
          </h1>
          <p className="text-white/60 text-base max-w-2xl">
            Expert analysis, investment tips, and the latest news on the Addis Ababa real estate market.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {[1,2,3,4].map((i) => <div key={i} className="h-96 bg-gray-100 animate-pulse" />)}
          </div>
        ) : blogPosts.length === 0 ? (
          <div className="text-center py-20 border border-gray-100 bg-gray-50">
            <p className="font-bold text-[#1A1A1A] text-lg mb-2">No articles published yet.</p>
            <p className="text-gray-400 text-sm">Check back soon for market insights and investment tips.</p>
          </div>
        ) : (
          <div data-reveal className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {blogPosts.map((post) => (
              <article key={post.id} className="bg-white border border-gray-100 overflow-hidden group hover:border-[#E31E24]/30 transition-colors flex flex-col">
                <Link href={`/blog/${post.id}`} className="block aspect-[16/9] overflow-hidden relative bg-[#0D0D0D]">
                  <span className="absolute top-4 left-4 z-10 bg-[#E31E24] text-white px-3 py-1 text-xs font-bold uppercase tracking-wider">
                    {post.category}
                  </span>
                  <img
                    src={resolveImg(post.image)}
                    alt={`${post.title} — GETAS Real Estate`}
                    width={800} height={450}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                  />
                </Link>
                <div className="p-8 flex flex-col flex-grow border-t-4 border-transparent group-hover:border-[#E31E24] transition-colors">
                  <div className="flex items-center gap-4 text-xs text-gray-400 uppercase tracking-wider mb-4 font-bold">
                    <span className="flex items-center gap-1.5"><Calendar size={12} className="text-[#E31E24]" /> {new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
                    <span className="flex items-center gap-1.5"><User size={12} className="text-[#E31E24]" /> {post.author}</span>
                  </div>
                  <h2 className="font-bold text-2xl text-[#1A1A1A] mb-4 tracking-tight group-hover:text-[#E31E24] transition-colors leading-tight">
                    <Link href={`/blog/${post.id}`}>{post.title}</Link>
                  </h2>
                  <p className="text-gray-500 text-sm line-clamp-3 mb-6 flex-grow leading-relaxed">{post.excerpt}</p>
                  <Link href={`/blog/${post.id}`} className="inline-flex items-center gap-2 text-[#E31E24] font-bold text-xs uppercase tracking-widest hover:gap-4 transition-all mt-auto">
                    Read Article <ArrowRight size={14} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
