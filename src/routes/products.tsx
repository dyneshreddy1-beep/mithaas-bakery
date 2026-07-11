import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { LayoutGrid, List, Search, SlidersHorizontal } from "lucide-react";
import { categories } from "@/lib/data";
import { ProductCard } from "@/components/site/ProductCard";
import { cn } from "@/lib/utils";
import { useStore } from "@/lib/store";

type Search = { category?: string; sort?: string };

export const Route = createFileRoute("/products")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    category: typeof search.category === "string" ? search.category : undefined,
    sort: typeof search.sort === "string" ? search.sort : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Shop All Sweets — Mithaas" },
      { name: "description", content: "Browse handcrafted Indian sweets, dry fruit laddus, festive hampers and more. Delivered fresh across India." },
    ],
    links: [{ rel: "canonical", href: "/products" }],
  }),
  component: ShopPage,
});

function ShopPage() {
  const { category, sort } = Route.useSearch();
  const navigate = Route.useNavigate();
  const { products } = useStore();
  const [q, setQ] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [priceMax, setPriceMax] = useState(3200);
  const [minRating, setMinRating] = useState(0);

  const filtered = useMemo(() => {
    let list = products.slice();
    if (category) list = list.filter(p => p.category === category);
    if (q) list = list.filter(p => (p.name + " " + p.description).toLowerCase().includes(q.toLowerCase()));
    list = list.filter(p => p.price <= priceMax && p.rating >= minRating);
    switch (sort) {
      case "price-low": list.sort((a, b) => a.price - b.price); break;
      case "price-high": list.sort((a, b) => b.price - a.price); break;
      case "popular": list.sort((a, b) => b.reviews - a.reviews); break;
      case "newest": list.sort((a, b) => Number(b.isNew ?? 0) - Number(a.isNew ?? 0)); break;
    }
    return list;
  }, [category, sort, q, priceMax, minRating]);

  return (
    <section className="container-luxe py-12 sm:py-16">
      <header className="flex flex-col gap-4 border-b border-border pb-8 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="divider-gold mb-3">Shop</div>
          <h1 className="font-display text-4xl md:text-5xl">
            {category ? categories.find(c => c.slug === category)?.name ?? "All Sweets" : "All Sweets"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {filtered.length} products · Made fresh, shipped nationwide.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search sweets…"
              className="w-full rounded-full border border-border bg-card py-2.5 pl-9 pr-4 text-sm outline-none focus:border-primary transition sm:w-64" />
          </div>
          <select
            value={sort ?? ""} onChange={(e) => navigate({ search: (s: Search) => ({ ...s, sort: e.target.value || undefined }) })}
            className="rounded-full border border-border bg-card py-2.5 px-4 text-sm outline-none focus:border-primary"
            aria-label="Sort"
          >
            <option value="">Sort: Curated</option>
            <option value="newest">Newest</option>
            <option value="popular">Popular</option>
            <option value="price-low">Price: Low → High</option>
            <option value="price-high">Price: High → Low</option>
          </select>
          <div className="hidden sm:flex overflow-hidden rounded-full border border-border">
            <button onClick={() => setView("grid")} aria-label="Grid view"
              className={cn("p-2.5", view === "grid" ? "bg-primary text-primary-foreground" : "bg-card")}><LayoutGrid size={16} /></button>
            <button onClick={() => setView("list")} aria-label="List view"
              className={cn("p-2.5", view === "list" ? "bg-primary text-primary-foreground" : "bg-card")}><List size={16} /></button>
          </div>
        </div>
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="flex items-center gap-2 pb-3 text-sm font-semibold">
            <SlidersHorizontal size={16} /> Filters
          </div>
          <div className="space-y-6 text-sm">
            <div>
              <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Category</div>
              <ul className="space-y-1.5">
                <li>
                  <Link to="/products" className={cn("block rounded-md px-2 py-1.5", !category ? "bg-primary/10 text-primary font-semibold" : "hover:bg-muted")}>All</Link>
                </li>
                {categories.map(c => (
                  <li key={c.id}>
                    <Link to="/products" search={{ category: c.slug } as never}
                      className={cn("block rounded-md px-2 py-1.5", category === c.slug ? "bg-primary/10 text-primary font-semibold" : "hover:bg-muted")}>
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Max Price · ₹{priceMax}</div>
              <input type="range" min={300} max={3200} step={50} value={priceMax}
                onChange={(e) => setPriceMax(Number(e.target.value))}
                className="w-full accent-[color:var(--maroon)]" aria-label="Max price" />
            </div>
            <div>
              <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Minimum Rating</div>
              {[0, 4, 4.5, 4.8].map(r => (
                <label key={r} className="flex items-center gap-2 py-1 text-sm">
                  <input type="radio" name="minRating" checked={minRating === r} onChange={() => setMinRating(r)}
                    className="accent-[color:var(--maroon)]" />
                  {r === 0 ? "All" : `${r}★ & up`}
                </label>
              ))}
            </div>
          </div>
        </aside>

        <div>
          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-16 text-center text-muted-foreground">
              No sweets match those filters. Try widening your search.
            </div>
          ) : view === "grid" ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          ) : (
            <ul className="space-y-4">
              {filtered.map((p) => (
                <li key={p.id}>
                  <Link to="/products/$slug" params={{ slug: p.slug }} className="group flex gap-4 card-luxe p-4">
                    <img src={p.image} alt={p.name} className="h-28 w-28 rounded-xl object-cover" loading="lazy" />
                    <div className="min-w-0 flex-1">
                      <div className="text-[10px] font-semibold uppercase tracking-widest text-[color:var(--gold)]">{p.category.replace("-"," ")}</div>
                      <h3 className="font-display text-lg group-hover:text-primary transition">{p.name}</h3>
                      <p className="line-clamp-2 text-sm text-muted-foreground">{p.shortDescription}</p>
                      <div className="mt-2 font-display text-lg">{new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:0}).format(p.price)}</div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}