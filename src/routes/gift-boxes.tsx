import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { products } from "@/lib/data";
import { ProductCard } from "@/components/site/ProductCard";
import { SectionHeading } from "@/components/site/Section";
import giftbox from "@/assets/p-giftbox.jpg";

export const Route = createFileRoute("/gift-boxes")({
  head: () => ({
    meta: [
      { title: "Gift Boxes & Hampers — Mithaas" },
      { name: "description", content: "Hand-finished festive hampers and gift boxes of premium Indian sweets." },
    ],
    links: [{ rel: "canonical", href: "/gift-boxes" }],
  }),
  component: () => (
    <>
      <section className="relative overflow-hidden bg-gradient-luxe text-primary-foreground">
        <div className="container-luxe grid gap-10 py-20 lg:grid-cols-2 lg:items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="divider-gold mb-4 text-[color:var(--gold)]">Gift Boxes</div>
            <h1 className="font-display text-4xl leading-tight sm:text-5xl md:text-6xl">
              A little joy, <span className="italic text-[color:var(--gold)]">beautifully wrapped.</span>
            </h1>
            <p className="mt-5 max-w-md text-primary-foreground/85">
              Velvet-lined hampers finished by hand. Personalised notes, silver monograms, and next-day delivery.
            </p>
            <Link to="/products" search={{ category: "gift-hampers" } as never}
              className="mt-8 inline-block rounded-full bg-[color:var(--gold)] px-8 py-4 text-xs font-semibold uppercase tracking-widest text-[color:var(--gold-foreground)] hover:brightness-110 transition">
              Shop hampers
            </Link>
          </motion.div>
          <motion.img initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9 }}
            src={giftbox} alt="Luxury Diwali hamper" width={900} height={900}
            className="rounded-[2rem] shadow-luxe" />
        </div>
      </section>
      <section className="container-luxe py-20">
        <SectionHeading eyebrow="Curated hampers" title="Signature gift boxes" />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.filter(p => p.category === "gift-hampers" || p.isBestSeller).map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>
    </>
  ),
});