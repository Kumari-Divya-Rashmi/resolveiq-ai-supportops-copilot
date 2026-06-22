import { Bot, LockKeyhole, ShieldCheck, UserRoundCog } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";

const demoAccounts = [
  {
    label: "Admin",
    icon: ShieldCheck,
    email: "admin@resolveiq.test",
    password: "ResolveIQ#123"
  },
  {
    label: "Agent",
    icon: UserRoundCog,
    email: "agent@resolveiq.test",
    password: "ResolveIQ#123"
  },
  {
    label: "User",
    icon: Bot,
    email: "user@resolveiq.test",
    password: "ResolveIQ#123"
  }
];

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    email: "admin@resolveiq.test",
    password: "ResolveIQ#123"
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const user = await login(form.email, form.password);
      const fallback =
        user.role === "admin" ? "/app/admin/analytics" : user.role === "agent" ? "/app/agent" : "/app/chat";

      navigate(location.state?.from?.pathname || fallback, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function useDemoAccount(account) {
    setForm({
      email: account.email,
      password: account.password
    });
  }

  return (
    <main className="grid min-h-screen bg-soft lg:grid-cols-[1fr_0.9fr]">
      <section className="hidden bg-slate-950 p-10 text-white lg:flex lg:flex-col lg:justify-between">
        <div>
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-xl bg-brand text-white">
              <LockKeyhole size={22} />
            </div>
            <div>
              <p className="font-bold">ResolveIQ</p>
              <p className="text-xs text-slate-400">AI SupportOps Copilot</p>
            </div>
          </Link>

          <div className="mt-24 max-w-xl">
            <p className="text-sm font-bold uppercase tracking-wide text-blue-300">
              Secure workspace login
            </p>
            <h1 className="mt-4 text-5xl font-bold leading-tight">
              Manage AI answers, smart tickets, and support analytics.
            </h1>
            <p className="mt-5 text-base leading-8 text-slate-300">
              Sign in as admin, agent, or user to test the complete support workflow.
            </p>
          </div>
        </div>

        <div className="grid gap-3">
          {["JWT authentication", "Role-based access", "AI ticket workflow"].map((item) => (
            <div key={item} className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm font-semibold">
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="grid place-items-center px-5 py-10">
        <form onSubmit={handleSubmit} className="w-full max-w-md rounded-2xl border border-line bg-white p-6 shadow-panel">
          <div className="text-center">
            <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-blue-50 text-brand">
              <LockKeyhole size={24} />
            </div>
            <p className="mt-4 text-sm font-bold uppercase tracking-wide text-brand">Welcome back</p>
            <h1 className="mt-2 text-3xl font-bold">Sign in to workspace</h1>
            <p className="mt-2 text-sm text-muted">
              Use demo accounts to test different roles.
            </p>
          </div>

          {error ? (
            <p className="mt-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">
              {error}
            </p>
          ) : null}

          <div className="mt-6 grid gap-2 sm:grid-cols-3">
            {demoAccounts.map((account) => (
              <button
                key={account.label}
                type="button"
                onClick={() => useDemoAccount(account)}
                className="focus-ring rounded-xl border border-line bg-soft px-3 py-3 text-sm font-bold text-slate-700 hover:bg-blue-50 hover:text-brand"
              >
                <account.icon size={17} className="mx-auto mb-1" />
                {account.label}
              </button>
            ))}
          </div>

          <label className="mt-6 block text-sm font-semibold">
            Email
            <input
              className="input-field mt-2"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              placeholder="you@example.com"
            />
          </label>

          <label className="mt-4 block text-sm font-semibold">
            Password
            <input
              className="input-field mt-2"
              type="password"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              placeholder="Enter password"
            />
          </label>

          <button disabled={loading} className="btn-primary mt-6 w-full disabled:opacity-60">
            {loading ? "Signing in..." : "Sign in"}
          </button>

          <p className="mt-5 text-center text-sm text-muted">
            New here?{" "}
            <Link className="font-bold text-brand hover:text-brandDark" to="/register">
              Create an account
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}
