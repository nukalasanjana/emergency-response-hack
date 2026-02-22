"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { api } from "@/lib/api";
import AuthGate from "@/components/AuthGate";

const TYPE_ICONS: Record<string, string> = {
  Fire: "🔥", Flood: "🌊", Accident: "🚗",
  Crime: "🚨", "Power Outage": "⚡", Other: "⚠️",
};

function badgeClass(type: string) {
  const m: Record<string, string> = {
    Fire: "badge-fire", Flood: "badge-flood", Accident: "badge-accident",
    Crime: "badge-crime", "Power Outage": "badge-power", Other: "badge-other",
  };
  return m[type] ?? "badge-other";
}

function alertClass(type: string) {
  const m: Record<string, string> = {
    Fire: "alert-fire", Flood: "alert-flood", Accident: "alert-accident",
    Crime: "alert-crime", "Power Outage": "alert-power", Other: "alert-other",
  };
  return m[type] ?? "alert-other";
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

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [toasts, setToasts] = useState<{ id: number; message: string }[]>([]);
  const nextId = useRef(0);
  const alertIdsRef = useRef<Set<string>>(new Set());

  function mergeAlerts(fresh: any[]) {
    setAlerts((prev) => {
      const newOnes = fresh.filter((a) => !alertIdsRef.current.has(a.id));
      newOnes.forEach((a) => {
        alertIdsRef.current.add(a.id);
        const id = ++nextId.current;
        setToasts((t) => [...t, { id, message: a.message }]);
        setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 5000);
      });
      if (newOnes.length === 0) return prev;
      return [...newOnes, ...prev];
    });
  }

  function fetchAlerts() {
    api.getAlerts().then((data) => {
      alertIdsRef.current = new Set(data.map((a: any) => a.id));
      setAlerts(data);
    }).catch(console.error);
  }

  useEffect(() => {
    fetchAlerts();
    // Poll every 30 s as a reliable fallback regardless of realtime status
    const interval = setInterval(() => {
      api.getAlerts().then(mergeAlerts).catch(console.error);
    }, 30_000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel("alerts-realtime")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "alerts" }, (payload: any) => {
        const newAlert = payload.new;
        if (alertIdsRef.current.has(newAlert.id)) return;
        alertIdsRef.current.add(newAlert.id);
        setAlerts((prev) => [newAlert, ...prev]);
        const id = ++nextId.current;
        setToasts((prev) => [...prev, { id, message: newAlert.message }]);
        setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 5000);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  return (
    <AuthGate>
      {/* Toasts */}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className="toast">🔔 {t.message}</div>
        ))}
      </div>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.75rem" }}>
        <div>
          <h1 style={{ fontSize: "1.625rem", fontWeight: 800, letterSpacing: "-0.03em" }}>Live Alerts</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginTop: "0.25rem" }}>
            Triggered when a report reaches its vote threshold
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <button
            className="btn btn-secondary"
            style={{ fontSize: "0.8rem" }}
            onClick={fetchAlerts}
          >
            ↻ Refresh
          </button>
          <div style={{
            display: "flex", alignItems: "center", gap: "0.5rem",
            background: "#dcfce7", color: "#166534",
            padding: "0.4rem 0.875rem", borderRadius: 9999,
            fontSize: "0.8rem", fontWeight: 600,
          }}>
            <span className="live-dot" /> Live
          </div>
        </div>
      </div>

      {alerts.length === 0 && (
        <div className="empty-state">
          <span className="empty-icon">🔕</span>
          <p style={{ fontWeight: 600, color: "var(--text)", marginBottom: "0.25rem" }}>No alerts yet</p>
          <p style={{ fontSize: "0.875rem" }}>Alerts appear here in real-time when incidents are verified by the community.</p>
        </div>
      )}

      {alerts.map((a) => (
        <div key={a.id} className={`card ${alertClass(a.type)}`} style={{ padding: "1.25rem 1.5rem" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div style={{
                width: 40, height: 40, background: "var(--surface-2)", borderRadius: 10,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "1.125rem", flexShrink: 0,
              }}>
                {TYPE_ICONS[a.type] ?? "⚠️"}
              </div>
              <div>
                <span className={`badge ${badgeClass(a.type)}`}>{a.type}</span>
                <p style={{ fontWeight: 600, fontSize: "0.9375rem", marginTop: "0.3rem", color: "var(--text)" }}>
                  {a.message}
                </p>
              </div>
            </div>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", flexShrink: 0, paddingTop: 2 }}>
              {timeAgo(a.created_at)}
            </span>
          </div>

          <div style={{
            display: "flex", flexWrap: "wrap", gap: "1rem",
            marginTop: "0.875rem", paddingTop: "0.875rem",
            borderTop: "1px solid var(--border)",
            fontSize: "0.8rem", color: "var(--text-muted)",
          }}>
            <span>📍 {Number(a.lat).toFixed(4)}, {Number(a.lng).toFixed(4)}</span>
            <span>🗳️ {a.vote_threshold} votes required</span>
            <span>👥 ~{a.alerted_count} notified</span>
          </div>
        </div>
      ))}
    </AuthGate>
  );
}
