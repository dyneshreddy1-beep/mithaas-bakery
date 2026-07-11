import type { ReactNode } from "react";

export function PolicyLayout({ eyebrow, title, updated, children }:
  { eyebrow: string; title: string; updated: string; children: ReactNode }) {
  return (
    <article className="container-luxe max-w-3xl py-16 sm:py-20">
      <div className="divider-gold mb-3">{eyebrow}</div>
      <h1 className="font-display text-4xl md:text-5xl leading-tight">{title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{updated}</p>
      <div className="prose prose-neutral mt-10 max-w-none [&_h3]:font-display [&_h3]:text-2xl [&_h3]:mt-8 [&_h3]:mb-3 [&_p]:text-muted-foreground [&_p]:leading-relaxed [&_p]:mt-3">
        {children}
      </div>
    </article>
  );
}