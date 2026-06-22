export function formatStatusLabel(value) {
  return String(value || "unknown").replaceAll("_", " ");
}
