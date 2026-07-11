export function inr(n: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency", currency: "INR", maximumFractionDigits: 0,
  }).format(n);
}

export function pct(from: number, to: number): number {
  if (!from || from <= to) return 0;
  return Math.round(((from - to) / from) * 100);
}