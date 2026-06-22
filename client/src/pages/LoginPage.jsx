import {
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
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 px-4 py-6 text-ink">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 shadow-panel backdrop-blur-xl lg:grid-cols-[1fr_0.9fr]">
          <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 p-8 text-white lg:p-10">
            <div className="absolute -left-16 -top-16 size-56 rounded-full bg-white/20 blur-3xl" />
            <div className="absolute -bottom-20 -right-20 size-72 rounded-full bg-cyan-300/20 blur-3xl" />

            <div className="relative z-10 flex h-full flex-col justify-between gap-10">
              <div>
                <Link to="/" className="inline-flex items-center gap-3">
                  <div className="grid size-11 place-items-center rounded-2xl bg-white text-blue-600 shadow-lg">
                    <LockKeyhole size={22} />
                  </div>

                  <div>
                    <p className="text-base font-bold">ResolveIQ</p>
                    <p className="text-xs text-blue-100">AI SupportOps Copilot</p>
                  </div>
                </Link>

                <div className="mt-14 max-w-xl">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-wide text-blue-50">
                    <Sparkles size={14} />
                    Smart support workspace
                  </div>

                  <h1 className="mt-5 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
                    Resolve customer issues faster with AI-assisted support.
                  </h1>

                  <p className="mt-4 max-w-lg text-sm leading-7 text-blue-50/90">
                    Login as user, agent, or admin to test AI answers, ticket creation,
                    routing, analytics, and support workflows.
                  </p>
                </div>
              </div>

              <div className="grid gap-4">
                <div className="rounded-3xl border border-white/20 bg-white/15 p-5 shadow-lg backdrop-blur">
                  <div className="flex items-center gap-3">
                    <div className="grid size-11 place-items-center rounded-2xl bg-white text-indigo-600">
                      <Zap size={21} />
                    </div>

                    <div>
                      <p className="text-sm font-bold">Live SupportOps Flow</p>
                      <p className="text-xs text-blue-100">Question → AI answer → Ticket → Agent</p>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3">
                    {highlights.map((item) => (
                      <div
                        key={item}
                        className="flex items-center gap-3 rounded-2xl bg-white/15 px-4 py-3 text-sm font-semibold"
                      >
                        <CheckCircle2 size={18} className="text-emerald-200" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {[
                    ["AI", "Copilot"],
                    ["3", "Roles"],
                    ["24/7", "Support"]
                  ].map(([value, label]) => (
                    <div
                      key={label}
                      className="rounded-2xl border border-white/20 bg-white/15 p-4 text-center backdrop-blur"
                    >
                      <p className="text-xl font-bold">{value}</p>
                      <p className="mt-1 text-xs text-blue-100">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="flex items-center justify-center px-5 py-8 sm:px-8 lg:px-10">
            <div className="w-full max-w-md">
              <div className="mb-6 text-center lg:hidden">
                <Link to="/" className="inline-flex items-center gap-3">
                  <div className="grid size-11 place-items-center rounded-2xl bg-brand text-white">
                    <LockKeyhole size={22} />
                  </div>
                  <div className="text-left">
                    <p className="font-bold">ResolveIQ</p>
                    <p className="text-xs text-muted">AI SupportOps Copilot</p>
                  </div>
                </Link>
              </div>

              <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.08)] sm:p-7">
                <div className="text-center">
                  <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 text-brand">
                    <LockKeyhole size={23} />
                  </div>

                  <p className="mt-4 text-xs font-bold uppercase tracking-[0.22em] text-brand">
                    Welcome back
                  </p>

                  <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                    Sign in to your account
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-muted">
                    Choose a demo role email and enter your local demo password.
                  </p>
                </div>

                {error ? (
                  <p className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">
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
                            ? "border-blue-500 bg-blue-50 text-blue-700 shadow-soft"
                            : "border-slate-200 bg-slate-50 text-slate-700 hover:border-blue-200 hover:bg-blue-50"
                        }`}
                      >
                        <account.icon size={18} className="mx-auto" />
                        <p className="mt-2 text-sm font-bold">{account.label}</p>
                        <p className="mt-0.5 text-[11px] font-medium text-muted">
                          {account.description}
                        </p>
                      </button>
                    );
                  })}
                </div>

                <form onSubmit={handleSubmit} className="mt-6">
                  <label className="block text-sm font-semibold text-slate-800">
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

                  <label className="mt-4 block text-sm font-semibold text-slate-800">
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
                    className="btn-primary mt-6 w-full rounded-xl py-3 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? "Signing in..." : "Sign in"}
                  </button>
                </form>

                <p className="mt-5 text-center text-sm text-muted">
                  New here?{" "}
                  <Link className="font-bold text-brand hover:text-brandDark" to="/register">
                    Create an account
                  </Link>
                </p>
              </div>

              <p className="mt-5 text-center text-xs leading-5 text-slate-500">
                Demo password is stored locally in{" "}
                <code className="rounded bg-white px-1.5 py-0.5 font-semibold text-slate-700">
                  server/.env
                </code>
                , not inside GitHub.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
