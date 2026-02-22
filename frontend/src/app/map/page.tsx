"use client";

import { useEffect, useState, useRef } from "react";
import { api } from "@/lib/api";
import AuthGate from "@/components/AuthGate";

let L: any = null;

const TYPE_COLORS: Record<string, string> = {
  Fire: "#dc2626", Flood: "#2563eb", Accident: "#ea580c",
  Crime: "#7c3aed", "Power Outage": "#d97706", Other: "#64748b",
};

export default function MapPage() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [reports, setReports] = useState<any[]>([]);
  const [mapInstance, setMapInstance] = useState<any>(null);

  useEffect(() => {
    api.getReports().then(setReports).catch(console.error);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !mapRef.current) return;
    import("leaflet").then((leaflet) => {
      L = leaflet.default;
      if (mapInstance) return;
      const map = L.map(mapRef.current!).setView([35.91, -79.05], 13);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(map);
      setMapInstance(map);
    });
  }, []);

  useEffect(() => {
    if (!mapInstance || !L || reports.length === 0) return;
    reports.forEach((r) => {
      const color = TYPE_COLORS[r.type] ?? "#64748b";
      const icon = L.divIcon({
        className: "",
        html: `<div style="
          width:32px;height:32px;border-radius:50% 50% 50% 0;
          background:${color};border:3px solid white;
          box-shadow:0 2px 8px rgba(0,0,0,0.3);
          transform:rotate(-45deg);
          display:flex;align-items:center;justify-content:center;
        "></div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
      });
      const marker = L.marker([r.lat, r.lng], { icon }).addTo(mapInstance);
      marker.bindPopup(`
        <div style="font-family:system-ui,sans-serif;min-width:180px">
          <div style="display:flex;align-items:center;gap:6px;margin-bottom:6px">
            <span style="background:${color};color:white;padding:2px 8px;border-radius:9999px;font-size:11px;font-weight:700;text-transform:uppercase">${r.type}</span>
          </div>
          <strong style="font-size:14px;display:block;margin-bottom:4px">${r.title}</strong>
          ${r.description ? `<p style="font-size:12px;color:#64748b;margin-bottom:6px">${r.description}</p>` : ""}
          <div style="font-size:12px;color:#64748b;margin-bottom:8px">🗳️ ${r.vote_count ?? 0} vote${(r.vote_count ?? 0) !== 1 ? "s" : ""}</div>
          <button onclick="window.__upvote('${r.id}')"
            style="width:100%;padding:6px 12px;background:#dc2626;color:white;border:none;border-radius:8px;cursor:pointer;font-weight:600;font-size:13px">
            👍 Upvote
          </button>
        </div>
      `);
    });
  }, [mapInstance, reports]);

  useEffect(() => {
    (window as any).__upvote = async (id: string) => {
      try {
        const res = await api.upvoteReport(id);
        const fresh = await api.getReports();
        setReports(fresh);
        alert(`Vote recorded! Total votes: ${res.vote_count}`);
      } catch (e: any) {
        alert(e.message || "Error voting");
      }
    };
    return () => { delete (window as any).__upvote; };
  }, []);

  return (
    <AuthGate>
      <div style={{ marginBottom: "1.75rem" }}>
        <h1 style={{ fontSize: "1.625rem", fontWeight: 800, letterSpacing: "-0.03em" }}>Incident Map</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginTop: "0.25rem" }}>
          {reports.length > 0 ? `${reports.length} incident${reports.length !== 1 ? "s" : ""} reported` : "Loading reports…"}
        </p>
      </div>

      {/* Legend */}
      <div style={{
        display: "flex", flexWrap: "wrap", gap: "0.625rem",
        marginBottom: "1rem",
      }}>
        {Object.entries(TYPE_COLORS).map(([type, color]) => (
          <div key={type} style={{
            display: "flex", alignItems: "center", gap: "0.375rem",
            background: "white", padding: "0.3rem 0.75rem",
            borderRadius: 9999, border: "1px solid var(--border)",
            fontSize: "0.78rem", fontWeight: 600,
          }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: color, display: "inline-block" }} />
            {type}
          </div>
        ))}
      </div>

      <div style={{
        borderRadius: 16,
        overflow: "hidden",
        border: "1px solid var(--border)",
        boxShadow: "var(--shadow)",
      }}>
        <div ref={mapRef} style={{ height: 540 }} />
      </div>
    </AuthGate>
  );
}
