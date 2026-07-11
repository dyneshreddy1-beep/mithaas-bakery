import { createFileRoute } from "@tanstack/react-router";
import { PolicyLayout } from "@/components/site/PolicyLayout";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [{ title: "Privacy Policy — Mithaas" }, { name: "description", content: "How Mithaas handles your personal information." }],
    links: [{ rel: "canonical", href: "/privacy" }],
  }),
  component: () => (
    <PolicyLayout eyebrow="Privacy" title="Privacy Policy" updated="Updated 1 October 2025">
      <p>Mithaas Confectioners Pvt. Ltd. respects your privacy and is committed to protecting the personal information you share with us.</p>
      <h3>Information we collect</h3>
      <p>Name, contact details, delivery addresses, order history, and payment identifiers (never the full card number).</p>
      <h3>How we use your information</h3>
      <p>To process orders, keep you informed about deliveries, and — with your consent — share festive drops and personalised recommendations.</p>
      <h3>Sharing</h3>
      <p>We never sell your data. We share only what is required with logistics and payment partners, under strict data protection agreements.</p>
      <h3>Your rights</h3>
      <p>You may request access, correction, or deletion of your data at any time by writing to privacy@mithaas.co.</p>
    </PolicyLayout>
  ),
});