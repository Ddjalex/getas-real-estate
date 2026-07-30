import React from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { fetchBlogPosts } from "@/lib/api";
import { SEO } from "@/components/SEO";
import { ArrowRight, Calendar, User } from "lucide-react";

const BASE = import.meta.env.BASE_URL?.replace(/\/$/, "") ?? "";
const STORAGE_BASE = `${BASE}/api/storage`;
function resolveImg(path: string) {
  if (!path) return path;
  if (path.startsWith("http")) return path;
  if (path.startsWith("/objects/")) return `${STORAGE_BASE}${path}`;
  return path;
}

export default function Blog() {
  const { data: blogPosts = [], isLoading } = useQuery({
    queryKey: ["blog"],
    queryFn: () => fetchBlogPosts(),
  });

  return (
    <div className="min-h-screen bg-[#FFFFFF] pt-24 pb-20">
      <SEO
        title="Market Insights — Real Estate News & Investment Tips"
        description="Expert analysis, investment tips, and the latest news on the Addis Ababa real estate market from GETAS Real Estate's team of professionals."
        path="/blog"
      />

      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-16">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#1A1A1A] mb-4">Market Insights</h1>
          <p className="text-gray-600 text-lg max-w-2xl">
            Expert analysis, investment tips, and the latest news on the Addis Ababa real estate market.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {[1,2,3,4].map((i) => <div key={i} className="h-96 bg-gray-100 rounded-sm animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {blogPosts.map((post) => (
              <article key={post.id} className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden group hover:shadow-xl transition-shadow flex flex-col">
                <Link href={`/blog/${post.id}`} className="block aspect-[16/9] overflow-hidden relative">
                  <span className="absolute top-4 left-4 z-10 bg-[#E31E24] text-[#1A1A1A] px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-sm shadow-sm">
                    {post.category}
                  </span>
                  <img
                    src={resolveImg(post.image)}
                    alt={`${post.title} — GETAS Real Estate`}
                    width={800} height={450}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </Link>
                <div className="p-8 flex flex-col flex-grow">
                  <div className="flex items-center gap-4 text-xs text-gray-500 uppercase tracking-wider mb-4 font-bold">
                    <span className="flex items-center gap-1"><Calendar size={14} className="text-[#E31E24]" /> {new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
                    <span className="flex items-center gap-1"><User size={14} className="text-[#E31E24]" /> {post.author}</span>
                  </div>
                  <h2 className="font-serif text-2xl font-bold text-[#1A1A1A] mb-4 group-hover:text-[#E31E24] transition-colors">
                    <Link href={`/blog/${post.id}`}>{post.title}</Link>
                  </h2>
                  <p className="text-gray-600 line-clamp-3 mb-6 flex-grow">{post.excerpt}</p>
                  <Link href={`/blog/${post.id}`} className="inline-flex items-center gap-2 text-[#E31E24] font-bold hover:text-[#E31E24] transition-colors mt-auto">
                    Read Article <ArrowRight size={16} />
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
