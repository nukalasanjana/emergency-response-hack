import { supabase } from "./supabase";

const API = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

async function authHeaders(): Promise<Record<string, string>> {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) return {};
  return { Authorization: `Bearer ${session.access_token}` };
}

async function apiFetch(path: string, opts: RequestInit = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(await authHeaders()),
    ...(opts.headers || {}),
  };
  const res = await fetch(`${API}${path}`, { ...opts, headers });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${res.status}: ${text}`);
  }
  return res.json();
}

export const api = {
  getMe: () => apiFetch("/me"),
  updateThreshold: (t: number) =>
    apiFetch("/me/threshold", {
      method: "PUT",
      body: JSON.stringify({ default_threshold: t }),
    }),
  getReports: () => apiFetch("/reports"),
  createReport: (data: {
    type: string;
    title: string;
    description: string;
    lat: number;
    lng: number;
    community_id?: string;
  }) => apiFetch("/reports", { method: "POST", body: JSON.stringify(data) }),
  upvoteReport: (id: string) =>
    apiFetch(`/reports/${id}/upvote`, { method: "POST" }),
  removeVote: (id: string) =>
    apiFetch(`/reports/${id}/upvote`, { method: "DELETE" }),
  getMyVotes: () => apiFetch("/me/votes") as Promise<string[]>,
  getAlerts: () => apiFetch("/alerts"),
  getAnalytics: () => apiFetch("/admin/analytics"),
};
