import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";

export const Route = createFileRoute("/franchise")({
  head: () => ({
    meta: [
      { title: "Franchise with Mithaas" },
      { name: "description", content: "Partner with India's most-loved mithai brand. Franchise opportunities across metros and tier-2 cities." },
    ],
    links: [{ rel: "canonical", href: "/franchise" }],
  }),
  component: () => (
    <section className="container-luxe py-16 sm:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <div className="divider-gold mb-4">Franchise</div>
        <h1 className="font-display text-4xl md:text-6xl leading-tight">Bring Mithaas to your city.</h1>
        <p className="mt-5 text-muted-foreground">
          We're partnering with entrepreneurs in metros and tier-2 cities to open the next 50 Mithaas stores.
        </p>
      </div>
      <div className="mx-auto mt-10 grid max-w-3xl gap-4 sm:grid-cols-3">
        {[["₹35–70 L","Total investment"],["12–18 mo","Payback horizon"],["500–1200 sq ft","Store footprint"]].map(([a,b]) => (
          <div key={b} className="card-luxe p-6 text-center">
            <div className="font-display text-2xl text-primary">{a}</div>
            <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">{b}</div>
          </div>
        ))}
      </div>
      <form onSubmit={(e) => { e.preventDefault(); toast.success("Application received — we'll be in touch."); }}
        className="card-luxe mx-auto mt-12 max-w-2xl space-y-4 p-8">
        <div className="grid gap-3 sm:grid-cols-2">
          <input required placeholder="Full name" className="rounded-full border border-border px-4 py-3 text-sm outline-none focus:border-primary" />
          <input required type="email" placeholder="Email" className="rounded-full border border-border px-4 py-3 text-sm outline-none focus:border-primary" />
          <input required placeholder="Phone" className="rounded-full border border-border px-4 py-3 text-sm outline-none focus:border-primary" />
          <input required placeholder="Preferred city" className="rounded-full border border-border px-4 py-3 text-sm outline-none focus:border-primary" />
        </div>
        <textarea required rows={4} placeholder="Tell us about your background and why you'd like to partner with Mithaas."
          className="w-full rounded-xl border border-border px-4 py-3 text-sm outline-none focus:border-primary" />
        <button className="w-full rounded-full bg-primary py-4 text-xs font-semibold uppercase tracking-widest text-primary-foreground hover:bg-[color:var(--maroon-hover)]">
          Submit application
        </button>
      </form>
    </section>
  ),
});