import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Phone, Clock, Navigation } from "lucide-react";
import { stores } from "@/lib/data";
import { SectionHeading } from "@/components/site/Section";

export const Route = createFileRoute("/stores")({
  head: () => ({
    meta: [
      { title: "Store Locator — Mithaas" },
      { name: "description", content: "Find a Mithaas flagship store near you. 24 locations across India." },
    ],
    links: [{ rel: "canonical", href: "/stores" }],
  }),
  component: () => (
    <section className="container-luxe py-16 sm:py-20">
      <SectionHeading eyebrow="Visit us" title="24 flagship stores across India" />
      <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_1.2fr]">
        <ul className="space-y-4">
          {stores.map(s => (
            <li key={s.id} className="card-luxe p-6">
              <div className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[color:var(--gold)]">{s.city}</div>
              <h3 className="mt-1 font-display text-xl">{s.name}</h3>
              <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                <div className="flex items-start gap-2"><MapPin size={15} className="mt-0.5 text-primary shrink-0" />{s.address}</div>
                <div className="flex items-start gap-2"><Phone size={15} className="mt-0.5 text-primary shrink-0" />{s.phone}</div>
                <div className="flex items-start gap-2"><Clock size={15} className="mt-0.5 text-primary shrink-0" />{s.hours}</div>
              </div>
              <a href={`https://maps.google.com/?q=${encodeURIComponent(s.name + " " + s.city)}`} target="_blank" rel="noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-primary/30 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-primary hover:bg-primary hover:text-primary-foreground transition">
                <Navigation size={13} /> Directions
              </a>
            </li>
          ))}
        </ul>
        <div className="sticky top-24 h-[600px] overflow-hidden rounded-[2rem] border border-border bg-[color:var(--cream)] shadow-soft">
          <div className="relative h-full w-full">
            <div aria-hidden className="absolute inset-0" style={{
              backgroundImage: "radial-gradient(circle at 30% 40%, rgba(139,30,36,0.15) 0, transparent 40%), radial-gradient(circle at 70% 60%, rgba(201,162,39,0.15) 0, transparent 40%), linear-gradient(135deg, #F5EBDB 0%, #EADFCB 100%)",
            }} />
            {stores.map((s, i) => (
              <div key={s.id} className="absolute" style={{ left: `${20 + (i * 12) % 60}%`, top: `${25 + (i * 17) % 50}%` }}>
                <div className="relative">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground shadow-luxe animate-float-slow">
                    <MapPin size={16} />
                  </div>
                  <div className="absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap rounded-md bg-card px-2 py-1 text-[10px] font-semibold shadow">
                    {s.city}
                  </div>
                </div>
              </div>
            ))}
            <div className="absolute bottom-4 left-4 rounded-full bg-card/95 px-4 py-2 text-xs text-muted-foreground backdrop-blur">
              Interactive map preview · Google Maps integration ready
            </div>
          </div>
        </div>
      </div>
    </section>
  ),
});