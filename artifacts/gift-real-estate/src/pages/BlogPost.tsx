import React, { useEffect } from "react";
import { useParams, Link } from "wouter";
import { blogPosts } from "@/data/blogPosts";
import { Calendar, User, Tag, ArrowLeft } from "lucide-react";

export default function BlogPost() {
  const { id } = useParams();
  const post = blogPosts.find(p => p.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-20 text-center">
        <h1 className="font-serif text-4xl font-bold text-[#0F2E24] mb-4">Article Not Found</h1>
        <Link href="/blog" className="bg-[#1C4C3B] text-white px-6 py-2 rounded-sm">Back to Blog</Link>
      </div>
    );
  }

  const recentPosts = blogPosts.filter(p => p.id !== id).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#FDFDF8] pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-6xl">
        <Link href="/blog" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#1C4C3B] mb-8 font-medium transition-colors">
          <ArrowLeft size={16} /> Back to Market Insights
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Article */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <span className="text-[#D9B93C] font-bold tracking-widest uppercase text-sm mb-4 block">
                {post.category}
              </span>
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#0F2E24] mb-6 leading-tight">
                {post.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 font-medium pb-8 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <User size={18} className="text-[#1C4C3B]" />
                  <span>By {post.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={18} className="text-[#1C4C3B]" />
                  <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>
              </div>
            </div>

            <div className="aspect-[21/9] mb-10 rounded-sm overflow-hidden bg-gray-100">
              <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
            </div>

            <div className="prose prose-lg prose-headings:font-serif prose-headings:text-[#0F2E24] text-gray-700 max-w-none">
              <p className="whitespace-pre-line leading-relaxed text-lg">
                {post.content}
              </p>
            </div>
            
            {/* Share placeholder */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <p className="font-bold text-[#0F2E24] mb-4">Share this article</p>
              <div className="flex gap-4">
                <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-[#1C4C3B] hover:text-white transition-colors">fb</button>
                <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-[#1C4C3B] hover:text-white transition-colors">tw</button>
                <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-[#1C4C3B] hover:text-white transition-colors">in</button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-white border border-gray-100 p-6 rounded-sm shadow-sm">
              <h3 className="font-serif text-2xl font-bold text-[#0F2E24] mb-6 pb-4 border-b border-gray-100">Recent Articles</h3>
              <div className="flex flex-col gap-6">
                {recentPosts.map(rp => (
                  <Link key={rp.id} href={`/blog/${rp.id}`} className="group flex gap-4">
                    <div className="w-20 h-20 shrink-0 rounded-sm overflow-hidden bg-gray-100">
                      <img src={rp.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#0F2E24] text-sm mb-1 group-hover:text-[#1C4C3B] transition-colors line-clamp-2">{rp.title}</h4>
                      <span className="text-xs text-gray-500">{new Date(rp.date).toLocaleDateString()}</span>
                    </div>
                  </Link>
                ))}
              </div>
              
              <div className="mt-10">
                <h3 className="font-serif text-xl font-bold text-[#0F2E24] mb-4">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {['Market Insights', 'Buying Guide', 'Investment Tips', 'Architecture & Design'].map(cat => (
                    <span key={cat} className="px-3 py-1 bg-gray-50 border border-gray-200 text-xs font-bold text-gray-600 rounded-sm hover:bg-[#1C4C3B] hover:text-white transition-colors cursor-pointer">
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
