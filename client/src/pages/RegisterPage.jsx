import {
  ArrowRight,
  CheckCircle2,
  LifeBuoy,
  LockKeyhole,
  Sparkles,
  UserPlus,
  Zap
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ThemeToggle } from "../components/ThemeToggle.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";

const highlights = [
  "MERN architecture",
  "JWT authentication",
  "AI/RAG support assistant",
  "Admin and agent dashboards"
];

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user"
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      setError("Please fill all required fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await register(form);
      navigate("/app/chat", { replace: true });
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
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
          <div className="mx-auto w-full max-w-lg lg:order-1">
            <div className="mb-6 flex items-center justify-center lg:hidden">
              <Link to="/" className="inline-flex items-center gap-3">
                <div className="grid size-11 place-items-center rounded-2xl bg-brand text-white">
                  <LifeBuoy size={22} />
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
                  <UserPlus size={23} />
                </div>

                <p className="mt-4 text-xs font-bold uppercase tracking-[0.22em] text-brand">
                  Get started
                </p>

                <h1 className="mt-2 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                  Create your account
                </h1>

                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted">
                  Join ResolveIQ and start managing support conversations.
                </p>
              </div>

              {error ? (
                <p className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
                  {error}
                </p>
              ) : null}

              <form onSubmit={handleSubmit} className="mt-6">
                <label className="block text-sm font-semibold text-ink">
                  Full name
                  <input
                    className="input-field mt-2"
                    value={form.name}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        name: event.target.value
                      })
                    }
                    placeholder="Enter your name"
                    autoComplete="name"
                  />
                </label>

                <label className="mt-4 block text-sm font-semibold text-ink">
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
                    placeholder="Minimum 8 characters"
                    autoComplete="new-password"
                  />
                </label>

                <label className="mt-4 block text-sm font-semibold text-ink">
                  Role
                  <select
                    className="input-field mt-2"
                    value={form.role}
                    onChange={(event) =>
                      setForm({
                        ...form,
                        role: event.target.value
                      })
                    }
                  >
                    <option value="user">Customer / User</option>
                    <option value="agent">Support Agent</option>
                  </select>
                </label>

                <button
                  disabled={loading}
                  className="btn-primary mt-6 w-full rounded-xl py-3"
                >
                  {loading ? "Creating account..." : "Create account"}
                  {!loading ? <ArrowRight size={17} /> : null}
                </button>
              </form>

              <p className="mt-5 text-center text-sm text-muted">
                Already registered?{" "}
                <Link className="font-bold text-brand hover:text-brandDark" to="/login">
                  Sign in
                </Link>
              </p>
            </div>
          </div>

          <div className="hidden lg:order-2 lg:block">
            <div className="rounded-[2rem] border border-line bg-panel p-8 shadow-panel xl:p-10">
              <Link to="/" className="inline-flex items-center gap-3">
                <div className="grid size-12 place-items-center rounded-2xl bg-brand text-white shadow-soft">
                  <LockKeyhole size={23} />
                </div>

                <div>
                  <p className="text-lg font-bold text-ink">ResolveIQ</p>
                  <p className="text-xs font-medium text-muted">SupportOps Copilot</p>
                </div>
              </Link>

              <div className="mt-12">
                <div className="inline-flex items-center gap-2 rounded-full border border-line bg-soft px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-brand">
                  <Sparkles size={14} />
                  Build smarter support
                </div>

                <h2 className="mt-6 max-w-xl text-4xl font-bold leading-tight tracking-tight text-ink xl:text-5xl">
                  Turn customer questions into organized support workflows.
                </h2>

                <p className="mt-5 max-w-xl text-sm leading-7 text-muted xl:text-base">
                  ResolveIQ combines AI answers, smart ticketing, role-based dashboards,
                  and support analytics into one professional support platform.
                </p>
              </div>

              <div className="mt-10 rounded-3xl border border-line bg-soft p-5">
                <div className="flex items-center gap-3">
                  <div className="grid size-12 place-items-center rounded-2xl bg-panel text-brand shadow-soft">
                    <Zap size={22} />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-ink">Project highlights</p>
                    <p className="text-xs text-muted">Features that make this project interview-ready</p>
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
                  ["JWT", "Auth"],
                  ["RAG", "Support"]
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
        </div>
      </section>
    </main>
  );
}