import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function SectionHeading({ eyebrow, title, subtitle, align = "center", className }:
  { eyebrow?: string; title: ReactNode; subtitle?: string; align?: "left" | "center"; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ duration: 0.6 }}
      className={cn(align === "center" ? "text-center mx-auto max-w-2xl" : "max-w-2xl", className)}
    >
      {eyebrow && <div className="divider-gold mb-4">{eyebrow}</div>}
      <h2 className="font-display text-3xl leading-tight sm:text-4xl md:text-[44px]">{title}</h2>
      {subtitle && <p className="mt-4 text-base text-muted-foreground">{subtitle}</p>}
    </motion.div>
  );
}