import { createFileRoute } from "@tanstack/react-router";
import { PolicyLayout } from "@/components/site/PolicyLayout";

export const Route = createFileRoute("/refund")({
  head: () => ({
    meta: [{ title: "Refund Policy — Mithaas" }, { name: "description", content: "Refunds, replacements and damage guarantee at Mithaas." }],
    links: [{ rel: "canonical", href: "/refund" }],
  }),
  component: () => (
    <PolicyLayout eyebrow="Support" title="Refund & Replacement Policy" updated="Updated 1 October 2025">
      <p>Because our sweets are perishable and made fresh to order, we do not accept general returns. However, our damage guarantee is unconditional.</p>
      <h3>Damaged or spoilt on arrival</h3>
      <p>Share a clear photo within 24 hours of delivery on hello@mithaas.co or WhatsApp — we'll replace the item at no cost or issue a full refund, whichever you prefer.</p>
      <h3>Order cancellations</h3>
      <p>Orders can be cancelled free of charge until they enter our kitchen (usually within an hour of placement). After that, kitchen costs apply.</p>
      <h3>Refund timelines</h3>
      <p>Approved refunds are credited to your original payment method within 5–7 business days.</p>
    </PolicyLayout>
  ),
});