import { FilePlus2, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "../components/PageHeader.jsx";
import { StatusBadge } from "../components/StatusBadge.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";
import { apiRequest } from "../lib/api.js";

export function MyTicketsPage() {
  const { token } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadTickets = useCallback(async () => {
    setLoading(true);
    const data = await apiRequest("/tickets", { token });
    setTickets(data.tickets);
    setPagination(data.pagination);
    setLoading(false);
  }, [token]);

  useEffect(() => {
    loadTickets().catch(() => setLoading(false));
  }, [loadTickets]);

  return (
    <>
      <PageHeader
        eyebrow="Tickets"
        title="My Tickets"
        description="Track support cases created by chat or the ticket form."
        action={
          <div className="flex flex-wrap gap-2">
            <Link to="/app/new-ticket" className="focus-ring inline-flex items-center gap-2 rounded-md bg-brand px-3 py-2 text-sm font-semibold text-white">
              <FilePlus2 size={16} />
              New ticket
            </Link>
            <button onClick={loadTickets} className="focus-ring inline-flex items-center gap-2 rounded-md border border-line bg-white px-3 py-2 text-sm">
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>
        }
      />
      <section className="overflow-hidden rounded-lg border border-line bg-white shadow-panel">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-line bg-slate-50 text-xs uppercase text-muted">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Priority</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Updated</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {loading ? (
              <tr><td className="px-4 py-6 text-muted" colSpan="5">Loading tickets...</td></tr>
            ) : tickets.length ? (
              tickets.map((ticket) => (
                <tr key={ticket._id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <Link to={`/app/tickets/${ticket._id}`} className="font-semibold text-brand">{ticket.title}</Link>
                    <p className="mt-1 line-clamp-1 text-xs text-muted">{ticket.aiSummary || ticket.description}</p>
                  </td>
                  <td className="px-4 py-3 capitalize">{ticket.category?.replaceAll("_", " ")}</td>
                  <td className="px-4 py-3"><StatusBadge value={ticket.priority} /></td>
                  <td className="px-4 py-3"><StatusBadge value={ticket.status} /></td>
                  <td className="px-4 py-3 text-muted">{new Date(ticket.updatedAt).toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr><td className="px-4 py-6 text-muted" colSpan="5">No tickets yet.</td></tr>
            )}
          </tbody>
        </table>
      </section>
      {pagination ? (
        <p className="mt-3 text-sm text-muted">
          Showing page {pagination.page} of {pagination.pages} - {pagination.total} total tickets
        </p>
      ) : null}
    </>
  );
}
