"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import AuthGate from "@/components/AuthGate";

const QUICK_ACTIONS = [
  { href: "/map",      icon: "🗺️", label: "Incidents",     desc: "View all reported incidents on a live map" },
  { href: "/report",   icon: "📝", label: "File a Report", desc: "Submit a new community incident report" },
  { href: "/alerts",   icon: "🔔", label: "Live Alerts",   desc: "Real-time alerts as incidents are confirmed" },
  { href: "/settings", icon: "⚙️", label: "Settings",      desc: "Manage your notification preferences" },
];

export default function HomePage() {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    api.getMe().then(setProfile).catch(() => {});
  }, []);

  return (
    <AuthGate>
      {/* Hero banner */}
      <div style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)",
        borderRadius: 20,
        padding: "2.5rem 2rem",
        marginBottom: "2rem",
        color: "white",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: -40, right: -40,
          width: 200, height: 200,
          background: "rgba(220,38,38,0.15)",
          borderRadius: "50%",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: -60, right: 100,
          width: 140, height: 140,
          background: "rgba(220,38,38,0.08)",
          borderRadius: "50%",
          pointerEvents: "none",
        }} />

        <div style={{ position: "relative" }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "rgba(220,38,38,0.2)",
            border: "1px solid rgba(220,38,38,0.4)",
            color: "#fca5a5",
            padding: "0.3rem 0.875rem",
            borderRadius: 9999,
            fontSize: "0.75rem",
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            marginBottom: "1rem",
          }}>
            <span className="live-dot" /> Live System
          </div>

          <h1 style={{ fontSize: "2.25rem", fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1.1 }}>
            Community<br />
            <span style={{ color: "#fca5a5" }}>Emergency Alerts</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.55)", marginTop: "0.75rem", fontSize: "1rem", maxWidth: 460 }}>
            Crowdsourced incident reporting with real-time community verification and instant alerts.
          </p>

          {profile && (
            <div style={{
              display: "inline-flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "0.75rem",
              marginTop: "1.5rem",
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.1)",
              padding: "0.5rem 1rem",
              borderRadius: 10,
              fontSize: "0.875rem",
              color: "rgba(255,255,255,0.7)",
            }}>
              <span>👤 <strong style={{ color: "white" }}>{profile.role}</strong></span>
              <span style={{ opacity: 0.3 }}>|</span>
              <span>Threshold: <strong style={{ color: "white" }}>{profile.default_threshold} votes</strong></span>
              {profile.role === "admin" && (
                <>
                  <span style={{ opacity: 0.3 }}>|</span>
                  <a href="/admin/analytics" style={{ color: "#fca5a5", fontWeight: 600, textDecoration: "none", fontSize: "0.85rem" }}>
                    📊 View Analytics →
                  </a>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "1rem",
      }}>
        {QUICK_ACTIONS.map(({ href, icon, label, desc }) => (
          <a key={href} href={href} style={{ textDecoration: "none" }}>
            <div
              style={{
                background: "white",
                borderRadius: 16,
                padding: "1.5rem",
                border: "1.5px solid var(--border)",
                boxShadow: "var(--shadow-sm)",
                transition: "all 0.2s ease",
                cursor: "pointer",
                height: "100%",
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = "translateY(-3px)";
                el.style.boxShadow = "0 12px 28px rgba(0,0,0,0.1)";
                el.style.borderColor = "#dc2626";
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = "translateY(0)";
                el.style.boxShadow = "var(--shadow-sm)";
                el.style.borderColor = "var(--border)";
              }}
            >
              <div style={{
                width: 44, height: 44,
                background: "#fee2e2",
                borderRadius: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.25rem",
                marginBottom: "0.875rem",
              }}>{icon}</div>
              <div style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text)", marginBottom: "0.375rem" }}>
                {label}
              </div>
              <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.55 }}>
                {desc}
              </div>
            </div>
          </a>
        ))}
      </div>
    </AuthGate>
  );
}
