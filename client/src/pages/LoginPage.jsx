
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  UserRoundCog,
  Zap
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ThemeToggle } from "../components/ThemeToggle.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";

const demoAccounts = [
  {
    label: "Admin",
    description: "Analytics + control",
    icon: ShieldCheck,
    email: "admin@resolveiq.test"
  },
  {
    label: "Agent",
    description: "Resolve tickets",
    icon: UserRoundCog,
    email: "agent@resolveiq.test"
  },
  {
    label: "User",
    description: "Ask AI support",
    icon: Bot,
    email: "user@resolveiq.test"
  }
];

const highlights = [
  "AI-powered support replies",
  "Smart ticket routing",
  "Role-based dashboards"
];

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedRole, setSelectedRole] = useState("Admin");

  const [form, setForm] = useState({
    email: "admin@resolveiq.test",
    password: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.email.trim() || !form.password.trim()) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const user = await login(form.email, form.password);

      const fallback =
        user.role === "admin"
          ? "/app/admin/analytics"
          : user.role === "agent"
            ? "/app/agent"
            : "/app/chat";

      navigate(location.state?.from?.pathname || fallback, { replace: true });
    } catch (err) {
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  }

  function useDemoAccount(account) {
    setSelectedRole(account.label);
    setForm({
      email: account.email,
      password: ""
    });
    setError("");
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-soft text-ink transition-colors">
      <div className="fixed right-4 top-4 z-30 sm:right-6 sm:top-6">
        <ThemeToggle compact />
      </div>

      <section className="relative min-h-screen px-4 py-6 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-[-8rem] top-[-8rem] size-80 rounded-full bg-blue-500/20 blur-3xl dark:bg-blue-400/10" />
          <div className="absolute bottom-[-10rem] right-[-8rem] size-96 rounded-full bg-indigo-500/20 blur-3xl dark:bg-indigo-400/10" />
        </div>

        <div className="relative mx-auto grid min-h-[calc(100vh-3rem)] max-w-6xl items-center gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="hidden lg:block">
            <div className="rounded-[2rem] border border-line bg-panel p-8 shadow-panel xl:p-10">
              <Link to="/" className="inline-flex items-center gap-3">
                <div className="grid size-12 place-items-center rounded-2xl bg-brand text-white shadow-soft">
                  <LockKeyhole size={23} />
                </div>

                <div>
                  <p className="text-lg font-bold text-ink">ResolveIQ</p>
                  <p className="text-xs font-medium text-muted">AI SupportOps Copilot</p>
                </div>
              </Link>

              <div className="mt-12">
                <div className="inline-flex items-center gap-2 rounded-full border border-line bg-soft px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-brand">
                  <Sparkles size={14} />
                  Smart support workspace
                </div>

                <h1 className="mt-6 max-w-xl text-4xl font-bold leading-tight tracking-tight text-ink xl:text-5xl">
                  Resolve customer issues faster with AI-assisted support.
                </h1>

                <p className="mt-5 max-w-xl text-sm leading-7 text-muted xl:text-base">
                  Login as user, agent, or admin to test AI answers, ticket creation,
                  routing, analytics, and complete support workflows.
                </p>
              </div>

              <div className="mt-10 rounded-3xl border border-line bg-soft p-5">
                <div className="flex items-center gap-3">
                  <div className="grid size-12 place-items-center rounded-2xl bg-panel text-brand shadow-soft">
                    <Zap size={22} />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-ink">Live SupportOps Flow</p>
                    <p className="text-xs text-muted">Question → AI answer → Ticket → Agent</p>
                  </div>
                </div>

                <div className="mt-5 grid gap-3">
                  {highlights.map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 rounded-2xl border border-line bg-panel px-4 py-3 text-sm font-semibold text-ink"
                    >
                      <CheckCircle2 size={18} className="text-emerald-500" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3">
                {[
                  ["AI", "Copilot"],
                  ["3", "Roles"],
                  ["24/7", "Support"]
                ].map(([value, label]) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-line bg-soft p-4 text-center"
                  >
                    <p className="text-2xl font-bold text-ink">{value}</p>
                    <p className="mt-1 text-xs font-medium text-muted">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mx-auto w-full max-w-lg">
            <div className="mb-6 flex items-center justify-center lg:hidden">
              <Link to="/" className="inline-flex items-center gap-3">
                <div className="grid size-11 place-items-center rounded-2xl bg-brand text-white">
                  <LockKeyhole size={22} />
                </div>

                <div>
                  <p className="font-bold text-ink">ResolveIQ</p>
                  <p className="text-xs text-muted">AI SupportOps Copilot</p>
                </div>
              </Link>
            </div>

            <div className="rounded-[2rem] border border-line bg-panel p-5 shadow-panel transition-colors sm:p-7">
              <div className="text-center">
                <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-soft text-brand">
                  <LockKeyhole size={23} />
                </div>

                <p className="mt-4 text-xs font-bold uppercase tracking-[0.22em] text-brand">
                  Welcome back
                </p>

                <h2 className="mt-2 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                  Sign in to ResolveIQ
                </h2>

                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted">
                  Choose a demo role email and enter your local demo password.
                </p>
              </div>

              {error ? (
                <p className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
                  {error}
                </p>
              ) : null}

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {demoAccounts.map((account) => {
                  const isActive = selectedRole === account.label;

                  return (
                    <button
                      key={account.label}
                      type="button"
                      onClick={() => useDemoAccount(account)}
                      className={`focus-ring rounded-2xl border p-3 text-center transition ${
                        isActive
                          ? "border-brand bg-blue-50 text-brand shadow-soft dark:bg-blue-950/40"
                          : "border-line bg-soft text-muted hover:border-brand hover:bg-blue-50 hover:text-brand dark:hover:bg-blue-950/30"
                      }`}
                    >
                      <account.icon size={18} className="mx-auto" />
                      <p className="mt-2 text-sm font-bold">{account.label}</p>
                      <p className="mt-0.5 text-[11px] font-medium opacity-80">
                        {account.description}
                      </p>
                    </button>
                  );
                })}
              </div>

              <form onSubmit={handleSubmit} className="mt-6">
                <label className="block text-sm font-semibold text-ink">
                  Email address
                  <input
                    className="input-field mt-2"
                    type="email"
                    value={form.email}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        email: event.target.value
                      })
                    }
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                </label>

                <label className="mt-4 block text-sm font-semibold text-ink">
                  Password
                  <input
                    className="input-field mt-2"
                    type="password"
                    value={form.password}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        password: event.target.value
                      })
                    }
                    placeholder="Enter local demo password"
                    autoComplete="current-password"
                  />
                </label>

                <button
                  disabled={loading}
                  className="btn-primary mt-6 w-full rounded-xl py-3"
                >
                  {loading ? "Signing in..." : "Sign in"}
                  {!loading ? <ArrowRight size={17} /> : null}
                </button>
              </form>

              <p className="mt-5 text-center text-sm text-muted">
                New here?{" "}
                <Link className="font-bold text-brand hover:text-brandDark" to="/register">
                  Create an account
                </Link>
              </p>
            </div>

            <p className="mx-auto mt-5 max-w-md text-center text-xs leading-5 text-muted">
              Demo password is stored locally in{" "}
              <code className="rounded border border-line bg-panel px-1.5 py-0.5 font-semibold text-ink">
                server/.env
              </code>
              , not inside GitHub.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
