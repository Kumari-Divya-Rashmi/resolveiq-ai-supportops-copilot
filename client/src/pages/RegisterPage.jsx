import { LifeBuoy, Sparkles } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";

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
    setLoading(true);
    setError("");

    try {
      await register(form);
      navigate("/app/chat", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen bg-soft lg:grid-cols-[0.9fr_1fr]">
      <section className="grid place-items-center px-5 py-10">
        <form onSubmit={handleSubmit} className="w-full max-w-md rounded-2xl border border-line bg-white p-6 shadow-panel">
          <div className="text-center">
            <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-blue-50 text-brand">
              <LifeBuoy size={24} />
            </div>
            <p className="mt-4 text-sm font-bold uppercase tracking-wide text-brand">Get started</p>
            <h1 className="mt-2 text-3xl font-bold">Create your account</h1>
            <p className="mt-2 text-sm leading-6 text-muted">
              Join ResolveIQ and start managing support conversations.
            </p>
          </div>

          {error ? (
            <p className="mt-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">
              {error}
            </p>
          ) : null}

          <label className="mt-6 block text-sm font-semibold">
            Full name
            <input
              className="input-field mt-2"
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              placeholder="Enter your name"
            />
          </label>

          <label className="mt-4 block text-sm font-semibold">
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
              placeholder="Minimum 8 characters"
            />
          </label>

          <label className="mt-4 block text-sm font-semibold">
            Role
            <select
              className="input-field mt-2"
              value={form.role}
              onChange={(event) => setForm({ ...form, role: event.target.value })}
            >
              <option value="user">Customer / User</option>
              <option value="agent">Support Agent</option>
            </select>
          </label>

          <button disabled={loading} className="btn-primary mt-6 w-full disabled:opacity-60">
            {loading ? "Creating account..." : "Create account"}
          </button>

          <p className="mt-5 text-center text-sm text-muted">
            Already registered?{" "}
            <Link className="font-bold text-brand hover:text-brandDark" to="/login">
              Sign in
            </Link>
          </p>
        </form>
      </section>

      <section className="hidden bg-slate-950 p-10 text-white lg:flex lg:flex-col lg:justify-between">
        <div>
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-xl bg-brand text-white">
              <Sparkles size={22} />
            </div>
            <div>
              <p className="font-bold">ResolveIQ</p>
              <p className="text-xs text-slate-400">SupportOps Copilot</p>
            </div>
          </Link>

          <div className="mt-24 max-w-xl">
            <p className="text-sm font-bold uppercase tracking-wide text-blue-300">
              Build smarter support
            </p>
            <h2 className="mt-4 text-5xl font-bold leading-tight">
              Turn customer questions into organized support workflows.
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-300">
              ResolveIQ combines AI answers, smart ticketing, role-based dashboards, and support analytics.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-sm font-bold">Project highlights</p>
          <div className="mt-4 grid gap-3 text-sm text-slate-300">
            <p>• MERN architecture</p>
            <p>• JWT authentication</p>
            <p>• AI/RAG support assistant</p>
            <p>• Admin and agent dashboards</p>
          </div>
        </div>
      </section>
    </main>
  );
}
