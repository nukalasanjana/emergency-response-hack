"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import AuthGate from "@/components/AuthGate";

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.getAnalytics().then(setData).catch((e) => setError(e.message));
  }, []);

  const totalAlerts = data?.alerted_users_estimate?.length ?? 0;
  const totalUsers = data?.alerted_users_estimate?.reduce(
    (sum: number, a: any) => sum + (a.estimated_users_alerted ?? 0), 0
  ) ?? 0;
  const totalReports = data?.alerts_per_report?.length ?? 0;

  return (
    <AuthGate>
      <div style={{ marginBottom: "1.75rem" }}>
        <h1 style={{ fontSize: "1.625rem", fontWeight: 800, letterSpacing: "-0.03em" }}>Admin Analytics</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginTop: "0.25rem" }}>
          System-wide incident and alert statistics
        </p>
      </div>

      {error && (
        <div style={{
          background: "#fee2e2", color: "#991b1b",
          padding: "0.875rem 1.25rem", borderRadius: 12,
          marginBottom: "1.25rem", fontSize: "0.9rem",
          display: "flex", alignItems: "center", gap: "0.5rem",
          border: "1px solid #fecaca",
        }}>
          ⚠️ {error}
        </div>
      )}

      {!data && !error && (
        <div style={{ textAlign: "center", padding: "4rem", color: "var(--text-muted)" }}>
          <div style={{
            width: 28, height: 28,
            border: "3px solid #e2e8f0", borderTopColor: "#dc2626",
            borderRadius: "50%", animation: "spin 0.65s linear infinite",
            margin: "0 auto 0.75rem",
          }} />
          Loading analytics…
        </div>
      )}

      {data && (
        <>
          {/* Summary stats */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-label">Reports w/ Alerts</div>
              <div className="stat-value">{totalReports}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Total Alerts</div>
              <div className="stat-value">{totalAlerts}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Est. Users Notified</div>
              <div className="stat-value">{totalUsers.toLocaleString()}</div>
            </div>
          </div>

          {/* Alerts per report table */}
          <div className="card" style={{ overflow: "hidden", padding: 0 }}>
            <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--border)" }}>
              <h2 style={{ fontSize: "1rem", fontWeight: 700 }}>Alerts per Report</h2>
              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.125rem" }}>
                How many alerts each incident report generated
              </p>
            </div>
            {data.alerts_per_report.length === 0 ? (
              <div className="empty-state" style={{ padding: "2rem" }}>
                <span className="empty-icon" style={{ fontSize: "1.75rem" }}>📋</span>
                <p style={{ fontSize: "0.875rem" }}>No alert data yet.</p>
              </div>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Report</th>
                    <th style={{ width: 140 }}>Alert Count</th>
                  </tr>
                </thead>
                <tbody>
                  {data.alerts_per_report.map((r: any) => (
                    <tr key={r.report_id}>
                      <td style={{ fontWeight: 500 }}>{r.report_title}</td>
                      <td>
                        <span style={{
                          background: "#fee2e2", color: "#991b1b",
                          padding: "0.2rem 0.625rem", borderRadius: 9999,
                          fontSize: "0.8rem", fontWeight: 700,
                        }}>
                          {r.alert_count}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Users alerted per alert table */}
          <div className="card" style={{ overflow: "hidden", padding: 0 }}>
            <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--border)" }}>
              <h2 style={{ fontSize: "1rem", fontWeight: 700 }}>Users Notified per Alert</h2>
              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.125rem" }}>
                Estimated number of community members reached per alert
              </p>
            </div>
            {data.alerted_users_estimate.length === 0 ? (
              <div className="empty-state" style={{ padding: "2rem" }}>
                <span className="empty-icon" style={{ fontSize: "1.75rem" }}>📊</span>
                <p style={{ fontSize: "0.875rem" }}>No alert data yet.</p>
              </div>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Alert ID</th>
                    <th style={{ width: 180 }}>Est. Users Notified</th>
                  </tr>
                </thead>
                <tbody>
                  {data.alerted_users_estimate.map((a: any) => (
                    <tr key={a.alert_id}>
                      <td style={{ fontFamily: "monospace", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                        {a.alert_id.slice(0, 12)}…
                      </td>
                      <td style={{ fontWeight: 600 }}>{a.estimated_users_alerted?.toLocaleString() ?? 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </AuthGate>
  );
}
