import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { blogPosts } from "@/lib/data";
import type { BlogPost } from "@/lib/types";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const p = blogPosts.find(b => b.slug === params.slug);
    if (!p) throw notFound();
    return p;
  },
  head: ({ loaderData }) => ({
    meta: loaderData ? [
      { title: `${loaderData.title} — Mithaas Journal` },
      { name: "description", content: loaderData.excerpt },
      { property: "og:title", content: loaderData.title },
      { property: "og:description", content: loaderData.excerpt },
      { property: "og:type", content: "article" },
    ] : [{ title: "Journal — Mithaas" }],
    links: loaderData ? [{ rel: "canonical", href: `/blog/${loaderData.slug}` }] : [],
  }),
  component: () => {
    const p = Route.useLoaderData() as BlogPost;
    return (
      <article className="pb-24">
        <div className="relative h-[50vh] min-h-[380px] w-full overflow-hidden">
          <img src={p.cover} alt={p.title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="container-luxe absolute inset-x-0 bottom-8 text-primary-foreground">
            <div className="text-xs uppercase tracking-widest text-[color:var(--gold)]">{p.category} · {p.date}</div>
            <h1 className="mt-2 max-w-3xl font-display text-3xl md:text-5xl leading-tight">{p.title}</h1>
          </div>
        </div>
        <div className="container-luxe mt-12 max-w-3xl">
          <p className="text-xl leading-relaxed text-muted-foreground">{p.excerpt}</p>
          <div className="mt-8 space-y-6 leading-relaxed">
            <p>{p.body}</p>
            <p>{p.body}</p>
          </div>
          <div className="mt-12 border-t border-border pt-8">
            <Link to="/blog" className="text-sm font-semibold text-primary story-link">← Back to the Journal</Link>
          </div>
        </div>
      </article>
    );
  },
});