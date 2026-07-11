import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Building2, Package, Sparkles, HeartHandshake } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/corporate")({
  head: () => ({
    meta: [
      { title: "Corporate Gifting — Mithaas" },
      { name: "description", content: "Custom-branded festive hampers for teams, clients and events. 25 to 25,000 boxes, delivered pan-India." },
    ],
    links: [{ rel: "canonical", href: "/corporate" }],
  }),
  component: CorporatePage,
});

function CorporatePage() {
  return (
    <>
      <section className="bg-[color:var(--cream)] py-16 sm:py-24">
        <div className="container-luxe grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="divider-gold mb-4">Corporate Gifting</div>
            <h1 className="font-display text-4xl md:text-6xl leading-tight">
              Gifts your <span className="italic text-primary">team</span> and clients will remember.
            </h1>
            <p className="mt-5 text-muted-foreground max-w-lg">
              25 hampers or 25,000, custom-branded, delivered pan-India. Our concierge desk designs
              the boxes with your brand and handles every shipment, end to end.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                { icon: Building2, t: "Fully branded", d: "Boxes, notes, ribbons — all in your brand palette." },
                { icon: Package, t: "Bulk pricing", d: "Tiered rates from 25 boxes to 25k+." },
                { icon: HeartHandshake, t: "Concierge desk", d: "A single point of contact, quotes in 24h." },
                { icon: Sparkles, t: "Nationwide", d: "Multi-city drops with a single PO." },
              ].map(s => (
                <div key={s.t} className="card-luxe p-5">
                  <s.icon size={20} className="text-primary" />
                  <div className="mt-3 font-semibold">{s.t}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{s.d}</div>
                </div>
              ))}
            </div>
          </div>

          <motion.form
            onSubmit={(e) => { e.preventDefault(); toast.success("Thanks — our gifting desk will reach out within a business day."); }}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="card-luxe space-y-4 p-6 sm:p-8">
            <div className="font-display text-2xl">Talk to the gifting desk</div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Full name" name="name" />
              <Field label="Work email" name="email" type="email" />
              <Field label="Company" name="company" />
              <Field label="Phone" name="phone" />
              <Field label="Estimated quantity" name="qty" placeholder="e.g. 250 hampers" />
              <Field label="Delivery city" name="city" />
            </div>
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Requirements</span>
              <textarea rows={4} required placeholder="Tell us about your gifting occasion, budget and timeline."
                className="mt-1.5 w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary" />
            </label>
            <button className="w-full rounded-full bg-primary py-4 text-xs font-semibold uppercase tracking-widest text-primary-foreground shadow-luxe hover:bg-[color:var(--maroon-hover)]">
              Request a proposal
            </button>
          </motion.form>
        </div>
      </section>
    </>
  );
}

function Field({ label, name, type = "text", placeholder }: { label: string; name: string; type?: string; placeholder?: string }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</span>
      <input required name={name} type={type} placeholder={placeholder}
        className="mt-1.5 w-full rounded-full border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary" />
    </label>
  );
}