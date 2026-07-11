import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { useStore } from "@/lib/store";
import { products } from "@/lib/data";
import { ProductCard } from "@/components/site/ProductCard";

export const Route = createFileRoute("/wishlist")({
  head: () => ({ meta: [{ title: "Your Wishlist — Mithaas" }, { name: "robots", content: "noindex" }] }),
  component: () => {
    const { wishlist } = useStore();
    const items = products.filter(p => wishlist.includes(p.id));
    return (
      <section className="container-luxe py-12 sm:py-16">
        <div className="divider-gold mb-3">Wishlist</div>
        <h1 className="font-display text-3xl md:text-5xl">The mithais you're eyeing</h1>
        {items.length === 0 ? (
          <div className="mt-16 card-luxe grid place-items-center p-16 text-center">
            <Heart size={40} className="text-primary" />
            <p className="mt-4 font-display text-2xl">Nothing saved yet</p>
            <p className="mt-2 text-sm text-muted-foreground">Tap the heart on any product to add it here.</p>
            <Link to="/products" className="mt-6 rounded-full bg-primary px-8 py-3 text-xs font-semibold uppercase tracking-widest text-primary-foreground">Browse mithais</Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        )}
      </section>
    );
  },
});