import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Package, Truck, MapPin, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/track")({
  head: () => ({ meta: [{ title: "Track your order — Mithaas" }, { name: "robots", content: "noindex" }] }),
  component: TrackPage,
});

const stages = [
  { key: "packed", label: "Packed", icon: Package, at: "Today, 09:42 AM · Mumbai kitchen" },
  { key: "shipped", label: "Shipped", icon: Truck, at: "Today, 12:20 PM · Mumbai hub" },
  { key: "ofd", label: "Out for Delivery", icon: MapPin, at: "Today, 06:50 AM · Bandra hub" },
  { key: "delivered", label: "Delivered", icon: CheckCircle2, at: "Expected by 4:00 PM" },
] as const;

function TrackPage() {
  const [id, setId] = useState("MT-24051");
  const currentStage = 2;
  return (
    <section className="container-luxe py-12 sm:py-16">
      <div className="mx-auto max-w-2xl">
        <div className="divider-gold mb-3">Order Tracking</div>
        <h1 className="font-display text-3xl md:text-5xl leading-tight">Where's your box?</h1>

        <form onSubmit={(e) => e.preventDefault()} className="mt-8 flex gap-2 rounded-full border border-border bg-card p-1.5 shadow-soft">
          <input value={id} onChange={(e) => setId(e.target.value)} placeholder="Order ID"
            className="flex-1 bg-transparent px-4 text-sm outline-none" />
          <button className="rounded-full bg-primary px-6 py-2.5 text-xs font-semibold uppercase tracking-widest text-primary-foreground">Track</button>
        </form>

        <div className="mt-10 card-luxe p-6 sm:p-8">
          <div className="text-[10px] font-semibold uppercase tracking-widest text-[color:var(--gold)]">Order #{id}</div>
          <div className="mt-1 font-display text-xl">2 items · Mithaas Bandra kitchen → Bandra West, Mumbai</div>

          <ol className="mt-8 space-y-6">
            {stages.map((s, i) => {
              const active = i <= currentStage;
              return (
                <li key={s.key} className="flex gap-5">
                  <div className="relative">
                    <div className={cn("grid h-11 w-11 place-items-center rounded-full transition",
                      active ? "bg-primary text-primary-foreground shadow-luxe" : "bg-muted text-muted-foreground")}>
                      <s.icon size={18} />
                    </div>
                    {i < stages.length - 1 && (
                      <div className={cn("absolute left-1/2 top-full h-8 w-0.5 -translate-x-1/2",
                        i < currentStage ? "bg-primary" : "bg-border")} />
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className={cn("font-display text-lg", active ? "text-foreground" : "text-muted-foreground")}>{s.label}</div>
                    <div className="text-xs text-muted-foreground">{s.at}</div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}