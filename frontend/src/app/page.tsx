"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { api } from "@/lib/api";
import AuthGate from "@/components/AuthGate";

export default function HomePage() {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    api.getMe().then(setProfile).catch(() => {});
  }, []);

  return (
    <AuthGate>
      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 700 }}>🚨 Community Alerts</h1>
        <p style={{ color: "#6b7280", marginTop: "0.5rem" }}>
          Crowdsourced incident reporting with real-time alerts
        </p>

        {profile && (
          <p style={{ marginTop: "1rem" }}>
            Role: <strong>{profile.role}</strong> | Threshold:{" "}
            <strong>{profile.default_threshold}</strong>
          </p>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1rem",
            maxWidth: 500,
            margin: "2rem auto",
          }}
        >
          <a href="/map" className="card btn-primary btn" style={{ justifyContent: "center" }}>
            🗺️ Map
          </a>
          <a href="/alerts" className="card btn-primary btn" style={{ justifyContent: "center" }}>
            🔔 Alerts
          </a>
          <a href="/report" className="card btn-primary btn" style={{ justifyContent: "center" }}>
            📝 Report
          </a>
          <a href="/settings" className="card btn-primary btn" style={{ justifyContent: "center" }}>
            ⚙️ Settings
          </a>
        </div>

        {profile?.role === "admin" && (
          <a href="/admin/analytics" className="btn btn-secondary">
            📊 Admin Analytics
          </a>
        )}
      </div>
    </AuthGate>
  );
}
