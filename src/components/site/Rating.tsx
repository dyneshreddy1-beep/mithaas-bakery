import { Star } from "lucide-react";

export function Rating({ value, count, size = 14 }: { value: number; count?: number; size?: number }) {
  const full = Math.round(value);
  return (
    <div className="inline-flex items-center gap-1.5" aria-label={`Rated ${value} out of 5`}>
      <div className="flex text-[color:var(--gold)]">
        {[0,1,2,3,4].map(i => (
          <Star key={i} size={size} strokeWidth={1.5}
            className={i < full ? "fill-current" : "fill-transparent opacity-40"} />
        ))}
      </div>
      <span className="text-xs text-muted-foreground">
        {value.toFixed(1)}{count ? ` · ${count.toLocaleString("en-IN")}` : ""}
      </span>
    </div>
  );
}