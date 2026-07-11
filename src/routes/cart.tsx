import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Minus, Plus, Trash2, ShoppingBag, Tag } from "lucide-react";
import { toast } from "sonner";
import { useStore, priceForItem } from "@/lib/store";
import { products, bestSellers, coupons } from "@/lib/data";
import { inr } from "@/lib/format";
import { ProductCard } from "@/components/site/ProductCard";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [{ title: "Your Cart — Mithaas" }, { name: "robots", content: "noindex" }],
  }),
  component: CartPage,
});

function CartPage() {
  const { cart, updateQty, removeFromCart, cartSubtotal } = useStore();
  const [code, setCode] = useState("");
  const [applied, setApplied] = useState<{ code: string; discount: number } | null>(null);

  const shipping = cartSubtotal > 999 || cartSubtotal === 0 ? 0 : 99;
  const discount = applied ? Math.round((cartSubtotal * applied.discount) / 100) : 0;
  const tax = Math.round((cartSubtotal - discount) * 0.05);
  const total = cartSubtotal - discount + shipping + tax;

  return (
    <section className="container-luxe py-12 sm:py-16">
      <div className="divider-gold mb-3">Your Cart</div>
      <h1 className="font-display text-3xl md:text-5xl">The Basket</h1>

      {cart.length === 0 ? (
        <div className="mt-16 card-luxe grid place-items-center p-16 text-center">
          <ShoppingBag size={40} className="text-primary" />
          <p className="mt-4 font-display text-2xl">Your basket is empty</p>
          <p className="mt-2 text-sm text-muted-foreground">Fill it with something delicious.</p>
          <Link to="/products" className="mt-6 rounded-full bg-primary px-8 py-3 text-xs font-semibold uppercase tracking-widest text-primary-foreground hover:bg-[color:var(--maroon-hover)]">Shop mithais</Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <ul className="space-y-4">
            {cart.map(i => {
              const p = products.find(x => x.id === i.productId);
              if (!p) return null;
              const price = priceForItem(i.productId, i.weight);
              return (
                <li key={p.id + i.weight} className="card-luxe flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                  <img src={p.image} alt={p.name} className="h-24 w-24 rounded-xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] font-semibold uppercase tracking-widest text-[color:var(--gold)]">{p.category.replace("-"," ")}</div>
                    <Link to="/products/$slug" params={{ slug: p.slug }} className="font-display text-lg hover:text-primary transition">{p.name}</Link>
                    <div className="text-xs text-muted-foreground">{i.weight}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="inline-flex items-center rounded-full border border-border">
                      <button aria-label="Decrease" onClick={() => updateQty(p.id, i.weight, i.quantity - 1)} className="p-2"><Minus size={14} /></button>
                      <span className="w-8 text-center text-sm font-semibold">{i.quantity}</span>
                      <button aria-label="Increase" onClick={() => updateQty(p.id, i.weight, i.quantity + 1)} className="p-2"><Plus size={14} /></button>
                    </div>
                    <div className="w-24 text-right font-display text-lg">{inr(price * i.quantity)}</div>
                    <button aria-label="Remove" onClick={() => removeFromCart(p.id, i.weight)} className="p-2 text-muted-foreground hover:text-primary"><Trash2 size={16} /></button>
                  </div>
                </li>
              );
            })}
          </ul>

          <aside className="card-luxe h-fit p-6 lg:sticky lg:top-24">
            <div className="font-display text-xl">Order summary</div>
            <dl className="mt-4 space-y-2.5 text-sm">
              <Row label="Subtotal" value={inr(cartSubtotal)} />
              {discount > 0 && <Row label={`Coupon (${applied?.code})`} value={`− ${inr(discount)}`} accent />}
              <Row label="Shipping" value={shipping === 0 ? "Free" : inr(shipping)} />
              <Row label="Taxes (5% GST)" value={inr(tax)} />
            </dl>
            <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
              <span className="font-display text-lg">Total</span>
              <span className="font-display text-2xl text-primary">{inr(total)}</span>
            </div>
            <div className="mt-5">
              <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Coupon</label>
              <div className="mt-1.5 flex gap-2">
                <div className="flex flex-1 items-center rounded-full border border-border px-4">
                  <Tag size={14} className="text-muted-foreground" />
                  <input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="Enter code"
                    className="ml-2 flex-1 bg-transparent py-2.5 text-sm outline-none" />
                </div>
                <button
                  onClick={() => {
                    const c = coupons[code];
                    if (c) { setApplied({ code, discount: c.discount }); toast.success(c.label); }
                    else { toast.error("Invalid coupon"); }
                  }}
                  className="rounded-full bg-secondary px-5 text-xs font-semibold uppercase tracking-widest hover:bg-secondary/80">Apply</button>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">Try <b>DIWALI10</b>, <b>MITHAAS15</b>, or <b>FESTIVE20</b>.</p>
            </div>
            <Link to="/checkout" className="mt-6 block rounded-full bg-primary py-4 text-center text-xs font-semibold uppercase tracking-widest text-primary-foreground shadow-luxe hover:bg-[color:var(--maroon-hover)]">
              Proceed to checkout
            </Link>
            <p className="mt-3 text-center text-xs text-muted-foreground">Free shipping on orders above ₹999.</p>
          </aside>
        </div>
      )}

      <div className="mt-24">
        <h3 className="font-display text-2xl">You may also love</h3>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {bestSellers.slice(0, 4).map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      </div>
    </section>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex justify-between">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={accent ? "text-[color:var(--success)] font-semibold" : ""}>{value}</dd>
    </div>
  );
}