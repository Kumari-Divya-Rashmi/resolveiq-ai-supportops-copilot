import { AlertCircle, FileText, Paperclip, Send, UploadCloud, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../components/PageHeader.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";
import { apiRequest } from "../lib/api.js";

export function NewTicketPage() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: ""
  });

  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function updateForm(name, value) {
    setForm((previous) => ({
      ...previous,
      [name]: value
    }));
  }

  function handleFiles(event) {
    const selectedFiles = Array.from(event.target.files || []).slice(0, 3);
    setFiles(selectedFiles);
  }

  function removeFile(fileToRemove) {
    setFiles((previous) =>
      previous.filter(
        (file) => `${file.name}-${file.size}` !== `${fileToRemove.name}-${fileToRemove.size}`
      )
    );
  }

  async function createTicket(event) {
    event.preventDefault();

    if (!form.title.trim() || !form.description.trim()) {
      setError("Please enter both title and description.");
      return;
    }

    setLoading(true);
    setError("");

    const body = new FormData();
    body.append("title", form.title.trim());
    body.append("description", form.description.trim());

    files.forEach((file) => {
      body.append("attachments", file);
    });

    try {
      const data = await apiRequest("/tickets", {
        method: "POST",
        token,
        body
      });

      navigate(`/app/tickets/${data.ticket._id}`);
    } catch (err) {
      setError(err.message || "Failed to create ticket.");
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

      {error ? (
        <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          {error}
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <form onSubmit={createTicket} className="card p-5 shadow-panel sm:p-6">
          <div className="flex items-start gap-3 border-b border-line pb-5">
            <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-soft text-brand">
              <FileText size={22} />
            </div>

            <div>
              <h2 className="text-base font-bold text-ink">Ticket details</h2>
              <p className="mt-1 text-sm leading-6 text-muted">
                Add a clear title and detailed description so the AI can classify and route your issue accurately.
              </p>
            </div>
          </div>

          <label className="mt-5 block text-sm font-semibold text-ink">
            Title
            <input
              className="input-field mt-2"
              value={form.title}
              onChange={(event) => updateForm("title", event.target.value)}
              placeholder="Short summary of the issue"
              maxLength={160}
            />
          </label>

          <label className="mt-4 block text-sm font-semibold text-ink">
            Description
            <textarea
              className="input-field mt-2 min-h-44 resize-y"
              value={form.description}
              onChange={(event) => updateForm("description", event.target.value)}
              placeholder="Describe what happened, what you expected, and any error message."
              maxLength={6000}
            />
          </label>

          <div className="mt-4">
            <p className="text-sm font-semibold text-ink">Attach screenshot/file</p>

            <label className="mt-2 flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-soft px-4 py-8 text-center transition hover:border-brand hover:bg-panel">
              <UploadCloud size={28} className="text-brand" />
              <span className="mt-3 text-sm font-bold text-ink">
                Click to upload files
              </span>
              <span className="mt-1 text-xs text-muted">
                Up to 3 files. Images, PDF, TXT, or LOG files allowed.
              </span>

              <input
                className="hidden"
                type="file"
                multiple
                accept="image/*,.pdf,.txt,.log"
                onChange={handleFiles}
              />
            </label>

            {files.length ? (
              <div className="mt-3 space-y-2">
                {files.map((file) => (
                  <div
                    key={`${file.name}-${file.size}`}
                    className="flex items-center justify-between gap-3 rounded-xl border border-line bg-panel p-3 text-sm"
                  >
                    <div className="flex min-w-0 items-center gap-2 text-muted">
                      <Paperclip size={16} className="shrink-0" />
                      <span className="truncate">{file.name}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFile(file)}
                      className="focus-ring rounded-lg p-1 text-muted hover:bg-soft hover:text-ink"
                      aria-label={`Remove ${file.name}`}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button disabled={loading} className="btn-primary">
              <Send size={16} />
              {loading ? "Creating..." : "Create ticket"}
            </button>

            <button
              type="button"
              onClick={() => {
                setForm({ title: "", description: "" });
                setFiles([]);
                setError("");
              }}
              className="btn-secondary"
              disabled={loading}
            >
              Clear form
            </button>
          </div>
        </form>

        <aside className="space-y-5">
          <div className="card p-5 shadow-panel">
            <h2 className="text-sm font-bold text-ink">How ResolveIQ handles it</h2>

            <div className="mt-4 space-y-3 text-sm leading-6 text-muted">
              <p>1. AI reads the issue title and description.</p>
              <p>2. It detects category, sentiment, priority, and SLA risk.</p>
              <p>3. It routes the ticket to the correct support team.</p>
              <p>4. Agent receives AI summary and suggested reply.</p>
            </div>
          </div>

          <div className="card p-5 shadow-panel">
            <h2 className="text-sm font-bold text-ink">Writing tips</h2>

            <div className="mt-4 space-y-3 text-sm leading-6 text-muted">
              <p>Use a clear title like “Payment deducted but order failed”.</p>
              <p>Mention what happened, what you expected, and any error message.</p>
              <p>Attach screenshots only if they help explain the issue.</p>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}