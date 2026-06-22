export function MetricCard({ label, value, helper }) {
  return (
    <div className="rounded-lg border border-line bg-white p-4 shadow-panel">
      <p className="text-xs font-medium uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-ink">{value}</p>
      {helper ? <p className="mt-1 text-xs text-muted">{helper}</p> : null}
    </div>
  );
}
