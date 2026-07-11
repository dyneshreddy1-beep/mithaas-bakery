import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { products } from "@/lib/data";
import { ProductCard } from "@/components/site/ProductCard";
import { SectionHeading } from "@/components/site/Section";

export const Route = createFileRoute("/festival")({
  head: () => ({
    meta: [
      { title: "Festival Collection — Mithaas" },
      { name: "description", content: "Diwali, Raksha Bandhan, Holi, Eid — festive collections of handcrafted Indian sweets." },
    ],
    links: [{ rel: "canonical", href: "/festival" }],
  }),
  component: () => (
    <>
      <section className="container-luxe py-16 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <div className="divider-gold mb-4">Festival Collection</div>
          <h1 className="font-display text-4xl md:text-6xl leading-tight">
            Every festival, <span className="italic text-primary">sweetened.</span>
          </h1>
          <p className="mt-5 text-muted-foreground">
            Diwali, Rakhi, Holi, Eid — mithais crafted for the moments that matter.
          </p>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {[
            { name: "Diwali", tag: "Now Live", tint: "from-[#8B1E24] to-[#5C1116]" },
            { name: "Raksha Bandhan", tag: "August", tint: "from-[#C9A227] to-[#8B6E13]" },
            { name: "Holi", tag: "March", tint: "from-[#A61D24] to-[#C9A227]" },
          ].map((f, i) => (
            <motion.div key={f.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i*0.08 }}
              className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${f.tint} p-8 h-64 text-primary-foreground shadow-luxe`}>
              <div className="text-xs uppercase tracking-widest text-[color:var(--gold)]">{f.tag}</div>
              <div className="mt-2 font-display text-3xl">{f.name}</div>
              <Link to="/products" className="mt-6 inline-block rounded-full bg-white/15 backdrop-blur px-5 py-2.5 text-xs font-semibold uppercase tracking-widest hover:bg-white/25">
                Shop the collection
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
      <section className="container-luxe pb-24">
        <SectionHeading eyebrow="Diwali edit" title="This season's most-loved" />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.slice(0, 4).map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      </section>
    </>
  ),
});