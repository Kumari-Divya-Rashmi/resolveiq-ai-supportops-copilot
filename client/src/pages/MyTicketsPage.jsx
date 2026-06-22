import {
  AlertCircle,
  Clock3,
  FilePlus2,
  Inbox,
  RefreshCw,
  Search,
  SlidersHorizontal,
  TicketCheck,
  X
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "../components/PageHeader.jsx";
import { StatusBadge } from "../components/StatusBadge.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";
import { apiRequest } from "../lib/api.js";

const initialFilters = {
  query: "",
  status: "all",
  priority: "all",
  category: "all",
  slaRisk: "all"
};

function formatDate(value) {
  if (!value) return "Not updated";
  return new Date(value).toLocaleString();
}

function getTicketSummary(ticket) {
  return ticket.aiSummary || ticket.description || "No description available.";
}

function buildTicketQuery(filters) {
  const params = new URLSearchParams();

  if (filters.query.trim()) params.set("q", filters.query.trim());
  if (filters.status !== "all") params.set("status", filters.status);
  if (filters.priority !== "all") params.set("priority", filters.priority);
  if (filters.category !== "all") params.set("category", filters.category);
  if (filters.slaRisk !== "all") params.set("slaRisk", filters.slaRisk);

  params.set("sortBy", "updatedAt");
  params.set("sortOrder", "desc");

  return params.toString();
}

function EmptyState() {
  return (
    <div className="grid min-h-[320px] place-items-center rounded-2xl border border-dashed border-line bg-panel p-8 text-center shadow-soft">
      <div>
        <div className="mx-auto grid size-16 place-items-center rounded-3xl bg-soft text-brand">
          <Inbox size={28} />
        </div>

        <h2 className="mt-5 text-xl font-bold text-ink">No tickets found</h2>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">
          Create your first support ticket or change filters to view existing tickets.
        </p>

        <Link to="/app/new-ticket" className="btn-primary mt-5">
          <FilePlus2 size={16} />
          Create ticket
        </Link>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="grid gap-3">
      {[1, 2, 3, 4].map((item) => (
        <div key={item} className="card p-5">
          <div className="h-4 w-48 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
          <div className="mt-3 h-3 w-full animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
          <div className="mt-2 h-3 w-2/3 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
        </div>
      ))}
    </div>
  );
}

export function MyTicketsPage() {
  const { token } = useAuth();

  const [tickets, setTickets] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState(initialFilters);

  const loadTickets = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const queryString = buildTicketQuery(appliedFilters);
      const data = await apiRequest(`/tickets?${queryString}`, { token });

      setTickets(data.tickets || []);
      setPagination(data.pagination || null);
    } catch (err) {
      setError(err.message || "Failed to load tickets.");
    } finally {
      setLoading(false);
    }
  }, [token, appliedFilters]);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  const stats = useMemo(() => {
    return {
      total: tickets.length,
      open: tickets.filter((ticket) => ticket.status === "open").length,
      urgent: tickets.filter((ticket) => ticket.priority === "urgent").length,
      resolved: tickets.filter((ticket) => ticket.status === "resolved").length
    };
  }, [tickets]);

  const hasActiveFilters = useMemo(() => {
    return Object.keys(appliedFilters).some(
      (key) => appliedFilters[key] !== initialFilters[key]
    );
  }, [appliedFilters]);

  function updateFilter(name, value) {
    setFilters((previous) => ({
      ...previous,
      [name]: value
    }));
  }

  function applyFilters() {
    setAppliedFilters(filters);
  }

  function clearFilters() {
    setFilters(initialFilters);
    setAppliedFilters(initialFilters);
  }

  return (
    <>
      <PageHeader
        eyebrow="Tickets"
        title="My Tickets"
        description="Track your support tickets, AI summaries, priorities, SLA risk, and latest updates."
        action={
          <div className="flex flex-wrap gap-3">
            <Link to="/app/new-ticket" className="btn-primary">
              <FilePlus2 size={16} />
              New ticket
            </Link>

            <button onClick={loadTickets} className="btn-secondary" disabled={loading}>
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>
        }
      />

      {error ? (
        <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          {error}
        </div>
      ) : null}

      <section className="grid gap-4 md:grid-cols-4">
        <div className="card p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-muted">Total tickets</p>
          <p className="mt-2 text-3xl font-bold text-ink">{stats.total}</p>
        </div>

        <div className="card p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-muted">Open</p>
          <p className="mt-2 text-3xl font-bold text-brand">{stats.open}</p>
        </div>

        <div className="card p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-muted">Urgent</p>
          <p className="mt-2 text-3xl font-bold text-red-600 dark:text-red-400">
            {stats.urgent}
          </p>
        </div>

        <div className="card p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-muted">Resolved</p>
          <p className="mt-2 text-3xl font-bold text-emerald-600 dark:text-emerald-400">
            {stats.resolved}
          </p>
        </div>
      </section>

      <section className="card mt-6 p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-bold text-ink">
              <SlidersHorizontal size={17} />
              Filter tickets
            </div>

            <p className="mt-1 text-sm text-muted">
              Search and filter tickets from backend using MongoDB query.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:w-[900px] xl:grid-cols-5">
            <label className="relative md:col-span-2 xl:col-span-1">
              <Search
                size={17}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              />

              <input
                value={filters.query}
                onChange={(event) => updateFilter("query", event.target.value)}
                placeholder="Search tickets..."
                className="input-field pl-10"
              />
            </label>

            <select
              value={filters.status}
              onChange={(event) => updateFilter("status", event.target.value)}
              className="input-field"
            >
              <option value="all">All status</option>
              <option value="open">Open</option>
              <option value="in_progress">In progress</option>
              <option value="waiting_on_customer">Waiting on customer</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>

            <select
              value={filters.priority}
              onChange={(event) => updateFilter("priority", event.target.value)}
              className="input-field"
            >
              <option value="all">All priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>

            <select
              value={filters.category}
              onChange={(event) => updateFilter("category", event.target.value)}
              className="input-field"
            >
              <option value="all">All category</option>
              <option value="billing">Billing</option>
              <option value="technical">Technical</option>
              <option value="account">Account</option>
              <option value="shipping">Shipping</option>
              <option value="bug">Bug</option>
              <option value="feature_request">Feature request</option>
              <option value="general">General</option>
            </select>

            <select
              value={filters.slaRisk}
              onChange={(event) => updateFilter("slaRisk", event.target.value)}
              className="input-field"
            >
              <option value="all">All SLA risk</option>
              <option value="low">Low risk</option>
              <option value="medium">Medium risk</option>
              <option value="high">High risk</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <button onClick={applyFilters} className="btn-primary" disabled={loading}>
            Apply filters
          </button>

          <button onClick={clearFilters} className="btn-secondary" disabled={loading}>
            <X size={16} />
            Clear
          </button>

          {hasActiveFilters ? (
            <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300">
              Filters active
            </span>
          ) : null}
        </div>
      </section>

      <section className="mt-6">
        {loading ? (
          <LoadingState />
        ) : tickets.length ? (
          <div className="grid gap-4">
            {tickets.map((ticket) => (
              <Link
                key={ticket._id}
                to={`/app/tickets/${ticket._id}`}
                className="card group block p-5 transition hover:-translate-y-0.5 hover:shadow-panel"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="grid size-10 place-items-center rounded-xl bg-soft text-brand">
                        <TicketCheck size={19} />
                      </div>

                      <div className="min-w-0">
                        <h2 className="truncate text-base font-bold text-ink group-hover:text-brand">
                          {ticket.title}
                        </h2>

                        <p className="mt-1 flex items-center gap-1 text-xs text-muted">
                          <Clock3 size={13} />
                          Updated {formatDate(ticket.updatedAt)}
                        </p>
                      </div>
                    </div>

                    <p className="mt-4 line-clamp-2 text-sm leading-6 text-muted">
                      {getTicketSummary(ticket)}
                    </p>

                    {ticket.slaDueAt ? (
                      <p className="mt-3 text-xs font-semibold text-muted">
                        SLA due: {formatDate(ticket.slaDueAt)}
                      </p>
                    ) : null}
                  </div>

                  <div className="flex flex-wrap gap-2 lg:justify-end">
                    <StatusBadge value={ticket.category} />
                    <StatusBadge value={ticket.priority} />
                    {ticket.slaRisk ? <StatusBadge value={ticket.slaRisk} /> : null}
                    <StatusBadge value={ticket.status} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState />
        )}

        {pagination ? (
          <div className="mt-5 rounded-xl border border-line bg-panel p-4 text-sm font-semibold text-muted">
            Showing page {pagination.page} of {pagination.pages} — {pagination.total} total tickets
          </div>
        ) : null}
      </section>
    </>
  );
}