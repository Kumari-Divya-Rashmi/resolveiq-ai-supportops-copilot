import { BookOpen, Trash2, Upload } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { PageHeader } from "../components/PageHeader.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";
import { apiRequest } from "../lib/api.js";

export function KnowledgeBasePage() {
  const { token } = useAuth();
  const [articles, setArticles] = useState([]);
  const [form, setForm] = useState({ title: "", sourceType: "manual", tags: "", content: "" });
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  const loadArticles = useCallback(async () => {
    try {
      const data = await apiRequest("/kb", { token });
      setArticles(data.articles);
    } catch (err) {
      setError(err.message);
    }
  }, [token]);

  useEffect(() => {
    loadArticles();
  }, [loadArticles]);

  async function uploadArticle(event) {
    event.preventDefault();
    setError("");
    const body = new FormData();
    body.append("title", form.title);
    body.append("sourceType", form.sourceType);
    body.append("tags", form.tags);
    if (form.content) body.append("content", form.content);
    if (file) body.append("file", file);

    try {
      await apiRequest("/kb/upload", { method: "POST", token, body });
      setForm({ title: "", sourceType: "manual", tags: "", content: "" });
      setFile(null);
      await loadArticles();
    } catch (err) {
      setError(err.message);
    }
  }

  async function deleteArticle(id) {
    await apiRequest(`/kb/${id}`, { method: "DELETE", token });
    await loadArticles();
  }

  return (
    <>
      <PageHeader eyebrow="Admin" title="Knowledge Base" description="Upload support policies, FAQs, and runbooks that power grounded AI answers." />
      {error ? <p className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
      <div className="grid gap-5 xl:grid-cols-[420px_1fr]">
        <form onSubmit={uploadArticle} className="rounded-lg border border-line bg-white p-5 shadow-panel">
          <h2 className="flex items-center gap-2 text-sm font-semibold"><Upload size={18} /> Add article</h2>
          <label className="mt-4 block text-sm font-medium">
            Title
            <input className="focus-ring mt-1 w-full rounded-md border border-line px-3 py-2" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
          </label>
          <label className="mt-4 block text-sm font-medium">
            Type
            <select className="focus-ring mt-1 w-full rounded-md border border-line px-3 py-2" value={form.sourceType} onChange={(event) => setForm({ ...form, sourceType: event.target.value })}>
              <option value="manual">Manual</option>
              <option value="faq">FAQ</option>
              <option value="policy">Policy</option>
              <option value="runbook">Runbook</option>
              <option value="upload">Upload</option>
            </select>
          </label>
          <label className="mt-4 block text-sm font-medium">
            Tags
            <input className="focus-ring mt-1 w-full rounded-md border border-line px-3 py-2" value={form.tags} onChange={(event) => setForm({ ...form, tags: event.target.value })} placeholder="billing, refund" />
          </label>
          <label className="mt-4 block text-sm font-medium">
            Content
            <textarea className="focus-ring mt-1 min-h-36 w-full rounded-md border border-line px-3 py-2" value={form.content} onChange={(event) => setForm({ ...form, content: event.target.value })} />
          </label>
          <label className="mt-4 block text-sm font-medium">
            Text file
            <input className="focus-ring mt-1 w-full rounded-md border border-line px-3 py-2" type="file" accept=".txt,.md,.json" onChange={(event) => setFile(event.target.files?.[0] || null)} />
          </label>
          <button className="focus-ring mt-5 inline-flex items-center gap-2 rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white">
            <Upload size={16} />
            Upload
          </button>
        </form>

        <section className="rounded-lg border border-line bg-white shadow-panel">
          <div className="flex items-center gap-2 border-b border-line px-5 py-4">
            <BookOpen size={18} />
            <h2 className="text-sm font-semibold">Articles</h2>
          </div>
          <div className="divide-y divide-line">
            {articles.length ? (
              articles.map((article) => (
                <article key={article._id} className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-semibold">{article.title}</h3>
                      <p className="mt-1 line-clamp-2 text-sm text-muted">{article.content}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className="rounded-full border border-line px-2.5 py-1 text-xs capitalize text-muted">{article.sourceType}</span>
                        {article.tags?.map((tag) => (
                          <span key={tag} className="rounded-full bg-blue-50 px-2.5 py-1 text-xs text-brand">{tag}</span>
                        ))}
                      </div>
                    </div>
                    <button onClick={() => deleteArticle(article._id)} className="focus-ring grid size-9 shrink-0 place-items-center rounded-md border border-line hover:bg-red-50 hover:text-red-700" aria-label={`Delete ${article.title}`}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </article>
              ))
            ) : (
              <p className="p-5 text-sm text-muted">No articles yet.</p>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
