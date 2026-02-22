"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { api } from "@/lib/api";
import { supabase } from "@/lib/supabase";
import AuthGate from "@/components/AuthGate";

const BUCKETS = [
  { key: "fire",     label: "Fire",         emoji: "🔥", color: "#dc2626", types: ["Fire"] },
  { key: "flood",    label: "Flood",        emoji: "🌊", color: "#2563eb", types: ["Flood"] },
  { key: "storm",    label: "Storm",        emoji: "⛈️", color: "#7c3aed", types: ["Power Outage"] },
  { key: "accident", label: "Accident",     emoji: "🚗", color: "#ea580c", types: ["Accident"] },
  { key: "crime",    label: "Crime",        emoji: "🚨", color: "#0f172a", types: ["Crime"] },
  { key: "other",    label: "Other",        emoji: "⚠️", color: "#64748b", types: ["Other"] },
];

function getBucket(type: string) {
  return BUCKETS.find((b) => b.types.includes(type)) ?? BUCKETS[5];
}

function timeAgo(ts: string) {
  const diff = Date.now() - new Date(ts).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return new Date(ts).toLocaleDateString();
}

export default function IncidentsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [voting, setVoting] = useState<Record<string, boolean>>({});
  const [toast, setToast] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  function fetchReports() {
    api.getReports().then(setReports).catch(console.error);
  }

  useEffect(() => {
    fetchReports();
    const interval = setInterval(fetchReports, 30_000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel("reports-realtime")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "reports" }, fetchReports)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  async function handleUpvote(id: string) {
    setVoting((v) => ({ ...v, [id]: true }));
    try {
      const res = await api.upvoteReport(id);
      setReports((prev) => prev.map((r) => r.id === id ? { ...r, vote_count: res.vote_count } : r));
      showToast(`Voted! ${res.vote_count} vote${res.vote_count !== 1 ? "s" : ""} total`);
    } catch (e: any) {
      showToast(e.message?.includes("409") || e.message?.includes("Already") ? "Already voted on this" : "Failed to vote");
    } finally {
      setVoting((v) => ({ ...v, [id]: false }));
    }
  }

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  }

  const tabs = [
    { key: "all", label: "All", emoji: "📋" },
    ...BUCKETS.map((b) => ({ key: b.key, label: b.label, emoji: b.emoji })),
  ];

  const filtered = activeTab === "all"
    ? reports
    : reports.filter((r) => getBucket(r.type).key === activeTab);

  return (
    <AuthGate>
      {toast && (
        <div style={{
          position: "fixed", top: "1.25rem", right: "1.25rem", zIndex: 9999,
          background: "#0f172a", color: "white",
          padding: "0.875rem 1.25rem", borderRadius: 10,
          boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
          fontSize: "0.875rem", fontWeight: 500,
          borderLeft: "4px solid #dc2626",
        }}>
          ✅ {toast}
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
        <div>
          <h1 style={{ fontSize: "1.625rem", fontWeight: 800, letterSpacing: "-0.03em" }}>Incident Reports</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginTop: "0.2rem" }}>
            {reports.length > 0 ? `${reports.length} incident${reports.length !== 1 ? "s" : ""} reported` : "Loading…"}
          </p>
        </div>
        <button className="btn btn-secondary" style={{ fontSize: "0.8rem" }} onClick={fetchReports}>
          ↻ Refresh
        </button>
      </div>

      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        {tabs.map((t) => {
          const count = t.key === "all"
            ? reports.length
            : reports.filter((r) => getBucket(r.type).key === t.key).length;
          const active = activeTab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              style={{
                padding: "0.4rem 1rem", borderRadius: 9999,
                border: active ? "2px solid #dc2626" : "1.5px solid var(--border)",
                background: active ? "#fee2e2" : "white",
                color: active ? "#991b1b" : "var(--text-muted)",
                fontWeight: 600, fontSize: "0.8rem", cursor: "pointer",
                display: "flex", alignItems: "center", gap: "0.375rem",
              }}
            >
              {t.emoji} {t.label}
              <span style={{
                background: active ? "#dc2626" : "#e2e8f0",
                color: active ? "white" : "var(--text-muted)",
                borderRadius: 9999, padding: "0 6px",
                fontSize: "0.7rem", fontWeight: 700,
              }}>{count}</span>
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📭</span>
          <p style={{ fontWeight: 600, color: "var(--text)", marginBottom: "0.25rem" }}>No incidents here</p>
          <p style={{ fontSize: "0.875rem" }}>Nothing reported in this category yet.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
          {filtered.map((r) => {
            const bucket = getBucket(r.type);
            const votes = r.vote_count ?? 0;
            const isVoting = voting[r.id];
            return (
              <div key={r.id} className="card" style={{ padding: "1.25rem 1.5rem", borderLeft: `4px solid ${bucket.color}` }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem" }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.4rem", flexWrap: "wrap" }}>
                      <span style={{
                        background: bucket.color, color: "white",
                        padding: "2px 10px", borderRadius: 9999,
                        fontSize: "0.72rem", fontWeight: 700,
                        letterSpacing: "0.04em", textTransform: "uppercase",
                      }}>
                        {bucket.emoji} {r.type}
                      </span>
                      <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{timeAgo(r.created_at)}</span>
                    </div>
                    <p style={{ fontWeight: 700, fontSize: "0.9375rem", color: "var(--text)", marginBottom: r.description ? "0.3rem" : 0 }}>
                      {r.title}
                    </p>
                    {r.description && (
                      <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.5 }}>{r.description}</p>
                    )}
                    <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "0.5rem" }}>
                      📍 {Number(r.lat).toFixed(4)}, {Number(r.lng).toFixed(4)}
                    </p>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.25rem", flexShrink: 0 }}>
                    <button
                      onClick={() => handleUpvote(r.id)}
                      disabled={isVoting}
                      style={{
                        width: 48, height: 48, borderRadius: 12,
                        border: `2px solid ${bucket.color}`,
                        background: isVoting ? "#f1f5f9" : "white",
                        color: bucket.color,
                        fontSize: "1.2rem", cursor: isVoting ? "not-allowed" : "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        transition: "all 0.15s",
                      }}
                    >
                      {isVoting ? "…" : "▲"}
                    </button>
                    <span style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text)" }}>{votes}</span>
                    <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>vote{votes !== 1 ? "s" : ""}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AuthGate>
  );
}
