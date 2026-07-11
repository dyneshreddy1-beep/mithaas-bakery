import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Truck, ShieldCheck, Leaf, Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { findProduct, products } from "@/lib/data";
import type { Product } from "@/lib/types";
import { Rating } from "@/components/site/Rating";
import { ProductCard } from "@/components/site/ProductCard";
import { useStore } from "@/lib/store";
import { inr, pct } from "@/lib/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/products/$slug")({
  loader: ({ params }) => {
    const p = findProduct(params.slug);
    if (!p) throw notFound();
    return p;
  },
  head: ({ loaderData }) => ({
    meta: loaderData ? [
      { title: `${loaderData.name} — Mithaas` },
      { name: "description", content: loaderData.shortDescription },
      { property: "og:title", content: `${loaderData.name} — Mithaas` },
      { property: "og:description", content: loaderData.shortDescription },
      { property: "og:type", content: "product" },
    ] : [{ title: "Product — Mithaas" }],
    links: loaderData ? [{ rel: "canonical", href: `/products/${loaderData.slug}` }] : [],
  }),
  component: ProductDetail,
});

function ProductDetail() {
  const loaderProduct = Route.useLoaderData() as Product;
  const { addToCart, toggleWishlist, isWished, products: dbProducts } = useStore();
  const p = dbProducts.find(x => x.id === loaderProduct.id) || loaderProduct;
  const wished = isWished(p.id);
  const [gi, setGi] = useState(0);
  const [weight, setWeight] = useState(p.weights[0].label);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<"desc" | "nutrition" | "reviews">("desc");

  const active = p.weights.find(w => w.label === weight) ?? p.weights[0];
  const price = Math.round(p.price * active.priceMultiplier);
  const mrp = Math.round(p.mrp * active.priceMultiplier);
  const discount = pct(mrp, price);

  const related = useMemo(() =>
    dbProducts.filter(x => x.category === p.category && x.id !== p.id).slice(0, 4),
  [p, dbProducts]);

  return (
    <>
      <section className="container-luxe py-8 sm:py-12">
        <nav className="mb-6 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-primary">Home</Link> · <Link to="/products" className="hover:text-primary">Shop</Link> · <span className="text-foreground">{p.name}</span>
        </nav>
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <div>
            <motion.div key={gi} initial={{ opacity: 0.6, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="aspect-square overflow-hidden rounded-[2rem] bg-muted shadow-luxe">
              <img src={p.gallery[gi]} alt={p.name} width={900} height={900}
                className="h-full w-full object-cover" />
            </motion.div>
            <div className="mt-4 grid grid-cols-4 gap-3">
              {p.gallery.map((g, i) => (
                <button key={i} onClick={() => setGi(i)} aria-label={`Image ${i+1}`}
                  className={cn("aspect-square overflow-hidden rounded-xl border-2 transition",
                    gi === i ? "border-primary" : "border-transparent opacity-70 hover:opacity-100")}>
                  <img src={g} alt="" className="h-full w-full object-cover" loading="lazy" />
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col">
            <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[color:var(--gold)]">{p.category.replace("-"," ")}</div>
            <h1 className="mt-2 font-display text-3xl leading-tight sm:text-4xl md:text-[42px]">{p.name}</h1>
            <div className="mt-3 flex items-center gap-4">
              <Rating value={p.rating} count={p.reviews} size={16} />
              {p.tags?.map(t => (
                <span key={t} className="rounded-full bg-secondary px-3 py-1 text-[10px] font-semibold uppercase tracking-widest">{t}</span>
              ))}
            </div>
            <p className="mt-4 text-muted-foreground">{p.shortDescription}</p>

            <div className="mt-6 flex items-baseline gap-3">
              <span className="font-display text-3xl text-primary">{inr(price)}</span>
              {mrp > price && <span className="text-sm text-muted-foreground line-through">{inr(mrp)}</span>}
              {discount > 0 && <span className="rounded-full bg-[color:var(--gold)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-[color:var(--gold-foreground)]">Save {discount}%</span>}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Inclusive of all taxes.</p>

            <div className="mt-8">
              <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Weight</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {p.weights.map(w => (
                  <button key={w.label} onClick={() => setWeight(w.label)}
                    className={cn("rounded-full border px-5 py-2.5 text-sm font-medium transition",
                      weight === w.label ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary")}>
                    {w.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center rounded-full border border-border bg-card">
                <button aria-label="Decrease" onClick={() => setQty(q => Math.max(1, q - 1))} className="p-3"><Minus size={16} /></button>
                <span className="w-8 text-center font-semibold">{qty}</span>
                <button aria-label="Increase" onClick={() => setQty(q => q + 1)} className="p-3"><Plus size={16} /></button>
              </div>
              <button
                onClick={() => { addToCart(p.id, weight, qty); toast.success(`${p.name} × ${qty} added to cart`); }}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-6 py-4 text-sm font-semibold uppercase tracking-widest text-primary-foreground shadow-luxe hover:bg-[color:var(--maroon-hover)]">
                <ShoppingBag size={16} /> Add to Cart
              </button>
              <button aria-label="Wishlist" onClick={() => toggleWishlist(p.id)}
                className={cn("grid h-14 w-14 place-items-center rounded-full border transition",
                  wished ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary")}>
                <Heart size={18} className={wished ? "fill-current" : ""} />
              </button>
            </div>

            <div className="mt-4">
              <div className="flex items-center gap-2 rounded-full border border-border bg-card p-1.5">
                <input placeholder="Enter pincode" className="flex-1 bg-transparent px-4 py-2 text-sm outline-none" />
                <button className="rounded-full bg-secondary px-5 py-2 text-xs font-semibold uppercase tracking-widest hover:bg-secondary/80">Check</button>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">Delivered fresh across 19,000+ pincodes in India.</p>
            </div>

            <ul className="mt-8 grid grid-cols-3 gap-4 border-t border-border pt-6 text-xs text-muted-foreground">
              <li className="flex items-start gap-2"><Truck size={16} className="mt-0.5 text-primary shrink-0" />Next-day dispatch</li>
              <li className="flex items-start gap-2"><Leaf size={16} className="mt-0.5 text-primary shrink-0" />Pure A2 ghee</li>
              <li className="flex items-start gap-2"><ShieldCheck size={16} className="mt-0.5 text-primary shrink-0" />Damage guarantee</li>
            </ul>
          </div>
        </div>

        <div className="mt-16">
          <div className="flex flex-wrap gap-2 border-b border-border">
            {(["desc","nutrition","reviews"] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={cn("relative px-5 py-3 text-sm font-semibold uppercase tracking-widest transition",
                  tab === t ? "text-primary" : "text-muted-foreground hover:text-foreground")}>
                {t === "desc" ? "Description" : t === "nutrition" ? "Nutrition" : `Reviews (${p.reviews})`}
                {tab === t && <span className="absolute inset-x-3 -bottom-px h-0.5 bg-primary" />}
              </button>
            ))}
          </div>
          <div className="pt-8">
            {tab === "desc" && (
              <div className="grid gap-10 md:grid-cols-3">
                <div className="md:col-span-2 text-muted-foreground leading-relaxed">{p.description}</div>
                <aside>
                  <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Ingredients</h4>
                  <ul className="mt-3 space-y-1.5 text-sm">
                    {p.ingredients.map(i => <li key={i} className="flex gap-2"><span className="text-[color:var(--gold)]">◆</span>{i}</li>)}
                  </ul>
                  <h4 className="mt-6 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Shelf life</h4>
                  <p className="mt-1.5 text-sm">{p.shelfLife}</p>
                </aside>
              </div>
            )}
            {tab === "nutrition" && (
              <div className="max-w-lg overflow-hidden rounded-2xl border border-border">
                <table className="w-full text-sm">
                  <tbody>
                    {p.nutrition.map((n, i) => (
                      <tr key={n.label} className={i % 2 ? "bg-muted/40" : ""}>
                        <th scope="row" className="p-4 text-left font-medium">{n.label}</th>
                        <td className="p-4 text-right text-muted-foreground">{n.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {tab === "reviews" && (
              <div className="grid gap-4 sm:grid-cols-2">
                {sampleReviews.map(r => (
                  <article key={r.id} className="card-luxe p-6">
                    <Rating value={r.rating} />
                    <h4 className="mt-2 font-semibold">{r.title}</h4>
                    <p className="mt-1 text-sm text-muted-foreground">{r.body}</p>
                    <div className="mt-3 text-xs text-muted-foreground">— {r.name}, {r.date}</div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-24">
            <div className="divider-gold mb-3">You may also love</div>
            <h3 className="font-display text-2xl sm:text-3xl">More from {p.category.replace("-"," ")}</h3>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((r, i) => <ProductCard key={r.id} product={r} index={i} />)}
            </div>
          </div>
        )}
      </section>

      <div className="sticky bottom-0 z-30 border-t border-border bg-background/95 backdrop-blur md:hidden">
        <div className="container-luxe flex items-center gap-3 py-3">
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold">{p.name}</div>
            <div className="font-display text-lg text-primary">{inr(price)}</div>
          </div>
          <button onClick={() => { addToCart(p.id, weight, qty); toast.success("Added to cart"); }}
            className="ml-auto rounded-full bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-widest text-primary-foreground">
            Add to Cart
          </button>
        </div>
      </div>
    </>
  );
}

const sampleReviews = [
  { id: "r1", name: "Sanya K.", rating: 5, date: "18 Aug 2025", title: "Just like Nani's",
    body: "Melt in your mouth, not too sweet, and the packaging was gorgeous. Bought again for a wedding gift." },
  { id: "r2", name: "Vikram R.", rating: 5, date: "02 Sep 2025", title: "Reliably perfect",
    body: "Third time ordering, quality has been identical every time. That's rare." },
  { id: "r3", name: "Anaya P.", rating: 4, date: "24 Sep 2025", title: "Loved the taste",
    body: "Slightly softer than I expected — but the flavour is spot on. Will order again." },
  { id: "r4", name: "Karan D.", rating: 5, date: "10 Oct 2025", title: "Corporate gift win",
    body: "Sent 40 hampers to my clients. Received messages from most of them the same day." },
];