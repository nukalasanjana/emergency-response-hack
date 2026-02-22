"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { api } from "@/lib/api";

export default function AdminAnalyticsPage() {
  const router = useRouter();
  const [authReady, setAuthReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  async function fetchAnalytics() {
    setRefreshing(true);
    try {
      const analytics = await api.getAnalytics();
      setData(analytics);
      setLastUpdated(new Date());
    } catch (e: any) {
      setError(e.message);
    } finally {
      setRefreshing(false);
    }
  }

  // 1. Check session + role, then fetch + subscribe
  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel> | null = null;

    (async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        router.replace("/admin/login");
        return;
      }
      try {
        const profile = await api.getMe();
        if (profile.role !== "admin") {
          setAuthReady(true);
          setIsAdmin(false);
          return;
        }
        setIsAdmin(true);
        setAuthReady(true);

        // 2. Initial fetch
        await fetchAnalytics();

        // 3. Subscribe to report_votes — refresh whenever a vote changes
        channel = supabase
          .channel("analytics-realtime")
          .on("postgres_changes", { event: "INSERT", schema: "public", table: "report_votes" }, () => {
            fetchAnalytics();
          })
          .subscribe();
      } catch (e: any) {
        setError(e.message);
        setAuthReady(true);
      }
    })();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

  // ── Redirecting / loading ────────────────────────────────────
  if (!authReady) {
    return (
      <div style={{ textAlign: "center", padding: "6rem", color: "var(--text-muted)" }}>
        <div style={{
          width: 28, height: 28, border: "3px solid #e2e8f0", borderTopColor: "#dc2626",
          borderRadius: "50%", animation: "spin 0.65s linear infinite",
          margin: "0 auto 0.75rem",
        }} />
        Loading…
      </div>
    );
  }

  // ── Not admin ────────────────────────────────────────────────
  if (!isAdmin) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", maxWidth: 400 }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔒</div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 800 }}>Access Denied</h1>
          <p style={{ color: "var(--text-muted)", marginTop: "0.5rem", fontSize: "0.9rem", lineHeight: 1.6 }}>
            You need an admin account to view this page.
          </p>
          <a href="/admin/login" style={{
            display: "inline-block", marginTop: "1.5rem",
            background: "#dc2626", color: "white",
            padding: "0.75rem 1.5rem", borderRadius: 10,
            fontWeight: 700, fontSize: "0.9rem", textDecoration: "none",
          }}>
            Go to Admin Login
          </a>
        </div>
      </div>
    );
  }

  // Derived stats
  const totalAlerts = data?.alerted_users_estimate?.length ?? 0;
  const totalUsersNotified = data?.alerted_users_estimate?.reduce(
    (sum: number, a: any) => sum + (a.estimated_users_alerted ?? 0), 0
  ) ?? 0;
  const totalEventsWithAlerts = data?.alerts_per_report?.length ?? 0;
  const totalReports = data?.total_reports ?? 0;
  const totalVotes = data?.total_votes ?? 0;
  const voteThreshold = data?.vote_threshold ?? 5;

  return (
    <>
      {/* Header */}
      <div style={{ marginBottom: "1.75rem", display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "0.25rem" }}>
            <span style={{
              background: "#dc2626", color: "white", fontSize: "0.7rem", fontWeight: 700,
              padding: "0.2rem 0.5rem", borderRadius: 6, letterSpacing: "0.05em",
            }}>ADMIN</span>
            <h1 style={{ fontSize: "1.625rem", fontWeight: 800, letterSpacing: "-0.03em" }}>Analytics Dashboard</h1>
          </div>
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
            System-wide incident and alert statistics for emergency responders
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {refreshing && (
            <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontSize: "0.8rem", color: "var(--text-muted)" }}>
              <div style={{
                width: 12, height: 12, border: "2px solid #e2e8f0", borderTopColor: "#dc2626",
                borderRadius: "50%", animation: "spin 0.65s linear infinite", flexShrink: 0,
              }} />
              Updating…
            </div>
          )}
          {lastUpdated && !refreshing && (
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
              Updated {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={fetchAnalytics}
            disabled={refreshing}
            style={{
              fontSize: "0.8rem", padding: "0.375rem 0.75rem", borderRadius: 8,
              border: "1px solid var(--border)", background: "#f8fafc",
              cursor: refreshing ? "not-allowed" : "pointer", color: "var(--text-muted)",
              fontWeight: 500, opacity: refreshing ? 0.6 : 1,
            }}
          >
            ↻ Refresh
          </button>
          <a href="/admin/login" style={{ fontSize: "0.8rem", color: "var(--text-muted)", textDecoration: "none" }}>
            ← Admin Login
          </a>
        </div>
      </div>

      {error && (
        <div style={{
          background: "#fee2e2", color: "#991b1b", padding: "0.875rem 1.25rem",
          borderRadius: 12, marginBottom: "1.25rem", fontSize: "0.9rem",
          display: "flex", alignItems: "center", gap: "0.5rem", border: "1px solid #fecaca",
        }}>⚠️ {error}</div>
      )}

      {!data && !error && (
        <div style={{ textAlign: "center", padding: "4rem", color: "var(--text-muted)" }}>
          <div style={{
            width: 28, height: 28, border: "3px solid #e2e8f0", borderTopColor: "#dc2626",
            borderRadius: "50%", animation: "spin 0.65s linear infinite", margin: "0 auto 0.75rem",
          }} />
          Loading analytics…
        </div>
      )}

      {data && (
        <>
          {/* ── Key stat cards ─────────────────────────────────── */}
          <div className="stats-grid" style={{ marginBottom: "1.5rem" }}>
            <div className="stat-card">
              <div className="stat-label">Users Alerted</div>
              <div className="stat-value">{totalUsersNotified.toLocaleString()}</div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
                community members notified
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Alerts Raised</div>
              <div className="stat-value">{totalAlerts}</div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
                across {totalEventsWithAlerts} event{totalEventsWithAlerts !== 1 ? "s" : ""} (threshold: {voteThreshold} votes)
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Total Reports</div>
              <div className="stat-value">{totalReports}</div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
                incidents submitted
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Total Votes</div>
              <div className="stat-value">{totalVotes}</div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
                community upvotes cast
              </div>
            </div>
          </div>

          {/* ── Alerts raised per event ─────────────────────────── */}
          <div className="card" style={{ overflow: "hidden", padding: 0, marginBottom: "1.5rem" }}>
            <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--border)" }}>
              <h2 style={{ fontSize: "1rem", fontWeight: 700 }}>Alerts Raised per Event</h2>
              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.125rem" }}>
                How many alerts each incident report generated
              </p>
            </div>
            {data.alerts_per_report.length === 0 ? (
              <div className="empty-state" style={{ padding: "2rem" }}>
                <span className="empty-icon" style={{ fontSize: "1.75rem" }}>📋</span>
                <p style={{ fontSize: "0.875rem" }}>No alerts triggered yet.</p>
              </div>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Incident</th>
                    <th style={{ width: 140 }}>Alerts Raised</th>
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
                        }}>{r.alert_count}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* ── Users alerted per alert ─────────────────────────── */}
          <div className="card" style={{ overflow: "hidden", padding: 0 }}>
            <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--border)" }}>
              <h2 style={{ fontSize: "1rem", fontWeight: 700 }}>Users Alerted per Alert</h2>
              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.125rem" }}>
                Estimated number of community members notified per alert
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
                    <th style={{ width: 200 }}>Users Alerted</th>
                  </tr>
                </thead>
                <tbody>
                  {data.alerted_users_estimate.map((a: any) => (
                    <tr key={a.alert_id}>
                      <td style={{ fontFamily: "monospace", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                        {a.alert_id.slice(0, 12)}…
                      </td>
                      <td style={{ fontWeight: 600 }}>
                        {(a.estimated_users_alerted ?? 0).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </>
  );
}