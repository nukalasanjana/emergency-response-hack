"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { api } from "@/lib/api";
import AuthGate from "@/components/AuthGate";

const TYPE_ICONS: Record<string, string> = {
  Fire: "🔥",
  Flood: "🌊",
  Accident: "🚗",
  Crime: "🚨",
  "Power Outage": "⚡",
  Other: "⚠️",
};

function badgeClass(type: string) {
  const m: Record<string, string> = {
    Fire: "badge-fire",
    Flood: "badge-flood",
    Accident: "badge-accident",
    Crime: "badge-crime",
    "Power Outage": "badge-power",
    Other: "badge-other",
  };
  return m[type] ?? "badge-other";
}

function alertClass(type: string) {
  const m: Record<string, string> = {
    Fire: "alert-fire",
    Flood: "alert-flood",
    Accident: "alert-accident",
    Crime: "alert-crime",
    "Power Outage": "alert-power",
    Other: "alert-other",
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
  const [reports, setReports] = useState<any[]>([]);
  const [toasts, setToasts] = useState<{ id: number; message: string }[]>([]);
  const nextId = useRef(0);

  const [myThreshold, setMyThreshold] = useState<number>(5);
  const notifiedIncidents = useRef<Set<string>>(new Set());

  // Load reports + threshold
  useEffect(() => {
    api.getReports().then(setReports).catch(console.error);

    api
      .getMe()
      .then((me) => setMyThreshold(me.default_threshold ?? 5))
      .catch(() => setMyThreshold(5));
  }, []);

  // Reset notification memory when threshold changes
  useEffect(() => {
    notifiedIncidents.current = new Set();
  }, [myThreshold]);

  // Realtime: new reports
  useEffect(() => {
    const channel = supabase
      .channel("reports-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "reports" },
        (payload: any) => {
          const newReport = payload.new;
          setReports((prev) => {
            if (prev.some((r) => r.id === newReport.id)) return prev;
            return [{ ...newReport, vote_count: 0 }, ...prev];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Realtime: per-user threshold (report_votes insert crosses myThreshold)
  useEffect(() => {
    const channel = supabase
      .channel("report-votes-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "report_votes" },
        (payload: any) => {
          const reportId = payload.new?.report_id as string | undefined;
          if (!reportId) return;

          let found = false;

          setReports((prev) => {
            const next = prev.map((r) => {
              if (r.id !== reportId) return r;
              found = true;
              const oldCount = r.vote_count ?? 0;
              const newCount = oldCount + 1;

              if (oldCount < myThreshold && newCount >= myThreshold) {
                if (!notifiedIncidents.current.has(reportId)) {
                  notifiedIncidents.current.add(reportId);
                  const title = r.title ?? "Incident";
                  const id = ++nextId.current;
                  setToasts((prevToasts) => [
                    ...prevToasts,
                    { id, message: `"${title}" reached your threshold (${myThreshold})` },
                  ]);
                  setTimeout(() => setToasts((prevToasts) => prevToasts.filter((t) => t.id !== id)), 5000);
                }
              }

              return { ...r, vote_count: newCount };
            });

            return found ? next : prev;
          });

          if (!found) {
            api.getReports().then(setReports).catch(console.error);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [myThreshold]);

  const alertReports = reports
    .filter((r) => (r.vote_count ?? 0) >= myThreshold)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return (
    <AuthGate>
      {/* Toasts */}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className="toast">
            🔔 {t.message}
          </div>
        ))}
      </div>

      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1.75rem",
        }}
      >
        <div>
          <h1 style={{ fontSize: "1.625rem", fontWeight: 800, letterSpacing: "-0.03em" }}>Live Alerts</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginTop: "0.25rem" }}>
            Triggered when a report reaches its vote threshold
          </p>
          <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginTop: "0.25rem" }}>
            Your threshold: <b>{myThreshold}</b>
          </p>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "#dcfce7",
            color: "#166534",
            padding: "0.4rem 0.875rem",
            borderRadius: 9999,
            fontSize: "0.8rem",
            fontWeight: 600,
          }}
        >
          <span className="live-dot" /> Live
        </div>
      </div>

      {alertReports.length === 0 && (
        <div className="empty-state">
          <span className="empty-icon">🔕</span>
          <p style={{ fontWeight: 600, color: "var(--text)", marginBottom: "0.25rem" }}>No alerts yet</p>
          <p style={{ fontSize: "0.875rem" }}>
            Alerts appear here in real-time when incidents are verified by the community.
          </p>
        </div>
      )}

      {alertReports.map((a) => (
        <div key={a.id} className={`card ${alertClass(a.type)}`} style={{ padding: "1.25rem 1.5rem" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  background: "var(--surface-2)",
                  borderRadius: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.125rem",
                  flexShrink: 0,
                }}
              >
                {TYPE_ICONS[a.type] ?? "⚠️"}
              </div>

              <div>
                <span className={`badge ${badgeClass(a.type)}`}>{a.type}</span>
                <p style={{ fontWeight: 600, fontSize: "0.9375rem", marginTop: "0.3rem", color: "var(--text)" }}>
                  {a.title}
                </p>
              </div>
            </div>

            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", flexShrink: 0, paddingTop: 2 }}>
              {timeAgo(a.created_at)}
            </span>
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "1rem",
              marginTop: "0.875rem",
              paddingTop: "0.875rem",
              borderTop: "1px solid var(--border)",
              fontSize: "0.8rem",
              color: "var(--text-muted)",
            }}
          >
            <div>
              📍 {Number(a.lat).toFixed(4)}, {Number(a.lng).toFixed(4)}
            </div>
            <div>🎯 Threshold {myThreshold}</div>
          </div>
        </div>
      ))}
    </AuthGate>
  );
}
