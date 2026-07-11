import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import storyImg from "@/assets/story.jpg";
import heroImg from "@/assets/hero-sweets.jpg";
import { SectionHeading } from "@/components/site/Section";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Our Story — Mithaas" },
      { name: "description", content: "Three generations of mithai-making, copper pots and A2 ghee — the story of Mithaas since 1972." },
      { property: "og:title", content: "Our Story — Mithaas" },
      { property: "og:description", content: "Three generations of mithai-making, since 1972." },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-[color:var(--cream)]">
        <div className="container-luxe grid gap-12 py-16 md:py-24 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="divider-gold mb-4">Our Story</div>
            <h1 className="font-display text-4xl leading-tight sm:text-5xl md:text-6xl">
              A family, a <span className="italic text-primary">copper pot</span>, and 52 years of mithai.
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-lg">
              Three generations. One recipe book. Zero shortcuts. This is the story of how a
              two-shelf shop in Bhuleshwar became India's most-loved home for handcrafted mithai.
            </p>
          </div>
          <div className="aspect-[4/5] overflow-hidden rounded-[2rem] shadow-luxe">
            <img src={heroImg} alt="Mithaas sweets" className="h-full w-full object-cover" width={1600} height={1000} />
          </div>
        </div>
      </section>

      <section className="container-luxe py-20">
        <SectionHeading eyebrow="Timeline" title="Milestones on a slow flame" />
        <div className="relative mx-auto mt-16 max-w-3xl">
          <div className="absolute left-4 top-0 bottom-0 w-px bg-border md:left-1/2" />
          {timeline.map((t, i) => (
            <motion.div key={t.year}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.05 }}
              className={"relative mb-10 pl-12 md:mb-14 md:pl-0 md:grid md:grid-cols-2 md:gap-10 " + (i % 2 ? "md:text-left" : "md:text-right")}
            >
              <span className="absolute left-1.5 top-2 grid h-5 w-5 place-items-center rounded-full bg-primary text-[10px] text-primary-foreground md:left-1/2 md:-translate-x-1/2">●</span>
              <div className={i % 2 ? "md:col-start-2" : ""}>
                <div className="font-display text-3xl text-primary">{t.year}</div>
                <h3 className="mt-2 font-display text-xl">{t.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{t.body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-[color:var(--cream)] py-20">
        <div className="container-luxe grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="aspect-[4/5] overflow-hidden rounded-[2rem] shadow-luxe">
            <img src={storyImg} alt="Craftsmanship" width={1200} height={1400} className="h-full w-full object-cover" loading="lazy" />
          </div>
          <div>
            <div className="divider-gold mb-4">Craftsmanship</div>
            <h2 className="font-display text-3xl leading-tight sm:text-4xl">The old ways are still the best ways.</h2>
            <p className="mt-4 text-muted-foreground">
              We could make more, cheaper, faster. We chose not to. Every sweet at Mithaas is
              made on a live flame in a copper kadhai, folded by hand, cut with a bevelled knife,
              and packed the same morning it is dispatched.
            </p>
            <dl className="mt-8 grid grid-cols-2 gap-6">
              {[
                ["Copper", "for slow, even heat"],
                ["A2 Ghee", "single-farm, cold-clarified"],
                ["Stone grinding", "keeps nuts from turning oily"],
                ["Silver varak", "hand-applied, edible, pure"],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="font-display text-xl text-primary">{k}</dt>
                  <dd className="text-sm text-muted-foreground">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>
    </>
  );
}

const timeline = [
  { year: "1972", title: "The first counter", body: "Damodar Sharma opens a mithai shop in Bhuleshwar, Mumbai — three sweets, one copper pot, and a fixed sign that reads 'made fresh daily'." },
  { year: "1985", title: "The wedding season", body: "Word spreads. Mithaas becomes the go-to mithai for Mumbai's biggest weddings; a second location opens in Dadar." },
  { year: "1998", title: "The Mithaas Book", body: "Second-generation Anand Sharma writes down every family recipe by hand — the internal 'Mithaas Book' that still guides our head chefs." },
  { year: "2014", title: "Modern kitchens", body: "We open our first cloud kitchen and begin same-day delivery across Mumbai. Recipes unchanged." },
  { year: "2020", title: "Pan-India", body: "Nationwide next-day shipping launches. 19,000+ pincodes covered on day one." },
  { year: "2024", title: "The next chapter", body: "24 flagship stores. Same copper kadhai from 1972 still hangs above the head chef's station." },
];