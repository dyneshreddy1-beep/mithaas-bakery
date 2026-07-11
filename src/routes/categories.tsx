import { createFileRoute, Link } from "@tanstack/react-router";
import { categories, products } from "@/lib/data";
import { SectionHeading } from "@/components/site/Section";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/categories")({
  head: () => ({
    meta: [
      { title: "All Categories — Mithaas" },
      { name: "description", content: "Explore our full menu — from Kaju Sweets and Milk Sweets to Namkeen, Pickles, Bakery and Gift Hampers." },
    ],
    links: [{ rel: "canonical", href: "/categories" }],
  }),
  component: CategoriesPage,
});

function CategoriesPage() {
  return (
    <section className="container-luxe py-16 sm:py-20">
      <SectionHeading eyebrow="The Menu" title="Every category, every craft" />
      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((c) => {
          const items = products.filter(p => p.category === c.slug);
          const cover = items[0]?.image;
          return (
            <Link key={c.id} to="/products" search={{ category: c.slug } as never}
              className="group card-luxe overflow-hidden">
              {cover && (
                <div className="aspect-[5/3] overflow-hidden">
                  <img src={cover} alt={c.name} loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-[900ms] group-hover:scale-105" />
                </div>
              )}
              <div className="p-6">
                <h3 className="font-display text-2xl">{c.name}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{c.description}</p>
                <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
                  {items.length} products <ArrowRight size={14} />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}