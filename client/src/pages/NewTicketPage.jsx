import { Paperclip, Send } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../components/PageHeader.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";
import { apiRequest } from "../lib/api.js";

export function NewTicketPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", description: "" });
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function createTicket(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const body = new FormData();
    body.append("title", form.title);
    body.append("description", form.description);
    files.forEach((file) => body.append("attachments", file));

    try {
      const data = await apiRequest("/tickets", { method: "POST", token, body });
      navigate(`/app/tickets/${data.ticket._id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Tickets"
        title="Create Ticket"
        description="Submit a support request with optional screenshots or files. ResolveIQ will classify, prioritize, summarize, and route it."
      />
      <form onSubmit={createTicket} className="max-w-3xl rounded-lg border border-line bg-white p-5 shadow-panel">
        {error ? <p className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
        <label className="block text-sm font-medium">
          Title
          <input
            className="focus-ring mt-1 w-full rounded-md border border-line px-3 py-2"
            value={form.title}
            onChange={(event) => setForm({ ...form, title: event.target.value })}
            placeholder="Short summary of the issue"
          />
        </label>
        <label className="mt-4 block text-sm font-medium">
          Description
          <textarea
            className="focus-ring mt-1 min-h-40 w-full rounded-md border border-line px-3 py-2"
            value={form.description}
            onChange={(event) => setForm({ ...form, description: event.target.value })}
            placeholder="Describe what happened, what you expected, and any error message."
          />
        </label>
        <label className="mt-4 block text-sm font-medium">
          Attach screenshot/file
          <input
            className="focus-ring mt-1 w-full rounded-md border border-line px-3 py-2"
            type="file"
            multiple
            accept="image/*,.pdf,.txt,.log"
            onChange={(event) => setFiles(Array.from(event.target.files || []).slice(0, 3))}
          />
        </label>
        {files.length ? (
          <div className="mt-3 space-y-2">
            {files.map((file) => (
              <p key={`${file.name}-${file.size}`} className="flex items-center gap-2 text-sm text-muted">
                <Paperclip size={16} />
                {file.name}
              </p>
            ))}
          </div>
        ) : null}
        <button disabled={loading} className="focus-ring mt-5 inline-flex items-center gap-2 rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
          <Send size={16} />
          {loading ? "Creating..." : "Create ticket"}
        </button>
      </form>
    </>
  );
}
