"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { supabase } from "@/lib/supabase";
import AuthGate from "@/components/AuthGate";

export default function SettingsPage() {
  const [threshold, setThreshold] = useState(5);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getMe()
      .then((p) => { setThreshold(p.default_threshold); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    await api.updateThreshold(threshold);
    setSaving(false);
    setSaved(true);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "4rem", color: "var(--text-muted)" }}>
        <div style={{
          width: 28, height: 28,
          border: "3px solid #e2e8f0", borderTopColor: "#dc2626",
          borderRadius: "50%", animation: "spin 0.65s linear infinite",
          margin: "0 auto 0.75rem",
        }} />
        Loading settings…
      </div>
    );
  }

  return (
    <AuthGate>
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        <div style={{ marginBottom: "1.75rem" }}>
          <h1 style={{ fontSize: "1.625rem", fontWeight: 800, letterSpacing: "-0.03em" }}>Settings</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginTop: "0.25rem" }}>
            Manage your notification preferences
          </p>
        </div>

        {/* Notification settings */}
        <div className="card" style={{ marginBottom: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
            <div style={{
              width: 40, height: 40, background: "#fee2e2", borderRadius: 10,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.125rem",
            }}>🔔</div>
            <div>
              <p style={{ fontWeight: 700, fontSize: "0.9375rem" }}>Alert Threshold</p>
              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                Number of community upvotes before you receive an alert
              </p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <input
              type="number"
              min={1}
              max={100}
              value={threshold}
              onChange={(e) => { setThreshold(parseInt(e.target.value) || 1); setSaved(false); }}
              style={{ maxWidth: 120, textAlign: "center", fontWeight: 700, fontSize: "1.125rem" }}
            />
            <button
              className="btn btn-primary"
              onClick={handleSave}
              disabled={saving}
              style={{ minWidth: 100 }}
            >
              {saving ? "Saving…" : "Save"}
            </button>
            {saved && (
              <span style={{
                color: "#059669", fontWeight: 600, fontSize: "0.875rem",
                display: "flex", alignItems: "center", gap: "0.25rem",
              }}>
                ✅ Saved
              </span>
            )}
          </div>

          <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "0.75rem" }}>
            Default is 5 votes. Lower = more alerts, higher = only high-confidence incidents.
          </p>
        </div>

        {/* Account */}
        <div className="card">
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
            <div style={{
              width: 40, height: 40, background: "#fee2e2", borderRadius: 10,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.125rem",
            }}>👤</div>
            <div>
              <p style={{ fontWeight: 700, fontSize: "0.9375rem" }}>Account</p>
              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Sign out of Community Alerts</p>
            </div>
          </div>
          <button className="btn btn-danger" onClick={handleLogout}>
            Sign Out
          </button>
        </div>
      </div>
    </AuthGate>
  );
}
