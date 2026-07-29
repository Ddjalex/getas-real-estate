/**
 * Thin API client for the backend. Uses BASE_URL so calls work correctly
 * under the Replit path-based proxy.
 */
const BASE = import.meta.env.BASE_URL?.replace(/\/$/, "") ?? "";
const API = `${BASE}/api`;

export type Listing = {
  id: string;
  slug: string;
  title: string;
  type: "sale" | "rent";
  price: string;
  priceUnit: string;
  location: string;
  neighborhood: string;
  bedrooms: number;
  bathrooms: number;
  sizeSqm: number;
  description: string;
  images: string[];
  status: string;
  featured: boolean;
  dateAdded: string;
  latitude?: number | null;
  longitude?: number | null;
  createdAt?: string;
  updatedAt?: string;
};

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  image: string;
  publishedAt: string;
  updatedAt?: string;
};

export type Agent = {
  id: string;
  name: string;
  role: string;
  phone: string;
  email: string;
  bio: string;
  image: string;
};

export type SiteSettings = {
  phone: string;
  whatsapp: string;
  location: string;
  portfolio: string;
  email: string;
  otherInfo: string;
};

export async function fetchSiteSettings(): Promise<SiteSettings> {
  const res = await fetch(`${API}/settings`);
  if (!res.ok) throw new Error("Failed to fetch settings");
  return res.json();
}

export type HeroSlide = {
  id: number;
  imageUrl: string;
  caption: string;
  displayOrder: number;
  active: boolean;
  createdAt: string;
};

export async function fetchHeroSlides(): Promise<HeroSlide[]> {
  const res = await fetch(`${API}/hero-slides`);
  if (!res.ok) throw new Error("Failed to fetch hero slides");
  return res.json();
}

export type Service = {
  id: string;
  title: string;
  description: string;
  image: string;
  order: number;
};

export async function fetchServices(): Promise<Service[]> {
  const BASE = import.meta.env.BASE_URL?.replace(/\/$/, "") ?? "";
  const res = await fetch(`${BASE}/api/services`);
  if (!res.ok) throw new Error("Failed to fetch services");
  return res.json();
}

export type InquiryInput = {
  name: string;
  email: string;
  phone?: string;
  message: string;
  listingId?: string | null;
};

export async function fetchListings(params?: {
  type?: "sale" | "rent";
  featured?: boolean;
  location?: string;
}): Promise<Listing[]> {
  const qs = new URLSearchParams();
  if (params?.type) qs.set("type", params.type);
  if (params?.featured) qs.set("featured", "true");
  if (params?.location) qs.set("location", params.location);
  const url = `${API}/listings${qs.toString() ? `?${qs}` : ""}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch listings");
  return res.json();
}

export async function fetchListing(id: string): Promise<Listing> {
  const res = await fetch(`${API}/listings/${id}`);
  if (!res.ok) throw new Error("Listing not found");
  return res.json();
}

export async function fetchBlogPosts(category?: string): Promise<BlogPost[]> {
  const url = category
    ? `${API}/blog?category=${encodeURIComponent(category)}`
    : `${API}/blog`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch blog posts");
  return res.json();
}

export async function fetchBlogPost(id: string): Promise<BlogPost> {
  const res = await fetch(`${API}/blog/${id}`);
  if (!res.ok) throw new Error("Blog post not found");
  return res.json();
}

export async function fetchAgents(): Promise<Agent[]> {
  const res = await fetch(`${API}/agents`);
  if (!res.ok) throw new Error("Failed to fetch agents");
  return res.json();
}

export async function submitInquiry(data: InquiryInput): Promise<void> {
  const res = await fetch(`${API}/inquiries`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error ?? "Failed to submit inquiry");
  }
}

// ── Admin API ────────────────────────────────────────────────────────────────

export async function adminLogin(username: string, password: string) {
  const res = await fetch(`${API}/admin/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error ?? "Login failed");
  }
  return res.json();
}

export async function adminLogout() {
  await fetch(`${API}/admin/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
}

export async function adminMe(): Promise<{ id: number; username: string } | null> {
  const res = await fetch(`${API}/admin/auth/me`, { credentials: "include" });
  if (!res.ok) return null;
  return res.json();
}

// Admin CRUD helpers
async function adminFetch(path: string, init?: RequestInit) {
  const res = await fetch(`${API}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error ?? "Request failed");
  }
  return res.json();
}

export const admin = {
  listings: {
    list: (): Promise<Listing[]> => adminFetch("/admin/listings"),
    create: (data: Partial<Listing>): Promise<Listing> =>
      adminFetch("/admin/listings", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: Partial<Listing>): Promise<Listing> =>
      adminFetch(`/admin/listings/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: string): Promise<void> =>
      adminFetch(`/admin/listings/${id}`, { method: "DELETE" }),
  },
  blog: {
    list: (): Promise<BlogPost[]> => adminFetch("/admin/blog"),
    create: (data: Partial<BlogPost>): Promise<BlogPost> =>
      adminFetch("/admin/blog", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: Partial<BlogPost>): Promise<BlogPost> =>
      adminFetch(`/admin/blog/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: string): Promise<void> =>
      adminFetch(`/admin/blog/${id}`, { method: "DELETE" }),
  },
  inquiries: {
    list: (): Promise<unknown[]> => adminFetch("/admin/inquiries"),
  },
  agents: {
    list: (): Promise<Agent[]> => adminFetch("/admin/agents"),
    create: (data: Agent): Promise<Agent> =>
      adminFetch("/admin/agents", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: Agent): Promise<Agent> =>
      adminFetch(`/admin/agents/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: string): Promise<void> =>
      adminFetch(`/admin/agents/${id}`, { method: "DELETE" }),
  },
  services: {
    list: (): Promise<Service[]> => adminFetch("/admin/services"),
    create: (data: Service): Promise<Service> =>
      adminFetch("/admin/services", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: Service): Promise<Service> =>
      adminFetch(`/admin/services/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: string): Promise<void> =>
      adminFetch(`/admin/services/${id}`, { method: "DELETE" }),
  },
  settings: {
    get: (): Promise<Record<string, string>> => adminFetch("/admin/settings"),
    update: (data: Record<string, string>): Promise<Record<string, string>> =>
      adminFetch("/admin/settings", { method: "PUT", body: JSON.stringify(data) }),
  },
  auth: {
    changeCredentials: (data: {
      currentPassword: string;
      newUsername?: string;
      newPassword?: string;
    }): Promise<{ ok: boolean }> =>
      adminFetch("/admin/auth/credentials", { method: "PUT", body: JSON.stringify(data) }),
  },
  heroSlides: {
    list: (): Promise<HeroSlide[]> => adminFetch("/admin/hero-slides"),
    create: (data: { imageUrl: string; caption?: string }): Promise<HeroSlide> =>
      adminFetch("/admin/hero-slides", { method: "POST", body: JSON.stringify(data) }),
    update: (id: number, data: Partial<HeroSlide>): Promise<HeroSlide> =>
      adminFetch(`/admin/hero-slides/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: number): Promise<void> =>
      adminFetch(`/admin/hero-slides/${id}`, { method: "DELETE" }),
    reorder: (items: { id: number; displayOrder: number }[]): Promise<HeroSlide[]> =>
      adminFetch("/admin/hero-slides/reorder/bulk", { method: "PUT", body: JSON.stringify(items) }),
  },
};
