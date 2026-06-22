import { ArrowRight, BarChart3, Bot, Headphones, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

const demoStats = [
  { label: "KB articles", value: "4 seeded" },
  { label: "Teams", value: "3 routed" },
  { label: "Demo roles", value: "User, Agent, Admin" },
  { label: "AI workflow", value: "RAG + ticket copilot" }
];

export function DemoCompanyPage() {
  return (
    <main className="min-h-screen bg-white text-ink">
      <section className="mx-auto max-w-6xl px-5 py-10">
        <div className="flex flex-col gap-4 border-b border-line pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-brand">Sample company</p>
            <h1 className="mt-3 text-4xl font-semibold">ResolveIQ Demo Support Desk</h1>
            <p className="mt-3 max-w-2xl text-slate-600">
              A seeded SaaS support workspace with billing, technical, customer success, knowledge-base, and AI copilot flows.
            </p>
          </div>
          <Link to="/login" className="focus-ring inline-flex items-center gap-2 rounded-md bg-brand px-4 py-2.5 text-sm font-semibold text-white">
            Try demo login <ArrowRight size={16} />
          </Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {demoStats.map((stat) => (
            <div key={stat.label} className="rounded-lg border border-line bg-slate-50 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-muted">{stat.label}</p>
              <p className="mt-2 text-xl font-semibold">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {[
            {
              icon: Bot,
              title: "Customer AI support",
              text: "Ask password, refund, shipment, and outage questions. The answer is grounded in seeded KB articles."
            },
            {
              icon: Headphones,
              title: "Agent copilot queue",
              text: "See priority, sentiment, SLA risk, summary, suggested reply, and similar historical tickets."
            },
            {
              icon: BarChart3,
              title: "Admin operations",
              text: "Monitor volume, response health, sentiment, AI resolution, workload, and knowledge-base health."
            }
          ].map((item) => (
            <article key={item.title} className="rounded-lg border border-line p-5 shadow-panel">
              <div className="grid size-10 place-items-center rounded-md bg-blue-50 text-brand">
                <item.icon size={20} />
              </div>
              <h2 className="mt-4 text-lg font-semibold">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted">{item.text}</p>
            </article>
          ))}
        </div>

        <section className="mt-8 rounded-lg border border-line bg-slate-50 p-5">
          <h2 className="flex items-center gap-2 text-sm font-semibold"><ShieldCheck size={18} /> Seeded demo accounts</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <code className="rounded-md border border-line bg-white p-3 text-sm">admin@resolveiq.test / ResolveIQ#123</code>
            <code className="rounded-md border border-line bg-white p-3 text-sm">agent@resolveiq.test / ResolveIQ#123</code>
            <code className="rounded-md border border-line bg-white p-3 text-sm">user@resolveiq.test / ResolveIQ#123</code>
          </div>
        </section>
      </section>
    </main>
  );
}
