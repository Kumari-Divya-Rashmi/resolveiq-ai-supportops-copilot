import {
  Bot,
  BrainCircuit,
  FileText,
  Send,
  ShieldAlert,
  Sparkles,
  TicketPlus,
  UserRound
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../components/PageHeader.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";
import { apiRequest } from "../lib/api.js";

function safeConfidence(value) {
  if (typeof value !== "number") return 0;
  return Math.round(value * 100);
}

function getSourceLabel(source) {
  if (!source) return "Knowledge base";
  if (typeof source === "string") return source;
  return source.title || source.name || source.slug || "Knowledge base";
}

export function ChatPage() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [message, setMessage] = useState("How do I reset my password?");
  const [result, setResult] = useState(null);
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function ask(event) {
    event.preventDefault();

    if (!message.trim()) {
      setError("Please write a support question first.");
      return;
    }

    setLoading(true);
    setError("");

    const userMessage = message.trim();

    try {
      const data = await apiRequest("/chat/ask", {
        method: "POST",
        token,
        body: { message: userMessage }
      });

      setResult(data);

      setConversation((previous) => [
        ...previous,
        { role: "user", text: userMessage },
        { role: "ai", text: data.answer || "No answer generated." }
      ]);
    } catch (err) {
      setError(err.message || "AI request failed.");
    } finally {
      setLoading(false);
    }
  }

  async function createTicket() {
    if (!message.trim()) {
      setError("Please write a support issue before creating a ticket.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await apiRequest("/chat/create-ticket", {
        method: "POST",
        token,
        body: { message }
      });

      navigate(`/app/tickets/${data.ticket._id}`);
    } catch (err) {
      setError(err.message || "Ticket creation failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="User support"
        title="Ask AI Support"
        description="Ask a question. ResolveIQ checks the knowledge base, calculates confidence, and creates a smart ticket when needed."
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <section className="card overflow-hidden shadow-panel">
          <div className="border-b border-line bg-panel px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="grid size-11 place-items-center rounded-2xl bg-soft text-brand">
                <Bot size={22} />
              </div>

              <div>
                <h2 className="text-sm font-bold text-ink">ResolveIQ AI Assistant</h2>
                <p className="text-xs text-muted">
                  Knowledge-base grounded support response
                </p>
              </div>
            </div>
          </div>

          <div className="min-h-[420px] bg-soft p-5">
            {conversation.length === 0 ? (
              <div className="grid min-h-[360px] place-items-center text-center">
                <div>
                  <div className="mx-auto grid size-16 place-items-center rounded-3xl bg-panel text-brand shadow-soft">
                    <Sparkles size={28} />
                  </div>

                  <h3 className="mt-5 text-xl font-bold text-ink">
                    Ask your first support question
                  </h3>

                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">
                    Try asking about password reset, refund policy, shipment tracking,
                    or billing issues.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {conversation.map((item, index) => (
                  <div
                    key={`${item.role}-${index}`}
                    className={`flex gap-3 ${
                      item.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {item.role === "ai" ? (
                      <div className="grid size-9 shrink-0 place-items-center rounded-full bg-brand text-white">
                        <Bot size={17} />
                      </div>
                    ) : null}

                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 shadow-soft ${
                        item.role === "user"
                          ? "bg-brand text-white"
                          : "border border-line bg-panel text-ink"
                      }`}
                    >
                      {item.text}
                    </div>

                    {item.role === "user" ? (
                      <div className="grid size-9 shrink-0 place-items-center rounded-full bg-panel text-brand ring-1 ring-line">
                        <UserRound size={17} />
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            )}

            {loading ? (
              <div className="mt-4 flex items-center gap-3 rounded-2xl border border-line bg-panel p-4 text-sm font-semibold text-muted shadow-soft">
                <div className="size-2 animate-pulse rounded-full bg-brand" />
                ResolveIQ is thinking...
              </div>
            ) : null}
          </div>

          <form onSubmit={ask} className="border-t border-line bg-panel p-4">
            {error ? (
              <p className="mb-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
                {error}
              </p>
            ) : null}

            <label className="block text-sm font-semibold text-ink">
              Support question
              <textarea
                className="input-field mt-2 min-h-28 resize-none"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Example: My payment failed but money was deducted."
              />
            </label>

            <div className="mt-4 flex flex-wrap gap-3">
              <button disabled={loading} className="btn-primary">
                <Send size={16} />
                Ask AI
              </button>

              <button
                type="button"
                onClick={createTicket}
                disabled={loading}
                className="btn-secondary"
              >
                <TicketPlus size={16} />
                Still need help
              </button>
            </div>
          </form>
        </section>

        <aside className="space-y-5">
          <div className="card p-5 shadow-panel">
            <div className="flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-xl bg-soft text-brand">
                <BrainCircuit size={20} />
              </div>

              <div>
                <h2 className="text-sm font-bold text-ink">AI Decision Panel</h2>
                <p className="text-xs text-muted">Live response metadata</p>
              </div>
            </div>

            {result ? (
              <div className="mt-5 space-y-3">
                <div className="rounded-xl border border-line bg-soft p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-muted">
                    Confidence
                  </p>
                  <p className="mt-1 text-3xl font-bold text-ink">
                    {safeConfidence(result.confidence)}%
                  </p>
                </div>

                <div className="rounded-xl border border-line bg-soft p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-muted">
                    Intent
                  </p>
                  <p className="mt-1 text-sm font-bold capitalize text-ink">
                    {result.intent?.intent?.replaceAll("_", " ") || "Support question"}
                  </p>
                </div>

                <div
                  className={`rounded-xl border p-4 ${
                    result.shouldCreateTicket
                      ? "border-orange-200 bg-orange-50 text-orange-800 dark:border-orange-900/60 dark:bg-orange-950/30 dark:text-orange-300"
                      : "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-300"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <ShieldAlert size={17} />
                    <p className="text-sm font-bold">
                      {result.shouldCreateTicket
                        ? "Ticket recommended"
                        : "AI answer is confident"}
                    </p>
                  </div>

                  <p className="mt-2 text-sm leading-6">
                    {result.shouldCreateTicket
                      ? "The system recommends creating a support ticket for agent review."
                      : "The answer appears safe to show from the matched knowledge base."}
                  </p>
                </div>

                {result.shouldCreateTicket ? (
                  <button onClick={createTicket} className="btn-primary w-full">
                    <TicketPlus size={16} />
                    Create ticket
                  </button>
                ) : null}
              </div>
            ) : (
              <p className="mt-5 text-sm leading-6 text-muted">
                Ask a question to see confidence, intent, sources, and ticket
                recommendation.
              </p>
            )}
          </div>

          <div className="card p-5 shadow-panel">
            <div className="flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-xl bg-soft text-brand">
                <FileText size={20} />
              </div>

              <div>
                <h2 className="text-sm font-bold text-ink">Matched sources</h2>
                <p className="text-xs text-muted">Knowledge base articles</p>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              {result?.sources?.length ? (
                result.sources.map((source, index) => (
                  <div
                    key={`${getSourceLabel(source)}-${index}`}
                    className="rounded-xl border border-line bg-soft p-3"
                  >
                    <p className="text-sm font-semibold text-ink">
                      {getSourceLabel(source)}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm leading-6 text-muted">
                  Sources will appear after AI retrieves relevant knowledge base
                  content.
                </p>
              )}
            </div>
          </div>

          <div className="card p-5 shadow-panel">
            <h2 className="text-sm font-bold text-ink">How it works</h2>

            <ol className="mt-3 space-y-3 text-sm leading-6 text-muted">
              <li>1. Message is checked for risky prompt patterns.</li>
              <li>2. Support intent is detected.</li>
              <li>3. Knowledge base articles are retrieved.</li>
              <li>4. AI answers or recommends ticket creation.</li>
            </ol>
          </div>
        </aside>
      </div>
    </>
  );
}