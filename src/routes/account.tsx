import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Package, MapPin, User, Bell, Heart } from "lucide-react";
import { sampleOrders } from "@/lib/data";
import { useStore } from "@/lib/store";
import { inr } from "@/lib/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/account")({
  head: () => ({ meta: [{ title: "My Account — Mithaas" }, { name: "robots", content: "noindex" }] }),
  component: AccountPage,
});

const tabs = [
  { id: "orders", label: "Orders", icon: Package },
  { id: "wishlist", label: "Wishlist", icon: Heart },
  { id: "addresses", label: "Addresses", icon: MapPin },
  { id: "profile", label: "Profile", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
] as const;

function AccountPage() {
  const [tab, setTab] = useState<(typeof tabs)[number]["id"]>("orders");
  const { wishlist } = useStore();

  return (
    <section className="container-luxe py-12 sm:py-16">
      <header className="flex flex-wrap items-center gap-6 border-b border-border pb-8">
        <div className="grid h-16 w-16 place-items-center rounded-full bg-gradient-luxe text-primary-foreground font-display text-2xl">A</div>
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-widest text-[color:var(--gold)]">Welcome back</div>
          <h1 className="font-display text-3xl">Aarav Sharma</h1>
          <p className="text-sm text-muted-foreground">aarav@example.com · Member since 2022</p>
        </div>
      </header>

      <div className="mt-10 grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside>
          <ul className="flex gap-2 overflow-x-auto lg:flex-col">
            {tabs.map(t => (
              <li key={t.id}>
                <button onClick={() => setTab(t.id)}
                  className={cn("flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm transition",
                    tab === t.id ? "bg-primary text-primary-foreground" : "hover:bg-muted")}>
                  <t.icon size={16} /> {t.label}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <div>
          {tab === "orders" && (
            <div className="space-y-4">
              {sampleOrders.map(o => (
                <div key={o.id} className="card-luxe p-6">
                  <div className="flex flex-wrap items-center gap-3">
                    <div>
                      <div className="text-[10px] font-semibold uppercase tracking-widest text-[color:var(--gold)]">Order #{o.id}</div>
                      <div className="text-sm text-muted-foreground">Placed on {o.date}</div>
                    </div>
                    <span className={cn("ml-auto rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-widest",
                      o.status === "Delivered" ? "bg-[color:var(--success)]/10 text-[color:var(--success)]" : "bg-primary/10 text-primary")}>
                      {o.status}
                    </span>
                  </div>
                  <ul className="mt-4 divide-y divide-border">
                    {o.items.map((it, i) => (
                      <li key={i} className="flex items-center gap-4 py-3">
                        <img src={it.image} alt={it.name} className="h-14 w-14 rounded-lg object-cover" />
                        <div className="flex-1">
                          <div className="font-semibold">{it.name}</div>
                          <div className="text-xs text-muted-foreground">Qty {it.qty}</div>
                        </div>
                        <div className="font-display">{inr(it.price)}</div>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
                    <div className="text-sm">Total: <b className="font-display text-lg text-primary">{inr(o.total)}</b></div>
                    <Link to="/track" className="rounded-full border border-primary/30 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-primary hover:bg-primary hover:text-primary-foreground">
                      Track order
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
          {tab === "wishlist" && (
            <div className="card-luxe p-8">
              <p>You have <b className="text-primary">{wishlist.length}</b> items in your wishlist.</p>
              <Link to="/wishlist" className="mt-4 inline-block rounded-full bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-widest text-primary-foreground">View wishlist</Link>
            </div>
          )}
          {tab === "addresses" && (
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { name: "Home", addr: "204, Ocean Heights, Turner Road, Bandra West, Mumbai 400050" },
                { name: "Office", addr: "9th floor, One BKC, Bandra Kurla Complex, Mumbai 400051" },
              ].map(a => (
                <div key={a.name} className="card-luxe p-6">
                  <div className="text-[10px] font-semibold uppercase tracking-widest text-[color:var(--gold)]">{a.name}</div>
                  <p className="mt-2 text-sm">{a.addr}</p>
                  <div className="mt-4 flex gap-2 text-xs font-semibold uppercase tracking-widest">
                    <button className="text-primary story-link">Edit</button>
                    <button className="text-muted-foreground story-link">Delete</button>
                  </div>
                </div>
              ))}
              <button className="card-luxe grid place-items-center p-10 text-sm font-semibold uppercase tracking-widest text-primary hover:bg-primary/5">+ Add new address</button>
            </div>
          )}
          {tab === "profile" && (
            <form className="card-luxe grid gap-3 p-8 sm:grid-cols-2">
              <input defaultValue="Aarav" placeholder="First name" className="rounded-full border border-border px-4 py-3 text-sm" />
              <input defaultValue="Sharma" placeholder="Last name" className="rounded-full border border-border px-4 py-3 text-sm" />
              <input defaultValue="aarav@example.com" className="rounded-full border border-border px-4 py-3 text-sm sm:col-span-2" />
              <input defaultValue="+91 98200 12345" className="rounded-full border border-border px-4 py-3 text-sm sm:col-span-2" />
              <button type="button" className="sm:col-span-2 rounded-full bg-primary py-3 text-xs font-semibold uppercase tracking-widest text-primary-foreground">Save changes</button>
            </form>
          )}
          {tab === "notifications" && (
            <div className="card-luxe divide-y divide-border p-2">
              {["Order updates","Festival drops","Recipe journal","Personalised offers"].map((n, i) => (
                <label key={n} className="flex items-center justify-between p-4">
                  <span>{n}</span>
                  <input type="checkbox" defaultChecked={i < 3} className="h-5 w-9 accent-[color:var(--maroon)]" />
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}