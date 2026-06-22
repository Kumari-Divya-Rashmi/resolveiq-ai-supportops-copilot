import { MessageSquare, Star } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PageHeader } from "../components/PageHeader.jsx";
import { StatusBadge } from "../components/StatusBadge.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";
import { apiRequest } from "../lib/api.js";

export function TicketDetailPage() {
  const { id } = useParams();
  const { token, user } = useAuth();
  const [ticket, setTicket] = useState(null);
  const [message, setMessage] = useState("");
  const [feedback, setFeedback] = useState({ rating: 5, comment: "" });
  const [error, setError] = useState("");

  const loadTicket = useCallback(async () => {
    const data = await apiRequest(`/tickets/${id}`, { token });
    setTicket(data.ticket);
  }, [id, token]);

  useEffect(() => {
    loadTicket().catch((err) => setError(err.message));
  }, [loadTicket]);

  async function sendMessage(event) {
    event.preventDefault();
    const data = await apiRequest(`/tickets/${id}/messages`, { method: "POST", token, body: { body: message } });
    setTicket(data.ticket);
    setMessage("");
  }

  async function submitFeedback(event) {
    event.preventDefault();
    await apiRequest(`/tickets/${id}/feedback`, { method: "POST", token, body: feedback });
    setFeedback({ rating: 5, comment: "" });
  }

  if (error) return <p className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>;
  if (!ticket) return <p className="text-sm text-muted">Loading ticket...</p>;

  return (
    <>
      <PageHeader eyebrow="Ticket detail" title={ticket.title} description={ticket.description} />
      <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
        <section className="rounded-lg border border-line bg-white p-5 shadow-panel">
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted">Ticket ID: {ticket._id}</p>
          <div className="flex flex-wrap gap-2">
            <StatusBadge value={ticket.status} />
            <StatusBadge value={ticket.priority} />
            <span className="rounded-full border border-line px-2.5 py-1 text-xs capitalize text-muted">{ticket.category?.replaceAll("_", " ")}</span>
          </div>
          <h2 className="mt-6 flex items-center gap-2 text-sm font-semibold"><MessageSquare size={18} /> Conversation</h2>
          <div className="mt-3 space-y-3">
            {ticket.messages?.map((item) => (
              <div key={item._id} className="rounded-md border border-line bg-slate-50 p-3">
                <p className="text-xs font-semibold uppercase text-muted">{item.role}</p>
                <p className="mt-1 whitespace-pre-wrap text-sm">{item.body}</p>
              </div>
            ))}
          </div>
          <form onSubmit={sendMessage} className="mt-4">
            <textarea className="focus-ring min-h-24 w-full rounded-md border border-line px-3 py-2" value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Add a reply..." />
            <button className="focus-ring mt-3 rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white">Send reply</button>
          </form>
        </section>

        <aside className="space-y-5">
          <section className="rounded-lg border border-line bg-white p-5 shadow-panel">
            <h2 className="text-sm font-semibold">AI copilot</h2>
            <p className="mt-3 text-sm text-muted">Summary</p>
            <p className="mt-1 text-sm">{ticket.aiSummary || "No summary generated yet."}</p>
            <p className="mt-4 text-sm text-muted">Suggested reply</p>
            <p className="mt-1 text-sm">{ticket.aiSuggestedReply || "No reply generated yet."}</p>
            <p className="mt-4 text-sm text-muted">SLA risk</p>
            <StatusBadge value={ticket.slaRisk} />
            {ticket.attachments?.length ? (
              <>
                <p className="mt-4 text-sm text-muted">Attachments</p>
                <div className="mt-2 space-y-2">
                  {ticket.attachments.map((attachment) => (
                    <a key={attachment._id} className="block text-sm font-medium text-brand" href={attachment.path} target="_blank" rel="noreferrer">
                      {attachment.originalName}
                    </a>
                  ))}
                </div>
              </>
            ) : null}
          </section>
          {user.role === "user" ? (
            <form onSubmit={submitFeedback} className="rounded-lg border border-line bg-white p-5 shadow-panel">
              <h2 className="flex items-center gap-2 text-sm font-semibold"><Star size={18} /> Rate support</h2>
              <select className="focus-ring mt-3 w-full rounded-md border border-line px-3 py-2" value={feedback.rating} onChange={(event) => setFeedback({ ...feedback, rating: Number(event.target.value) })}>
                {[5, 4, 3, 2, 1].map((rating) => <option key={rating} value={rating}>{rating} stars</option>)}
              </select>
              <textarea className="focus-ring mt-3 min-h-20 w-full rounded-md border border-line px-3 py-2" value={feedback.comment} onChange={(event) => setFeedback({ ...feedback, comment: event.target.value })} placeholder="Optional comment" />
              <button className="focus-ring mt-3 w-full rounded-md border border-line px-4 py-2 text-sm font-semibold">Submit rating</button>
            </form>
          ) : null}
        </aside>
      </div>
    </>
  );
}
