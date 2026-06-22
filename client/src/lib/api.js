const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api";

function buildHeaders(token, isFormData) {
  const headers = {};
  if (!isFormData) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

export async function apiRequest(path, { method = "GET", body, token } = {}) {
  const isFormData = body instanceof FormData;
  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers: buildHeaders(token, isFormData),
    body: isFormData ? body : body ? JSON.stringify(body) : undefined
  });

  const payload = await response.json().catch(() => ({
    success: false,
    error: { message: "Invalid API response" }
  }));

  if (!response.ok || payload.success === false) {
    throw new Error(payload.error?.message || payload.message || "Request failed");
  }

  return payload.data;
}
