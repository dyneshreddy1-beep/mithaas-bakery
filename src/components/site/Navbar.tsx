import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, Search, ShoppingBag, Heart, User, X } from "lucide-react";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const nav = [
  { label: "Shop", to: "/products" },
  { label: "Categories", to: "/categories" },
  { label: "Gift Boxes", to: "/gift-boxes" },
  { label: "Festival", to: "/festival" },
  { label: "Corporate", to: "/corporate" },
  { label: "Stores", to: "/stores" },
  { label: "Story", to: "/about" },
  { label: "Journal", to: "/blog" },
] as const;

export function Navbar() {
  const { cartCount, wishlist } = useStore();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const path = useRouterState({ select: s => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [path]);

  return (
    <>
      {/* Announcement */}
      <div className="bg-gradient-luxe text-primary-foreground text-[11px] sm:text-xs">
        <div className="container-luxe flex flex-wrap items-center justify-center gap-x-6 gap-y-1 py-2 text-center">
          <span className="tracking-[0.2em] uppercase font-medium">
            Free next-day delivery on orders above ₹999
          </span>
          <span className="hidden sm:inline text-[color:var(--gold)]">•</span>
          <span className="hidden sm:inline">Use <b className="text-[color:var(--gold)]">DIWALI10</b> for 10% off</span>
        </div>
      </div>

      <header className={cn(
        "sticky top-0 z-40 transition-all",
        scrolled ? "bg-background/85 backdrop-blur-lg shadow-[0_4px_24px_-16px_rgba(139,30,36,0.25)]" : "bg-background",
        "border-b border-border/60"
      )}>
        <div className="container-luxe flex items-center gap-4 py-4">
          <button
            className="lg:hidden -ml-2 p-2 text-foreground"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
          ><Menu size={22} /></button>

          <Link to="/" className="flex items-center gap-2 min-w-0">
            <Logo />
          </Link>

          <nav className="mx-auto hidden lg:flex items-center gap-7 text-sm">
            {nav.map(n => (
              <Link key={n.to} to={n.to}
                className="relative py-1 text-foreground/80 hover:text-primary transition data-[active=true]:text-primary"
                activeProps={{ "data-active": "true" } as never}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-1">
            <button aria-label="Search" className="grid h-10 w-10 place-items-center rounded-full hover:bg-muted transition">
              <Search size={18} />
            </button>
            <Link to="/account" aria-label="Account" className="grid h-10 w-10 place-items-center rounded-full hover:bg-muted transition">
              <User size={18} />
            </Link>
            <Link to="/wishlist" aria-label="Wishlist" className="relative grid h-10 w-10 place-items-center rounded-full hover:bg-muted transition">
              <Heart size={18} />
              {wishlist.length > 0 && <Badge>{wishlist.length}</Badge>}
            </Link>
            <Link to="/cart" aria-label="Cart" className="relative grid h-10 w-10 place-items-center rounded-full hover:bg-muted transition">
              <ShoppingBag size={18} />
              {cartCount > 0 && <Badge>{cartCount}</Badge>}
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <div className={cn("fixed inset-0 z-50 lg:hidden transition", open ? "pointer-events-auto" : "pointer-events-none")}>
        <div onClick={() => setOpen(false)}
          className={cn("absolute inset-0 bg-black/50 transition-opacity", open ? "opacity-100" : "opacity-0")} />
        <aside className={cn(
          "absolute inset-y-0 left-0 w-[85%] max-w-sm bg-background shadow-2xl transition-transform",
          open ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="flex items-center justify-between px-6 py-5 border-b border-border">
            <Logo />
            <button aria-label="Close menu" onClick={() => setOpen(false)} className="p-2"><X size={22} /></button>
          </div>
          <nav className="flex flex-col p-4">
            {nav.map(n => (
              <Link key={n.to} to={n.to}
                className="rounded-lg px-4 py-3 text-base hover:bg-muted"
              >{n.label}</Link>
            ))}
            <div className="mt-4 border-t border-border pt-4 px-4 text-sm text-muted-foreground">
              <Link to="/contact" className="block py-2">Contact</Link>
              <Link to="/faq" className="block py-2">FAQs</Link>
              <Link to="/track" className="block py-2">Track order</Link>
            </div>
          </nav>
        </aside>
      </div>
    </>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold leading-none text-primary-foreground">
      {children}
    </span>
  );
}

function Logo() {
  return (
    <div className="flex items-center gap-2.5 min-w-0">
      <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-luxe text-primary-foreground shadow-md">
        <span className="font-display text-xl">M</span>
      </div>
      <div className="min-w-0">
        <div className="font-display text-xl leading-none tracking-tight">Mithaas</div>
        <div className="text-[10px] uppercase tracking-[0.28em] text-[color:var(--gold)]">Since 1972</div>
      </div>
    </div>
  );
}