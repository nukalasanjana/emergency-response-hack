"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { api } from "@/lib/api";
import AuthGate from "@/components/AuthGate";

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [toasts, setToasts] = useState<string[]>([]);

  // Initial fetch
  useEffect(() => {
    api.getAlerts().then(setAlerts).catch(console.error);
  }, []);

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel("alerts-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "alerts" },
        (payload: any) => {
          const newAlert = payload.new;
          setAlerts((prev) => [newAlert, ...prev]);
          // Show toast
          setToasts((prev) => [...prev, newAlert.message]);
          setTimeout(() => {
            setToasts((prev) => prev.slice(1));
          }, 5000);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <AuthGate>
      {/* Toast container */}
      <div className="toast-container">
        {toasts.map((t, i) => (
          <div key={i} className="toast">
            🔔 {t}
          </div>
        ))}
      </div>

      <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1rem" }}>
        🔔 Alerts
      </h1>

      {alerts.length === 0 && (
        <p style={{ color: "#6b7280" }}>No alerts yet. They will appear here in real-time.</p>
      )}

      {alerts.map((a) => (
        <div key={a.id} className="card">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <strong>{a.type}</strong>
            <span style={{ fontSize: "0.8rem", color: "#6b7280" }}>
              {new Date(a.created_at).toLocaleString()}
            </span>
          </div>
          <p style={{ marginTop: "0.5rem" }}>{a.message}</p>
          <p style={{ fontSize: "0.8rem", color: "#6b7280", marginTop: "0.25rem" }}>
            📍 ({a.lat}, {a.lng}) — Threshold: {a.vote_threshold} — Alerted:{" "}
            {a.alerted_count}
          </p>
        </div>
      ))}
    </AuthGate>
  );
}
