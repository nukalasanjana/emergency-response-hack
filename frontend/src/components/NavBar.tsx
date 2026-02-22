"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

const NAV_LINKS = [
  { href: "/map",      label: "Incidents", icon: "📋" },
  { href: "/report",   label: "Report",   icon: "📝" },
  { href: "/alerts",   label: "Alerts",   icon: "🔔" },
  { href: "/settings", label: "Settings", icon: "⚙️" },
  { href: "/about",    label: "About",    icon: "ℹ️" },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <nav style={{
      background: "#0f172a",
      borderBottom: "1px solid rgba(255,255,255,0.06)",
      position: "sticky",
      top: 0,
      zIndex: 100,
      backdropFilter: "blur(8px)",
    }}>
      <div style={{
        maxWidth: 1100,
        margin: "0 auto",
        padding: "0 1.5rem",
        display: "flex",
        alignItems: "center",
        gap: "0.25rem",
        height: 56,
      }}>
        {/* Brand */}
        <Link href="/" style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          textDecoration: "none",
          marginRight: "1.5rem",
          flexShrink: 0,
        }}>
          <span style={{
            background: "#dc2626",
            color: "white",
            width: 30,
            height: 30,
            borderRadius: 8,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.875rem",
            fontWeight: 700,
            boxShadow: "0 2px 6px rgba(220,38,38,0.5)",
          }}>🚨</span>
          <span style={{
            color: "white",
            fontWeight: 700,
            fontSize: "0.9375rem",
            letterSpacing: "-0.01em",
          }}>Flare</span>
        </Link>

        {/* Nav links */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.125rem" }}>
          {NAV_LINKS.map(({ href, label, icon }) => {
            const active = pathname === href;
            return (
              <Link key={href} href={href} style={{
                display: "flex",
                alignItems: "center",
                gap: "0.375rem",
                padding: "0.375rem 0.75rem",
                borderRadius: 8,
                textDecoration: "none",
                fontSize: "0.875rem",
                fontWeight: active ? 600 : 500,
                color: active ? "white" : "rgba(255,255,255,0.55)",
                background: active ? "rgba(255,255,255,0.1)" : "transparent",
                transition: "all 0.15s",
              }}
              onMouseEnter={e => {
                if (!active) (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.85)";
              }}
              onMouseLeave={e => {
                if (!active) (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.55)";
              }}>
                <span style={{ fontSize: "0.875rem" }}>{icon}</span>
                {label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
