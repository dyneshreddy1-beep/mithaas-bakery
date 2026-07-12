import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Eye } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/lib/types";
import { Rating } from "./Rating";
import { inr, pct } from "@/lib/format";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { addToCart, toggleWishlist, isWished } = useStore();
  const wished = isWished(product.id);
  const discount = pct(product.mrp, product.price);

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: Math.min(index, 6) * 0.05 }}
      className="group card-luxe overflow-hidden flex flex-col"
    >
      <Link
        to="/products/$slug"
        params={{ slug: product.slug }}
        className="relative block aspect-square overflow-hidden bg-muted"
      >
        <img
          src={product.image} alt={product.name} loading="lazy" width={900} height={900}
          className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
        />
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
          <div className="flex flex-col gap-1.5">
            {product.isBestSeller && (
              <span className="rounded-full bg-primary px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-primary-foreground shadow-md">
                Bestseller
              </span>
            )}
            {discount > 0 && (
              <span className="rounded-full bg-[color:var(--gold)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-[color:var(--gold-foreground)] shadow-md">
                {discount}% off
              </span>
            )}
          </div>
          <button
            type="button"
            aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(product.id); toast.success(wished ? "Removed from wishlist" : "Added to wishlist"); }}
            className={cn(
              "grid h-9 w-9 place-items-center rounded-full backdrop-blur-md border border-white/40 transition",
              wished ? "bg-primary text-primary-foreground" : "bg-white/70 text-primary hover:bg-white"
            )}
          >
            <Heart size={16} className={wished ? "fill-current" : ""} />
          </button>
        </div>
        <div className="absolute inset-x-3 bottom-3 flex items-center gap-2 transition-all duration-300 translate-y-0 opacity-100 sm:translate-y-2 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100">
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); addToCart(product.id); toast.success(`${product.name} added to cart`); }}
            className="flex-1 rounded-full bg-primary px-4 py-2.5 text-xs font-semibold tracking-wide text-primary-foreground shadow-lg hover:bg-[color:var(--maroon-hover)] transition"
          >
            <ShoppingBag size={14} className="inline mr-1.5 -mt-0.5" /> Add to cart
          </button>
          <span
            aria-hidden
            className="grid h-10 w-10 place-items-center rounded-full bg-white/90 text-primary shadow-lg backdrop-blur"
          >
            <Eye size={16} />
          </span>
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4 sm:p-5">
        <div className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[color:var(--gold)]">
          {product.category.replace("-", " ")}
        </div>
        <Link to="/products/$slug" params={{ slug: product.slug }} className="block">
          <h3 className="font-display text-lg leading-snug group-hover:text-primary transition">{product.name}</h3>
        </Link>
        <p className="line-clamp-2 text-sm text-muted-foreground">{product.shortDescription}</p>
        <div className="mt-auto flex items-end justify-between pt-2">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-xl text-foreground">{inr(product.price)}</span>
              {product.mrp > product.price && (
                <span className="text-xs text-muted-foreground line-through">{inr(product.mrp)}</span>
              )}
            </div>
            <Rating value={product.rating} count={product.reviews} />
          </div>
        </div>
      </div>
    </motion.article>
  );
}