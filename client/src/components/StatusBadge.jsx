import { formatStatusLabel } from "../lib/format.js";

const toneMap = {
  open: "border-blue-200 bg-blue-50 text-blue-700",
  in_progress: "border-amber-200 bg-amber-50 text-amber-700",
  waiting_on_customer: "border-purple-200 bg-purple-50 text-purple-700",
  resolved: "border-emerald-200 bg-emerald-50 text-emerald-700",
  closed: "border-slate-200 bg-slate-100 text-slate-700",

  urgent: "border-red-200 bg-red-50 text-red-700",
  high: "border-orange-200 bg-orange-50 text-orange-700",
  medium: "border-yellow-200 bg-yellow-50 text-yellow-700",
  low: "border-slate-200 bg-slate-100 text-slate-700",

  positive: "border-emerald-200 bg-emerald-50 text-emerald-700",
  neutral: "border-slate-200 bg-slate-100 text-slate-700",
  negative: "border-red-200 bg-red-50 text-red-700",

  billing: "border-blue-200 bg-blue-50 text-blue-700",
  technical: "border-violet-200 bg-violet-50 text-violet-700",
  account: "border-cyan-200 bg-cyan-50 text-cyan-700",
  shipping: "border-teal-200 bg-teal-50 text-teal-700",
  bug: "border-red-200 bg-red-50 text-red-700",
  feature_request: "border-indigo-200 bg-indigo-50 text-indigo-700",
  general: "border-slate-200 bg-slate-100 text-slate-700"
};

export function StatusBadge({ value }) {
  const normalizedValue = value || "unknown";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-bold capitalize ${
        toneMap[normalizedValue] || "border-slate-200 bg-slate-100 text-slate-700"
      }`}
    >
      {formatStatusLabel(normalizedValue)}
    </span>
  );
}