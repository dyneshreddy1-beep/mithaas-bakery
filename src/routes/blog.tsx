import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { blogPosts } from "@/lib/data";
import { SectionHeading } from "@/components/site/Section";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "The Mithaas Journal — Recipes, Festivals, Guides" },
      { name: "description", content: "Recipes, festival guides, and the craft behind India's most-loved mithais." },
    ],
    links: [{ rel: "canonical", href: "/blog" }],
  }),
  component: () => (
    <section className="container-luxe py-16 sm:py-20">
      <SectionHeading eyebrow="The Journal" title="Recipes, festivals, and craft" />
      <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {blogPosts.map((p, i) => (
          <motion.article key={p.id} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:0.5,delay:i*0.05}}>
            <Link to="/blog/$slug" params={{ slug: p.slug }} className="group block card-luxe overflow-hidden">
              <div className="aspect-[4/3] overflow-hidden">
                <img src={p.cover} alt={p.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-[900ms] group-hover:scale-105" />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-widest">
                  <span className="text-[color:var(--gold)]">{p.category}</span>
                  <span className="text-muted-foreground">{p.date}</span>
                </div>
                <h3 className="mt-2 font-display text-xl leading-snug group-hover:text-primary transition">{p.title}</h3>
                <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{p.excerpt}</p>
              </div>
            </Link>
          </motion.article>
        ))}
      </div>
    </section>
  ),
});