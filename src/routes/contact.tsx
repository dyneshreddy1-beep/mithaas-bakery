import { createFileRoute } from "@tanstack/react-router";
import { Mail, Phone, MessageCircle, MapPin } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Mithaas" },
      { name: "description", content: "Get in touch with the Mithaas team — email, phone, WhatsApp, and store visits." },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: () => (
    <section className="container-luxe py-16 sm:py-20">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <div className="divider-gold mb-4">Contact</div>
          <h1 className="font-display text-4xl md:text-5xl leading-tight">
            We'd love to <span className="italic text-primary">hear from you</span>.
          </h1>
          <p className="mt-4 text-muted-foreground max-w-lg">
            Whether it's a query about a specific order, a corporate gifting request, or a compliment for our chef — we reply within one business day.
          </p>
          <div className="mt-8 space-y-5 text-sm">
            {[
              { icon: Phone, t: "+91 22 2600 1122", s: "Mon–Sun · 9AM–10:30PM IST" },
              { icon: MessageCircle, t: "WhatsApp: +91 98200 12345", s: "Reply within an hour" },
              { icon: Mail, t: "hello@mithaas.co", s: "For everything else" },
              { icon: MapPin, t: "Turner Road, Bandra West, Mumbai", s: "Flagship store & kitchen" },
            ].map(x => (
              <div key={x.t} className="flex items-start gap-4">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gradient-luxe text-[color:var(--gold)]"><x.icon size={18} /></div>
                <div><div className="font-semibold">{x.t}</div><div className="text-muted-foreground">{x.s}</div></div>
              </div>
            ))}
          </div>
          <div className="mt-10 aspect-[16/9] overflow-hidden rounded-2xl border border-border" style={{
            backgroundImage: "linear-gradient(135deg, #F5EBDB 0%, #EADFCB 100%)"
          }}>
            <div className="grid h-full place-items-center text-sm text-muted-foreground">Map preview · Bandra West, Mumbai</div>
          </div>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); toast.success("Message sent — we'll reply within a business day."); }}
          className="card-luxe h-fit space-y-4 p-6 sm:p-8">
          <div className="font-display text-2xl">Send us a note</div>
          <input required placeholder="Full name" className="w-full rounded-full border border-border px-4 py-3 text-sm outline-none focus:border-primary" />
          <input required type="email" placeholder="Email" className="w-full rounded-full border border-border px-4 py-3 text-sm outline-none focus:border-primary" />
          <input placeholder="Subject" className="w-full rounded-full border border-border px-4 py-3 text-sm outline-none focus:border-primary" />
          <textarea required rows={5} placeholder="How can we help?" className="w-full rounded-xl border border-border px-4 py-3 text-sm outline-none focus:border-primary" />
          <button className="w-full rounded-full bg-primary py-4 text-xs font-semibold uppercase tracking-widest text-primary-foreground shadow-luxe hover:bg-[color:var(--maroon-hover)]">
            Send message
          </button>
        </form>
      </div>
    </section>
  ),
});