import React, { useEffect } from "react";
import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { fetchBlogPost, fetchBlogPosts } from "@/lib/api";
import { SEO, breadcrumbJsonLd } from "@/components/SEO";
import { Calendar, User, ArrowLeft } from "lucide-react";

const BASE = import.meta.env.BASE_URL?.replace(/\/$/, "") ?? "";
const STORAGE_BASE = `${BASE}/api/storage`;
function resolveImg(path: string) {
  if (!path) return path;
  if (path.startsWith("http")) return path;
  if (path.startsWith("/objects/")) return `${STORAGE_BASE}${path}`;
  return path;
}

export default function BlogPost() {
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
          <div className="h-8 w-48 bg-gray-100 rounded animate-pulse mb-8" />
          <div className="h-12 w-3/4 bg-gray-100 rounded animate-pulse mb-4" />
          <div className="h-72 bg-gray-100 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-20 text-center">
        <h1 className="font-serif text-4xl font-bold text-[#1A1A1A] mb-4">Article Not Found</h1>
        <Link href="/blog" className="bg-[#E31E24] text-white px-6 py-2 rounded-sm">Back to Blog</Link>
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
    <div className="min-h-screen bg-[#FFFFFF] pt-24 pb-20">
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
        <Link href="/blog" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#E31E24] mb-8 font-medium transition-colors">
          <ArrowLeft size={16} /> Back to Market Insights
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <div className="mb-8">
              <span className="text-[#E31E24] font-bold tracking-widest uppercase text-sm mb-4 block">{post.category}</span>
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#1A1A1A] mb-6 leading-tight">{post.title}</h1>
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 font-medium pb-8 border-b border-gray-200">
                <div className="flex items-center gap-2"><User size={18} className="text-[#E31E24]" /> By {post.author}</div>
                <div className="flex items-center gap-2"><Calendar size={18} className="text-[#E31E24]" /> {new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</div>
              </div>
            </div>

            <div className="aspect-[21/9] mb-10 rounded-sm overflow-hidden bg-gray-100">
              <img src={resolveImg(post.image)} alt={post.title} width={1200} height={514} loading="lazy" className="w-full h-full object-cover" />
            </div>

            <div className="prose prose-lg prose-headings:font-serif prose-headings:text-[#1A1A1A] text-gray-700 max-w-none">
              <p className="whitespace-pre-line leading-relaxed text-lg">{post.content}</p>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-[#1A1A1A] text-white p-8 rounded-sm mb-8">
              <h3 className="font-serif text-2xl font-bold mb-3">Need Expert Advice?</h3>
              <p className="text-white/80 mb-6 text-sm">Our team of real estate professionals is ready to help you make the right investment decision.</p>
              <Link href="/contact" className="block w-full bg-[#E31E24] text-[#1A1A1A] px-6 py-3 font-bold text-sm rounded-sm text-center hover:bg-[#c8a82f] transition-colors">
                Contact an Agent
              </Link>
            </div>

            {recentPosts.length > 0 && (
              <div>
                <h3 className="font-serif text-xl font-bold text-[#1A1A1A] mb-6">Recent Articles</h3>
                <div className="space-y-6">
                  {recentPosts.map((p) => (
                    <Link key={p.id} href={`/blog/${p.id}`} className="flex gap-4 group">
                      <div className="w-20 h-16 bg-gray-100 rounded-sm overflow-hidden flex-shrink-0">
                        <img src={resolveImg(p.image)} alt={p.title} width={80} height={64} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">{new Date(p.date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</p>
                        <h4 className="font-bold text-[#1A1A1A] text-sm leading-snug group-hover:text-[#E31E24] transition-colors line-clamp-2">{p.title}</h4>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
