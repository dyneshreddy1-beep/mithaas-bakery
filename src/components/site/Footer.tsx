import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Youtube, Twitter, Mail, Phone, MessageCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-[color:var(--cream)]">
      <div className="container-luxe grid gap-12 py-16 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <div className="font-display text-2xl">Mithaas</div>
          <p className="mt-3 text-sm text-muted-foreground max-w-sm">
            Handcrafted Indian sweets, made in copper pots and pure A2 ghee since 1972.
            Delivered fresh across India — carrying the taste of home wherever you are.
          </p>
          <form onSubmit={(e) => e.preventDefault()} className="mt-6 flex max-w-sm rounded-full border border-border bg-card p-1.5 shadow-sm">
            <input
              type="email" required placeholder="Your email for festive drops"
              className="flex-1 bg-transparent px-4 text-sm outline-none placeholder:text-muted-foreground"
              aria-label="Email"
            />
            <button className="rounded-full bg-primary px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-primary-foreground hover:bg-[color:var(--maroon-hover)]">
              Subscribe
            </button>
          </form>
          <div className="mt-6 flex gap-3">
            {[Instagram, Facebook, Youtube, Twitter].map((Icon, i) => (
              <a key={i} href="#" aria-label="social"
                className="grid h-10 w-10 place-items-center rounded-full border border-border bg-card text-primary hover:bg-primary hover:text-primary-foreground transition">
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        <FooterCol title="Explore" links={[
          ["Shop All", "/products"],
          ["Categories", "/categories"],
          ["Gift Boxes", "/gift-boxes"],
          ["Festival Collection", "/festival"],
          ["Corporate Gifting", "/corporate"],
          ["Our Story", "/about"],
        ]} />
        <FooterCol title="Support" links={[
          ["Contact", "/contact"],
          ["FAQs", "/faq"],
          ["Track Order", "/track"],
          ["Store Locator", "/stores"],
          ["Franchise", "/franchise"],
          ["Journal", "/blog"],
        ]} />
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--gold)]">Reach us</h4>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-start gap-2.5"><Phone size={15} className="mt-0.5 text-primary" /><span>+91 22 2600 1122</span></li>
            <li className="flex items-start gap-2.5"><MessageCircle size={15} className="mt-0.5 text-primary" /><span>WhatsApp: +91 98200 12345</span></li>
            <li className="flex items-start gap-2.5"><Mail size={15} className="mt-0.5 text-primary" /><span>hello@mithaas.co</span></li>
          </ul>
          <p className="mt-4 text-xs text-muted-foreground">Mon–Sun · 9:00 AM – 10:30 PM IST</p>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="container-luxe flex flex-wrap items-center justify-between gap-3 py-5 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Mithaas Confectioners Pvt. Ltd. — Made with A2 ghee in Mumbai.</p>
          <div className="flex gap-5">
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
            <Link to="/refund">Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <h4 className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--gold)]">{title}</h4>
      <ul className="mt-4 space-y-2.5 text-sm">
        {links.map(([label, href]) => (
          <li key={href}><Link to={href} className="text-foreground/80 hover:text-primary transition">{label}</Link></li>
        ))}
      </ul>
    </div>
  );
}