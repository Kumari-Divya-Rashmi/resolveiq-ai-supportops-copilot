import {
  ArrowRight,
  BarChart3,
  Bot,
  CheckCircle2,
  ClipboardCheck,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
  TicketCheck,
  Zap
} from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    icon: Bot,
    title: "KB-grounded AI answers",
    text: "The AI answers only from support knowledge base and shows confidence before response."
  },
  {
    icon: TicketCheck,
    title: "Smart ticket creation",
    text: "Automatically detects category, sentiment, priority, SLA risk, and routing team."
  },
  {
    icon: ShieldCheck,
    title: "Role-based workspace",
    text: "Separate workflows for customer, support agent, and admin operations."
  }
];

const workflow = [
  "Customer asks a support question",
  "AI searches knowledge base",
  "Answer or ticket is generated",
  "Agent resolves with AI copilot"
];

export function LandingPage() {
  return (
    <main className="min-h-screen bg-soft text-ink">
      <header className="border-b border-line bg-white/80 backdrop-blur">
        <div className="page-container flex h-16 items-center justify-between px-5">
          <Link to="/" className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-xl bg-brand text-white shadow-soft">
              <Zap size={20} />
            </div>
            <div>
              <p className="text-sm font-bold">ResolveIQ</p>
              <p className="text-xs text-muted">SupportOps Copilot</p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link to="/demo" className="hidden text-sm font-semibold text-slate-700 hover:text-brand sm:inline">
              Demo
            </Link>
            <Link to="/login" className="btn-secondary">
              Sign in
            </Link>
          </div>
        </div>
      </header>

      <section className="page-container grid gap-12 px-5 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-20">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-brand">
            <Sparkles size={14} />
            AI-powered customer support
          </div>

          <h1 className="mt-5 max-w-3xl text-4xl font-bold leading-tight tracking-tight md:text-6xl">
            Resolve tickets faster with an AI SupportOps Copilot.
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">
            ResolveIQ helps teams answer customer questions, create smart tickets, route issues,
            monitor SLA risk, and assist agents with AI-generated summaries and replies.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/login" className="btn-primary">
              Open workspace
              <ArrowRight size={17} />
            </Link>
            <Link to="/register" className="btn-secondary">
              Create account
            </Link>
            <Link to="/demo" className="btn-secondary">
              View sample company
            </Link>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              ["AI-first", "Support answers"],
              ["Smart", "Ticket routing"],
              ["Role-based", "Dashboards"]
            ].map(([label, value]) => (
              <div key={label} className="card p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</p>
                <p className="mt-1 text-sm font-bold text-ink">{value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute -right-6 -top-6 hidden size-32 rounded-full bg-blue-200/40 blur-3xl lg:block" />
          <div className="card relative overflow-hidden p-5 shadow-panel">
            <div className="rounded-2xl border border-line bg-slate-950 p-4 text-white">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <p className="text-xs text-slate-400">Live Copilot</p>
                  <p className="text-sm font-semibold">Billing issue detected</p>
                </div>
                <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-semibold text-emerald-300">
                  92% confidence
                </span>
              </div>

              <div className="mt-4 space-y-3">
                <div className="rounded-xl bg-white/10 p-3">
                  <p className="text-xs text-slate-400">Customer</p>
                  <p className="mt-1 text-sm">My payment failed but money was deducted.</p>
                </div>

                <div className="rounded-xl bg-blue-500/20 p-3">
                  <p className="text-xs text-blue-200">AI summary</p>
                  <p className="mt-1 text-sm leading-6">
                    Possible billing failure. Create high-priority ticket and assign to Billing Operations.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  {["Billing", "High", "Negative"].map((item) => (
                    <div key={item} className="rounded-xl bg-white/10 p-3 text-center text-xs font-semibold">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-5 grid gap-3">
              {features.map((item) => (
                <div key={item.title} className="flex gap-3 rounded-xl border border-line bg-white p-4">
                  <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-brand">
                    <item.icon size={20} />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold">{item.title}</h2>
                    <p className="mt-1 text-sm leading-6 text-muted">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="page-container px-5 pb-16">
        <div className="card p-6 shadow-panel">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-brand">Workflow</p>
              <h2 className="mt-2 text-2xl font-bold">How ResolveIQ handles support</h2>
            </div>
            <div className="flex items-center gap-2 text-sm font-semibold text-muted">
              <BarChart3 size={18} />
              Admins track everything in analytics
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-4">
            {workflow.map((step, index) => (
              <div key={step} className="rounded-xl border border-line bg-soft p-4">
                <div className="grid size-9 place-items-center rounded-full bg-brand text-sm font-bold text-white">
                  {index + 1}
                </div>
                <p className="mt-4 text-sm font-bold">{step}</p>
                <p className="mt-2 text-sm leading-6 text-muted">
                  {index === 0 && "User starts with a real support problem."}
                  {index === 1 && "AI finds the most relevant internal articles."}
                  {index === 2 && "Low confidence turns into a smart ticket."}
                  {index === 3 && "Agent gets summary, priority, and suggested reply."}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="page-container px-5 pb-20">
        <div className="rounded-3xl bg-slate-950 p-8 text-white shadow-panel md:p-10">
          <div className="grid gap-8 md:grid-cols-[1fr_0.8fr] md:items-center">
            <div>
              <div className="flex items-center gap-2 text-blue-300">
                <ClipboardCheck size={18} />
                <p className="text-sm font-bold uppercase tracking-wide">Ready for demo</p>
              </div>
              <h2 className="mt-3 text-3xl font-bold">Use demo accounts and test the full workflow.</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
                Login as admin, agent, or user and test chatbot, smart ticketing, assignment, and analytics.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              {["Admin dashboard", "Agent ticket desk", "Customer AI chat"].map((item) => (
                <div key={item} className="flex items-center gap-3 border-b border-white/10 py-3 last:border-0">
                  <CheckCircle2 size={18} className="text-emerald-300" />
                  <p className="text-sm font-semibold">{item}</p>
                </div>
              ))}
              <Link to="/login" className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-slate-950">
                Start now
                <MessageSquareText size={17} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}