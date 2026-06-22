import { CheckCircle2, Clock3, MessageSquareReply, RefreshCw, UserCheck } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "../components/PageHeader.jsx";
import { StatusBadge } from "../components/StatusBadge.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";
import { apiRequest } from "../lib/api.js";

function getId(value) {
  return value?._id || value || "";
}

export function AgentDashboard() {
  const { token, user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [copilot, setCopilot] = useState(null);
  const [reply, setReply] = useState("");
  const [teams, setTeams] = useState([]);
  const [agents, setAgents] = useState([]);
  const [assignment, setAssignment] = useState({ assignedTeam: "", assignedAgent: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const isAdmin = user?.role === "admin";

  const selectedTicket = useMemo(
    () => tickets.find((ticket) => ticket._id === selectedId) || tickets[0],
    [selectedId, tickets]
  );

  const loadTickets = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await apiRequest("/tickets", { token });
      setTickets(data.tickets);
      setSelectedId((current) => current || data.tickets[0]?._id || "");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const loadCopilot = useCallback(async (ticketId) => {
    if (!ticketId) return;
    try {
      const data = await apiRequest(`/tickets/${ticketId}/copilot`, { token });
      setCopilot(data);
      setReply(data.suggestedReply || "");
    } catch {
      setCopilot(null);
    }
  }, [token]);

  const loadAdminMetadata = useCallback(async () => {
    if (!isAdmin) return;
    const [teamData, agentData] = await Promise.all([
      apiRequest("/teams", { token }),
      apiRequest("/teams/agents", { token })
    ]);
    setTeams(teamData.teams);
    setAgents(agentData.agents);
  }, [isAdmin, token]);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  useEffect(() => {
    loadAdminMetadata().catch((err) => setError(err.message));
  }, [loadAdminMetadata]);

  useEffect(() => {
    loadCopilot(selectedTicket?._id);
  }, [loadCopilot, selectedTicket?._id]);

  useEffect(() => {
    setAssignment({
      assignedTeam: getId(selectedTicket?.assignedTeam),
      assignedAgent: getId(selectedTicket?.assignedAgent)
    });
  }, [selectedTicket]);

  async function updateStatus(status) {
    if (!selectedTicket) return;
    await apiRequest(`/tickets/${selectedTicket._id}/status`, { method: "PATCH", token, body: { status } });
    await loadTickets();
  }

  async function sendReply(event) {
    event.preventDefault();
    if (!selectedTicket || !reply.trim()) return;
    await apiRequest(`/tickets/${selectedTicket._id}/messages`, { method: "POST", token, body: { body: reply } });
    setReply("");
    await loadTickets();
  }

  async function updateAssignment(event) {
    event.preventDefault();
    if (!selectedTicket) return;

    const body = {};
    if (assignment.assignedTeam) body.assignedTeam = assignment.assignedTeam;
    if (assignment.assignedAgent) body.assignedAgent = assignment.assignedAgent;

    await apiRequest(`/tickets/${selectedTicket._id}/assign`, { method: "PATCH", token, body });
    await loadTickets();
  }

  return (
    <>
      <PageHeader
        eyebrow="Agent workspace"
        title="Agent Desk"
        description="Review assigned work, use AI summaries, answer faster, and reduce SLA risk."
        action={
          <button onClick={loadTickets} className="focus-ring inline-flex items-center gap-2 rounded-md border border-line bg-white px-3 py-2 text-sm">
            <RefreshCw size={16} />
            Refresh
          </button>
        }
      />
      {error ? <p className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
      <div className="grid gap-5 xl:grid-cols-[420px_1fr]">
        <section className="rounded-lg border border-line bg-white shadow-panel">
          <div className="border-b border-line px-4 py-3">
            <h2 className="text-sm font-semibold">Assigned queue</h2>
          </div>
          <div className="divide-y divide-line">
            {loading ? (
              <p className="p-4 text-sm text-muted">Loading queue...</p>
            ) : tickets.length ? (
              tickets.map((ticket) => (
                <button
                  key={ticket._id}
                  onClick={() => setSelectedId(ticket._id)}
                  className={`w-full px-4 py-3 text-left hover:bg-slate-50 ${selectedTicket?._id === ticket._id ? "bg-blue-50" : ""}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold">{ticket.title}</p>
                      <p className="mt-1 line-clamp-2 text-xs text-muted">{ticket.aiSummary || ticket.description}</p>
                    </div>
                    <StatusBadge value={ticket.priority} />
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <StatusBadge value={ticket.status} />
                    <StatusBadge value={ticket.slaRisk} />
                  </div>
                </button>
              ))
            ) : (
              <p className="p-4 text-sm text-muted">No assigned tickets.</p>
            )}
          </div>
        </section>

        <section className="rounded-lg border border-line bg-white p-5 shadow-panel">
          {selectedTicket ? (
            <>
              <div className="flex flex-col gap-3 border-b border-line pb-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <h2 className="text-xl font-semibold">{selectedTicket.title}</h2>
                  <p className="mt-1 text-sm text-muted">{selectedTicket.description}</p>
                </div>
                <Link to={`/app/tickets/${selectedTicket._id}`} className="focus-ring rounded-md border border-line px-3 py-2 text-sm font-semibold hover:bg-slate-50">
                  Open detail
                </Link>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-4">
                <div className="rounded-md border border-line p-3">
                  <p className="text-xs text-muted">Status</p>
                  <div className="mt-2"><StatusBadge value={selectedTicket.status} /></div>
                </div>
                <div className="rounded-md border border-line p-3">
                  <p className="text-xs text-muted">Priority</p>
                  <div className="mt-2"><StatusBadge value={selectedTicket.priority} /></div>
                </div>
                <div className="rounded-md border border-line p-3">
                  <p className="text-xs text-muted">SLA risk</p>
                  <div className="mt-2"><StatusBadge value={selectedTicket.slaRisk} /></div>
                </div>
                <div className="rounded-md border border-line p-3">
                  <p className="text-xs text-muted">Sentiment</p>
                  <p className="mt-2 text-sm font-semibold capitalize">{selectedTicket.sentiment?.label}</p>
                </div>
              </div>

              <div className="mt-5 grid gap-5 lg:grid-cols-2">
                <section className="rounded-md border border-line bg-slate-50 p-4">
                  <h3 className="flex items-center gap-2 text-sm font-semibold"><Clock3 size={18} /> AI summary</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-700">{copilot?.summary || selectedTicket.aiSummary || "No summary yet."}</p>
                </section>
                <section className="rounded-md border border-line bg-slate-50 p-4">
                  <h3 className="flex items-center gap-2 text-sm font-semibold"><CheckCircle2 size={18} /> Similar tickets</h3>
                  <div className="mt-2 space-y-2">
                    {copilot?.similarTickets?.length ? (
                      copilot.similarTickets.map((ticket) => (
                        <p key={ticket._id} className="text-sm text-slate-700">{ticket.title}</p>
                      ))
                    ) : (
                      <p className="text-sm text-muted">No similar tickets found.</p>
                    )}
                  </div>
                </section>
              </div>

              {isAdmin ? (
                <form onSubmit={updateAssignment} className="mt-5 rounded-md border border-line bg-white p-4">
                  <h3 className="flex items-center gap-2 text-sm font-semibold"><UserCheck size={18} /> Assignment</h3>
                  <div className="mt-3 grid gap-3 md:grid-cols-2">
                    <label className="block text-sm font-medium">
                      Team
                      <select
                        className="focus-ring mt-1 w-full rounded-md border border-line px-3 py-2"
                        value={assignment.assignedTeam}
                        onChange={(event) => setAssignment({ ...assignment, assignedTeam: event.target.value })}
                      >
                        <option value="">Unassigned team</option>
                        {teams.map((team) => (
                          <option key={team._id} value={team._id}>{team.name}</option>
                        ))}
                      </select>
                    </label>
                    <label className="block text-sm font-medium">
                      Agent
                      <select
                        className="focus-ring mt-1 w-full rounded-md border border-line px-3 py-2"
                        value={assignment.assignedAgent}
                        onChange={(event) => setAssignment({ ...assignment, assignedAgent: event.target.value })}
                      >
                        <option value="">Unassigned agent</option>
                        {agents.map((agent) => (
                          <option key={agent._id} value={agent._id}>{agent.name}</option>
                        ))}
                      </select>
                    </label>
                  </div>
                  <button className="focus-ring mt-3 rounded-md border border-line px-4 py-2 text-sm font-semibold">Update assignment</button>
                </form>
              ) : null}

              <form onSubmit={sendReply} className="mt-5">
                <label className="flex items-center gap-2 text-sm font-semibold"><MessageSquareReply size={18} /> Suggested reply</label>
                <textarea className="focus-ring mt-2 min-h-28 w-full rounded-md border border-line px-3 py-2" value={reply} onChange={(event) => setReply(event.target.value)} />
                <div className="mt-3 flex flex-wrap gap-3">
                  <button className="focus-ring rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white">Send reply</button>
                  <button type="button" onClick={() => updateStatus("in_progress")} className="focus-ring rounded-md border border-line px-4 py-2 text-sm font-semibold">In progress</button>
                  <button type="button" onClick={() => updateStatus("resolved")} className="focus-ring rounded-md border border-line px-4 py-2 text-sm font-semibold">Resolve</button>
                </div>
              </form>
            </>
          ) : (
            <p className="text-sm text-muted">Select a ticket to inspect copilot details.</p>
          )}
        </section>
      </div>
    </>
  );
}
