"use client";

import { useMemo } from "react";
import { trackWebEvent } from "../../lib/marketing";

type CampaignMetric = {
  name: string;
  value: number;
};

const metrics: CampaignMetric[] = [
  { name: "Landing views", value: 1284 },
  { name: "Leads", value: 146 },
  { name: "Offer submissions", value: 63 },
  { name: "Cost per lead", value: 22.4 },
];

export default function MarketingDashboardPage() {
  const summary = useMemo(() => {
    const leads = metrics.find((item) => item.name === "Leads")?.value ?? 0;
    const submissions = metrics.find((item) => item.name === "Offer submissions")?.value ?? 0;
    return {
      closeRate: leads > 0 ? Math.round((submissions / leads) * 1000) / 10 : 0,
    };
  }, []);

  return (
    <main style={{ maxWidth: 860, margin: "32px auto", padding: "0 16px" }}>
      <h1>Marketing Dashboard</h1>
      <p>Campaign, attribution, and conversion summary for current acquisition channels.</p>

      <button
        onClick={() =>
          trackWebEvent({
            event: "lead",
            source: "dashboard",
            medium: "manual",
            campaign: "internal_test",
            value: 1,
          })
        }
      >
        Emit test lead event
      </button>

      <section style={{ marginTop: 20, display: "grid", gap: 12 }}>
        {metrics.map((metric) => (
          <article key={metric.name} style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}>
            <strong>{metric.name}</strong>
            <div>{metric.value}</div>
          </article>
        ))}
      </section>

      <p style={{ marginTop: 16 }}>Lead to offer submit rate: {summary.closeRate}%</p>
    </main>
  );
}
