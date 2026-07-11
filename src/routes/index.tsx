import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Award, Flame, Leaf, ShieldCheck, Sparkles, Truck } from "lucide-react";
import heroImg from "@/assets/hero-sweets.jpg";
import storyImg from "@/assets/story.jpg";
import { bestSellers, categories, testimonials } from "@/lib/data";
import { ProductCard } from "@/components/site/ProductCard";
import { SectionHeading } from "@/components/site/Section";
import { Rating } from "@/components/site/Rating";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <>
      <Hero />
      <Categories />
      <BestSellers />
      <WhyUs />
      <Story />
      <Testimonials />
      <CTA />
    </>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-[color:var(--cream)]">
      <div className="container-luxe grid gap-12 py-16 lg:grid-cols-2 lg:gap-8 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col justify-center"
        >
          <div className="divider-gold mb-6">Est. 1972 · Mumbai</div>
          <h1 className="font-display text-4xl leading-[1.05] sm:text-5xl md:text-6xl lg:text-[68px]">
            Authentic Indian Sweets<br />
            <span className="text-gradient-gold italic">crafted with tradition</span>
          </h1>
          <p className="mt-6 max-w-lg text-lg text-muted-foreground">
            Slow-cooked in copper pots. Finished by hand. Delivered to your door.
            Three generations of mithai-making, unchanged since 1972.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/products"
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-4 text-sm font-semibold uppercase tracking-widest text-primary-foreground shadow-luxe hover:bg-[color:var(--maroon-hover)] transition">
              Explore Collection
              <ArrowRight size={16} className="transition group-hover:translate-x-1" />
            </Link>
            <Link to="/stores"
              className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-card px-7 py-4 text-sm font-semibold uppercase tracking-widest text-primary hover:bg-primary hover:text-primary-foreground transition">
              Visit Stores
            </Link>
          </div>
          <div className="mt-10 grid max-w-md grid-cols-3 gap-6 border-t border-border/60 pt-6">
            {[
              { k: "50+", v: "Signature sweets" },
              { k: "1M+", v: "Boxes shipped" },
              { k: "4.9★", v: "Customer rating" },
            ].map(s => (
              <div key={s.v}>
                <div className="font-display text-2xl text-primary">{s.k}</div>
                <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">{s.v}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.1 }}
          className="relative"
        >
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] shadow-luxe">
            <img src={heroImg} alt="Assorted Indian sweets platter" width={1600} height={1000}
              className="h-full w-full object-cover" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent p-6 sm:p-8">
              <div className="flex items-center gap-4 rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-xl">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-[color:var(--gold)] text-primary">
                  <Sparkles size={20} />
                </div>
                <div className="text-primary-foreground">
                  <div className="text-sm font-semibold tracking-wide">The Diwali Royale</div>
                  <div className="text-xs opacity-80">Signature festive hamper · Now shipping</div>
                </div>
                <Link to="/gift-boxes" className="ml-auto rounded-full bg-[color:var(--gold)] px-4 py-2 text-xs font-semibold uppercase tracking-widest text-[color:var(--gold-foreground)] hover:bg-[color:var(--gold)]/90 transition">
                  Shop
                </Link>
              </div>
            </div>
          </div>
          <motion.div
            aria-hidden animate={{ y: [0, -12, 0] }} transition={{ duration: 6, repeat: Infinity }}
            className="absolute -left-6 top-10 hidden h-24 w-24 rounded-full bg-[color:var(--gold)]/20 blur-2xl md:block"
          />
          <motion.div
            aria-hidden animate={{ y: [0, 16, 0] }} transition={{ duration: 7, repeat: Infinity }}
            className="absolute -bottom-6 -right-6 hidden h-40 w-40 rounded-full bg-primary/20 blur-3xl md:block"
          />
        </motion.div>
      </div>
    </section>
  );
}

function Categories() {
  return (
    <section className="container-luxe py-20 sm:py-24">
      <SectionHeading
        eyebrow="Featured Categories"
        title={<>Every mithai has a <span className="italic text-primary">story</span></>}
        subtitle="From cashew classics to slow-cooked milk sweets, hand-fried namkeen and heirloom pickles — explore our full menu."
      />
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c, i) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
          >
            <Link
              to="/products" search={{ category: c.slug } as never}
              className="group relative flex h-56 overflow-hidden rounded-2xl border border-border bg-card shadow-soft hover:shadow-luxe transition"
            >
              <div className="flex flex-1 flex-col justify-between p-6">
                <div className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[color:var(--gold)]">
                  Collection
                </div>
                <div>
                  <h3 className="font-display text-2xl">{c.name}</h3>
                  <p className="mt-1.5 max-w-[240px] text-sm text-muted-foreground">{c.description}</p>
                  <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
                    Shop <ArrowRight size={14} className="transition group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
              <div aria-hidden className="absolute inset-y-0 right-0 w-2/5 bg-gradient-luxe opacity-90 clip-tilt" />
              <div className="absolute right-6 top-1/2 -translate-y-1/2 grid h-24 w-24 place-items-center rounded-full bg-[color:var(--cream)] text-4xl shadow-xl">
                {["🥮","🍮","🥜","🥯","🫙","🥐","🎁"][i] ?? "🍬"}
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function BestSellers() {
  return (
    <section className="bg-[color:var(--cream)] py-20 sm:py-24">
      <div className="container-luxe">
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            align="left" eyebrow="Bestsellers"
            title={<>The mithais our <span className="italic text-primary">customers</span> reorder</>}
          />
          <Link to="/products" className="story-link text-sm font-semibold uppercase tracking-widest text-primary">
            View all products
          </Link>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {bestSellers.slice(0, 4).map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      </div>
    </section>
  );
}

function WhyUs() {
  const points = [
    { icon: Leaf, title: "100% Pure A2 Ghee", body: "Sourced from a single desi-cow farm in Gujarat, cold-clarified in small batches." },
    { icon: Flame, title: "Fresh Daily", body: "Every mithai is made the morning it is dispatched — never from cold storage." },
    { icon: Award, title: "Premium Ingredients", body: "Ratnagiri cashews, Iranian pistachios, Kashmiri saffron, single-origin sugar." },
    { icon: Sparkles, title: "Traditional Recipes", body: "Three-generation recipes cooked on copper, unchanged since 1972." },
    { icon: Truck, title: "Fast Nationwide Delivery", body: "Next-day dispatch to 19,000+ pincodes in temperature-controlled boxes." },
    { icon: ShieldCheck, title: "Secure Packaging", body: "Food-safe boxes with ice packs and shock-resistant inserts." },
  ];
  return (
    <section className="container-luxe py-20 sm:py-24">
      <SectionHeading eyebrow="Why Mithaas" title="Uncompromising in every step" />
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {points.map((p, i) => (
          <motion.div key={p.title}
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.05 }}
            className="card-luxe p-6 sm:p-7"
          >
            <div className="grid h-12 w-12 place-items-center rounded-full bg-gradient-luxe text-[color:var(--gold)] shadow-md">
              <p.icon size={20} />
            </div>
            <h3 className="mt-5 font-display text-xl">{p.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{p.body}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Story() {
  return (
    <section className="bg-[color:var(--cream)] py-20 sm:py-28">
      <div className="container-luxe grid gap-12 lg:grid-cols-2 lg:gap-16">
        <motion.div
          initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7 }}
          className="relative"
        >
          <div className="aspect-[4/5] overflow-hidden rounded-[2rem] shadow-luxe">
            <img src={storyImg} alt="Traditional Indian sweet-making" width={1200} height={1400}
              loading="lazy" className="h-full w-full object-cover" />
          </div>
          <div className="absolute -bottom-6 -right-6 hidden max-w-[260px] rounded-2xl bg-gradient-luxe p-6 text-primary-foreground shadow-luxe md:block">
            <div className="font-display text-4xl text-[color:var(--gold)]">52</div>
            <div className="mt-1 text-xs uppercase tracking-[0.28em]">Years of tradition</div>
          </div>
        </motion.div>

        <div className="flex flex-col justify-center">
          <div className="divider-gold mb-4">Our Story</div>
          <h2 className="font-display text-3xl leading-tight sm:text-4xl md:text-[42px]">
            A copper pot, a stone grinder, and one recipe from 1972.
          </h2>
          <p className="mt-5 text-muted-foreground">
            When Shri Damodar Sharma opened a two-shelf mithai counter in Bhuleshwar,
            he had exactly three sweets on offer. Today, his grandchildren run 24 flagship
            stores across India — but the copper kadhai from that first shop still hangs above our head chef's station.
          </p>
          <ul className="mt-8 space-y-6">
            {[
              { y: "1972", t: "The first counter", d: "A tiny shop opens in Bhuleshwar, Mumbai — three sweets, one copper pot." },
              { y: "1998", t: "The family recipes", d: "Second generation documents every recipe by hand — the 'Mithaas Book' is born." },
              { y: "2014", t: "Modern kitchens", d: "We open our first cloud kitchen and begin same-day delivery across Mumbai." },
              { y: "2024", t: "Across India", d: "Now shipping to 19,000+ pincodes, still made the same way." },
            ].map((m) => (
              <li key={m.y} className="flex gap-5">
                <div className="shrink-0 font-display text-2xl text-primary w-16">{m.y}</div>
                <div>
                  <div className="font-semibold">{m.t}</div>
                  <p className="text-sm text-muted-foreground">{m.d}</p>
                </div>
              </li>
            ))}
          </ul>
          <Link to="/about" className="mt-8 self-start rounded-full border border-primary/30 px-6 py-3 text-xs font-semibold uppercase tracking-widest text-primary hover:bg-primary hover:text-primary-foreground transition">
            Read our full story
          </Link>
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="container-luxe py-20 sm:py-24">
      <SectionHeading eyebrow="Guest Book" title="Loved across India" />
      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {testimonials.map((t, i) => (
          <motion.figure key={t.id}
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.05 }}
            className="card-luxe flex flex-col gap-4 p-6"
          >
            <Rating value={t.rating} />
            <blockquote className="text-sm leading-relaxed text-foreground/90">"{t.quote}"</blockquote>
            <figcaption className="mt-auto flex items-center gap-3 pt-3 border-t border-border/60">
              <img src={t.avatar} alt="" className="h-10 w-10 rounded-full object-cover" loading="lazy" />
              <div>
                <div className="text-sm font-semibold">{t.name}</div>
                <div className="text-xs text-muted-foreground">{t.city}</div>
              </div>
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="container-luxe pb-24">
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-luxe px-8 py-16 text-primary-foreground shadow-luxe sm:px-14 sm:py-20">
        <div aria-hidden className="absolute -left-16 -top-16 h-64 w-64 rounded-full bg-[color:var(--gold)]/25 blur-3xl" />
        <div aria-hidden className="absolute -right-16 -bottom-16 h-72 w-72 rounded-full bg-[color:var(--gold)]/20 blur-3xl" />
        <div className="relative mx-auto max-w-3xl text-center">
          <div className="divider-gold mb-4 !text-[color:var(--gold)]">Corporate Gifting</div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl">
            Send a little joy to a lot of people.
          </h2>
          <p className="mt-4 text-primary-foreground/80">
            From 25 hampers to 25,000 — our concierge desk crafts custom branded gifting for teams,
            clients and events across India.
          </p>
          <Link to="/corporate"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[color:var(--gold)] px-8 py-4 text-sm font-semibold uppercase tracking-widest text-[color:var(--gold-foreground)] hover:brightness-110 transition">
            Talk to the gifting desk <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
