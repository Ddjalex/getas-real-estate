import React, { useEffect, useRef } from "react";
import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { fetchBlogPost, fetchBlogPosts } from "@/lib/api";
import { SEO, breadcrumbJsonLd } from "@/components/SEO";
import { Calendar, User, ArrowLeft, ArrowRight } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const BASE = import.meta.env.BASE_URL?.replace(/\/$/, "") ?? "";
const STORAGE_BASE = `${BASE}/api/storage`;
function resolveImg(path: string) {
  if (!path) return path;
  if (path.startsWith("http")) return path;
  if (path.startsWith("/objects/")) return `${STORAGE_BASE}${path}`;
  return path;
}

export default function BlogPost() {
  const pageRef = useRef<HTMLDivElement>(null);
  useScrollReveal(pageRef);

  const { id } = useParams();

  const { data: post, isLoading, isError } = useQuery({
    queryKey: ["blog", id],
    queryFn: () => fetchBlogPost(id!),
    enabled: !!id,
  });

  const { data: allPosts = [] } = useQuery({
    queryKey: ["blog"],
    queryFn: () => fetchBlogPosts(),
  });

  useEffect(() => { window.scrollTo(0, 0); }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FFFFFF] pt-24 pb-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="h-8 w-48 bg-gray-100 animate-pulse mb-8" />
          <div className="h-12 w-3/4 bg-gray-100 animate-pulse mb-4" />
          <div className="h-72 bg-gray-100 animate-pulse" />
        </div>
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-20 text-center">
        <h1 className="font-bold text-4xl text-[#1A1A1A] mb-4">Article Not Found</h1>
        <Link href="/blog" className="bg-[#E31E24] text-white px-6 py-3 font-bold text-xs tracking-widest uppercase hover:bg-[#1A1A1A] transition-colors">Back to Market Insights</Link>
      </div>
    );
  }

  const recentPosts = allPosts.filter((p) => p.id !== id).slice(0, 3);

  const blogPostJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.image,
    author: { "@type": "Person", name: post.author },
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    publisher: {
      "@type": "Organization",
      name: "GETAS Real Estate",
      logo: { "@type": "ImageObject", url: "https://getasrealestate.et/logo.png" },
    },
  };

  return (
    <div ref={pageRef} className="min-h-screen bg-[#FFFFFF] pt-24 pb-20">
      <SEO
        title={post.title}
        description={post.excerpt}
        image={post.image}
        path={`/blog/${post.id}`}
        type="article"
        jsonLd={[blogPostJsonLd, breadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: "Market Insights", url: "/blog" },
          { name: post.title, url: `/blog/${post.id}` },
        ])]}
      />

      <div className="container mx-auto px-4 max-w-6xl">
        <Link href="/blog" className="inline-flex items-center gap-2 text-gray-400 hover:text-[#E31E24] mb-8 font-bold text-xs uppercase tracking-widest transition-colors">
          <ArrowLeft size={14} /> Back to Market Insights
        </Link>

        <div data-reveal className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Article */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <span className="text-[#E31E24] font-bold tracking-[0.2em] uppercase text-xs mb-4 block">{post.category}</span>
              <h1 className="font-bold text-4xl md:text-5xl text-[#1A1A1A] mb-6 leading-tight tracking-tight">{post.title}</h1>
              <div className="flex flex-wrap items-center gap-6 text-xs text-gray-400 font-bold uppercase tracking-wider pb-8 border-b border-gray-100">
                <div className="flex items-center gap-2"><User size={14} className="text-[#E31E24]" /> By {post.author}</div>
                <div className="flex items-center gap-2"><Calendar size={14} className="text-[#E31E24]" /> {new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</div>
              </div>
            </div>

            <div className="aspect-[21/9] mb-10 overflow-hidden bg-[#0D0D0D]">
              <img src={resolveImg(post.image)} alt={post.title} width={1200} height={514} loading="lazy" className="w-full h-full object-cover" />
            </div>

            <div className="prose prose-lg prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-[#1A1A1A] prose-headings:font-sans text-gray-700 max-w-none">
              <p className="whitespace-pre-line leading-relaxed text-lg">{post.content}</p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Expert CTA */}
            <div className="bg-[#0D0D0D] border-t-4 border-[#E31E24] text-white p-8 mb-8">
              <div className="h-0.5 w-8 bg-[#E31E24] mb-5" />
              <h3 className="font-bold text-xl mb-3 tracking-tight">Need Expert Advice?</h3>
              <p className="text-white/50 mb-6 text-sm leading-relaxed">Our team of real estate professionals is ready to help you make the right investment decision.</p>
              <Link href="/contact" className="block w-full bg-[#E31E24] text-white px-6 py-3 font-bold text-xs tracking-widest uppercase text-center hover:bg-white hover:text-[#1A1A1A] transition-colors">
                Contact an Agent
              </Link>
            </div>

            {/* Recent Articles */}
            {recentPosts.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-4 w-1 bg-[#E31E24]" />
                  <h3 className="font-bold text-sm text-[#1A1A1A] uppercase tracking-widest">Recent Articles</h3>
                </div>
                <div className="space-y-0 border border-gray-100">
                  {recentPosts.map((p, i) => (
                    <Link key={p.id} href={`/blog/${p.id}`} className={`flex gap-4 group p-4 hover:bg-gray-50 transition-colors ${i > 0 ? "border-t border-gray-100" : ""}`}>
                      <div className="w-20 h-16 bg-gray-100 overflow-hidden flex-shrink-0">
                        <img src={resolveImg(p.image)} alt={p.title} width={80} height={64} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">{new Date(p.date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</p>
                        <h4 className="font-bold text-[#1A1A1A] text-sm leading-snug group-hover:text-[#E31E24] transition-colors line-clamp-2">{p.title}</h4>
                      </div>
                    </Link>
                  ))}
                </div>
                <Link href="/blog" className="inline-flex items-center gap-2 text-[#E31E24] font-bold text-xs uppercase tracking-widest hover:gap-4 transition-all mt-6">
                  All Articles <ArrowRight size={12} />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
