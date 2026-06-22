import { BarChart3, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { MetricCard } from "../components/MetricCard.jsx";
import { PageHeader } from "../components/PageHeader.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";
import { apiRequest } from "../lib/api.js";

const palette = ["#2563EB", "#0F766E", "#D97706", "#DC2626", "#7C3AED", "#475569"];

function normalizeGroup(items = []) {
  return items.map((item) => ({
    name: String(item._id || "unknown").replaceAll("_", " "),
    count: item.count
  }));
}

export function AnalyticsPage() {
  const { token } = useAuth();
  const [overview, setOverview] = useState(null);
  const [groups, setGroups] = useState(null);
  const [performance, setPerformance] = useState([]);
  const [error, setError] = useState("");

  const loadAnalytics = useCallback(async () => {
    setError("");
    try {
      const [overviewData, groupData, performanceData] = await Promise.all([
        apiRequest("/analytics/overview", { token }),
        apiRequest("/analytics/category-wise", { token }),
        apiRequest("/analytics/agent-performance", { token })
      ]);
      setOverview(overviewData);
      setGroups(groupData);
      setPerformance(performanceData.performance);
    } catch (err) {
      setError(err.message);
    }
  }, [token]);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  const categoryData = normalizeGroup(groups?.categories);
  const sentimentData = normalizeGroup(groups?.sentiments);
  const resolutionData = overview
    ? [
        { name: "AI resolved", count: overview.aiResolved },
        { name: "Human resolved", count: overview.humanResolved }
      ]
    : [];

  return (
    <>
      <PageHeader
        eyebrow="Admin"
        title="Analytics"
        description="Operational visibility across ticket volume, sentiment, response health, AI resolution, and agent workload."
        action={
          <button onClick={loadAnalytics} className="focus-ring inline-flex items-center gap-2 rounded-md border border-line bg-white px-3 py-2 text-sm">
            <RefreshCw size={16} />
            Refresh
          </button>
        }
      />
      {error ? <p className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-7">
        <MetricCard label="Total tickets" value={overview?.totalTickets ?? "..."} />
        <MetricCard label="Open tickets" value={overview?.openTickets ?? "..."} />
        <MetricCard label="Resolved" value={overview?.resolvedTickets ?? "..."} />
        <MetricCard label="High priority" value={overview?.highPriorityTickets ?? "..."} />
        <MetricCard label="Avg response" value={`${Number(overview?.averageResponseTimeHours ?? 0).toFixed(1)}h`} />
        <MetricCard label="Avg rating" value={Number(overview?.averageRating ?? 0).toFixed(1)} />
        <MetricCard label="KB health" value={`${overview?.knowledgeBaseHealthScore ?? 0}%`} helper="Based on article coverage" />
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-2">
        <div className="rounded-lg border border-line bg-white p-5 shadow-panel">
          <h2 className="flex items-center gap-2 text-sm font-semibold"><BarChart3 size={18} /> Ticket volume by category</h2>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#2563EB" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-lg border border-line bg-white p-5 shadow-panel">
          <h2 className="text-sm font-semibold">Sentiment distribution</h2>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={sentimentData} dataKey="count" nameKey="name" innerRadius={60} outerRadius={96} paddingAngle={3}>
                  {sentimentData.map((entry, index) => (
                    <Cell key={entry.name} fill={palette[index % palette.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-lg border border-line bg-white p-5 shadow-panel">
          <h2 className="text-sm font-semibold">AI resolved vs human resolved</h2>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={resolutionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#0F766E" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-lg border border-line bg-white p-5 shadow-panel">
          <h2 className="text-sm font-semibold">Agent workload</h2>
          <div className="mt-4 space-y-3">
            {performance.length ? (
              performance.map((item) => (
                <div key={item.agent._id} className="rounded-md border border-line p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold">{item.agent.name}</p>
                      <p className="text-xs text-muted">{item.agent.email}</p>
                    </div>
                    <p className="text-sm font-semibold">{item.open} open</p>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-slate-100">
                    <div className="h-2 rounded-full bg-brand" style={{ width: `${Math.min(100, item.assigned * 20)}%` }} />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted">No agent workload yet.</p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
