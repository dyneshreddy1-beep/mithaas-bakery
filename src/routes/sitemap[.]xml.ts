import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { products, blogPosts, categories } from "@/lib/data";

const BASE_URL = "";

interface SitemapEntry { path: string; changefreq?: string; priority?: string }

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries: SitemapEntry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/about" }, { path: "/products" }, { path: "/categories" },
          { path: "/gift-boxes" }, { path: "/festival" }, { path: "/corporate" },
          { path: "/stores" }, { path: "/franchise" }, { path: "/blog" },
          { path: "/contact" }, { path: "/faq" },
          { path: "/privacy" }, { path: "/terms" }, { path: "/refund" },
          ...categories.map(c => ({ path: `/products?category=${c.slug}` })),
          ...products.map(p => ({ path: `/products/${p.slug}`, changefreq: "weekly" })),
          ...blogPosts.map(b => ({ path: `/blog/${b.slug}` })),
        ];
        const urls = entries.map(e => `  <url>\n    <loc>${BASE_URL}${e.path}</loc>${e.changefreq ? `\n    <changefreq>${e.changefreq}</changefreq>` : ""}${e.priority ? `\n    <priority>${e.priority}</priority>` : ""}\n  </url>`);
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>`;
        return new Response(xml, { headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" } });
      },
    },
  },
});