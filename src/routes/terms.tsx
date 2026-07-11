import { createFileRoute } from "@tanstack/react-router";
import { PolicyLayout } from "@/components/site/PolicyLayout";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [{ title: "Terms & Conditions — Mithaas" }, { name: "description", content: "The terms that govern your use of Mithaas." }],
    links: [{ rel: "canonical", href: "/terms" }],
  }),
  component: () => (
    <PolicyLayout eyebrow="Legal" title="Terms & Conditions" updated="Updated 1 October 2025">
      <p>By using mithaas.co, you agree to these terms. Please read them carefully.</p>
      <h3>Orders</h3>
      <p>All orders are subject to acceptance and product availability. Prices are inclusive of GST unless stated otherwise.</p>
      <h3>Delivery</h3>
      <p>Estimated delivery windows are indicative; delays due to force majeure events are excluded from our service commitments.</p>
      <h3>Intellectual property</h3>
      <p>All content on this site — including recipes, photography and copy — is owned by Mithaas and may not be reproduced without written consent.</p>
      <h3>Liability</h3>
      <p>Our maximum liability for any claim is limited to the value of the order concerned.</p>
    </PolicyLayout>
  ),
});