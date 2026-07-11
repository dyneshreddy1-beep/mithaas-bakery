import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { faqs } from "@/lib/data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQs — Mithaas" },
      { name: "description", content: "Frequently asked questions about Mithaas — freshness, delivery, ingredients, gifting and returns." },
    ],
    links: [{ rel: "canonical", href: "/faq" }],
  }),
  component: () => {
    const [open, setOpen] = useState<number | null>(0);
    return (
      <section className="container-luxe py-16 sm:py-20 max-w-3xl">
        <div className="divider-gold mb-4 justify-center">FAQs</div>
        <h1 className="text-center font-display text-4xl md:text-5xl leading-tight">Answers to the most-asked</h1>
        <div className="mt-12 space-y-3">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={i} className="card-luxe overflow-hidden">
                <button onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left">
                  <span className="font-display text-lg">{f.q}</span>
                  <ChevronDown size={18} className={cn("shrink-0 text-primary transition", isOpen && "rotate-180")} />
                </button>
                <div className={cn("grid transition-[grid-template-rows] duration-300", isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
                  <div className="overflow-hidden">
                    <p className="px-6 pb-6 text-sm text-muted-foreground leading-relaxed">{f.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    );
  },
});