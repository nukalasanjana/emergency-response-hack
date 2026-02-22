"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import AuthGate from "@/components/AuthGate";

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .getAnalytics()
      .then(setData)
      .catch((e) => setError(e.message));
  }, []);

  return (
    <AuthGate>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1rem" }}>
        📊 Admin Analytics
      </h1>

      {error && (
        <div
          style={{
            background: "#fee2e2",
            color: "#991b1b",
            padding: "0.75rem 1rem",
            borderRadius: 8,
            marginBottom: "1rem",
          }}
        >
          {error}
        </div>
      )}

      {!data && !error && <p>Loading analytics…</p>}

      {data && (
        <>
          {/* Alerts per report */}
          <div className="card">
            <h2 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: "0.75rem" }}>
              Alerts per Report
            </h2>
            {data.alerts_per_report.length === 0 ? (
              <p style={{ color: "#6b7280" }}>No alert data yet.</p>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ textAlign: "left", borderBottom: "2px solid #e5e7eb" }}>
                    <th style={{ padding: "0.5rem" }}>Report</th>
                    <th style={{ padding: "0.5rem" }}>Alert Count</th>
                  </tr>
                </thead>
                <tbody>
                  {data.alerts_per_report.map((r: any) => (
                    <tr key={r.report_id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                      <td style={{ padding: "0.5rem" }}>{r.report_title}</td>
                      <td style={{ padding: "0.5rem" }}>{r.alert_count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Alerted users estimate */}
          <div className="card">
            <h2 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: "0.75rem" }}>
              Estimated Users Alerted per Alert
            </h2>
            {data.alerted_users_estimate.length === 0 ? (
              <p style={{ color: "#6b7280" }}>No alert data yet.</p>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ textAlign: "left", borderBottom: "2px solid #e5e7eb" }}>
                    <th style={{ padding: "0.5rem" }}>Alert ID</th>
                    <th style={{ padding: "0.5rem" }}>Est. Users Alerted</th>
                  </tr>
                </thead>
                <tbody>
                  {data.alerted_users_estimate.map((a: any) => (
                    <tr key={a.alert_id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                      <td style={{ padding: "0.5rem", fontFamily: "monospace", fontSize: "0.8rem" }}>
                        {a.alert_id.slice(0, 8)}…
                      </td>
                      <td style={{ padding: "0.5rem" }}>{a.estimated_users_alerted}</td>
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
