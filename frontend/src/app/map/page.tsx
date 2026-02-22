"use client";

import { useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";
import AuthGate from "@/components/AuthGate";

const TYPE_COLORS: Record<string, string> = {
  Fire: "#dc2626",
  Flood: "#2563eb",
  Accident: "#ea580c",
  Crime: "#7c3aed",
  "Power Outage": "#d97706",
  Other: "#64748b",
};

const TYPE_ICONS: Record<string, string> = {
  Fire: "🔥", Flood: "🌊", Accident: "🚗",
  Crime: "🚨", "Power Outage": "⚡", Other: "⚠️",
};

export default function MapPage() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [mapReady, setMapReady] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Load reports once
  useEffect(() => {
    api.getReports().then(setReports).catch(console.error);
  }, []);

  // Init map — with proper cleanup so React Strict Mode double-invoke works
  useEffect(() => {
    if (!mapRef.current) return;

    let map: any = null;

    import("leaflet").then((mod) => {
      const L = mod.default;
      if (!mapRef.current || mapInstanceRef.current) return;

      // Inject Leaflet CSS via JS so it's guaranteed loaded before map renders
      if (!document.querySelector("link[data-leaflet]")) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        link.setAttribute("data-leaflet", "true");
        document.head.appendChild(link);
      }

      map = L.map(mapRef.current, { zoomControl: true }).setView([35.91, -79.05], 13);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;
      setMapReady(true);
    });

    // Cleanup — removes map on unmount (handles React Strict Mode double-fire)
    return () => {
      if (map) {
        map.remove();
        mapInstanceRef.current = null;
        markersRef.current = [];
        setMapReady(false);
      }
    };
  }, []);

  // Re-render markers whenever map becomes ready or reports change
  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current) return;

    import("leaflet").then((mod) => {
      const L = mod.default;
      const map = mapInstanceRef.current;
      if (!map) return;

      // Clear old markers
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];

      reports.forEach((r) => {
        const color = TYPE_COLORS[r.type] ?? "#64748b";
        const emoji = TYPE_ICONS[r.type] ?? "⚠️";
        const votes = r.vote_count ?? 0;

        const icon = L.divIcon({
          className: "",
          html: `<div style="
            width:36px;height:36px;
            background:${color};
            border:2.5px solid white;
            border-radius:50% 50% 50% 0;
            transform:rotate(-45deg);
            box-shadow:0 3px 10px rgba(0,0,0,0.25);
            display:flex;align-items:center;justify-content:center;
          "><span style="transform:rotate(45deg);font-size:14px;line-height:1">${emoji}</span></div>`,
          iconSize: [36, 36],
          iconAnchor: [18, 36],
          popupAnchor: [0, -40],
        });

        const marker = L.marker([r.lat, r.lng], { icon }).addTo(map);
        marker.bindPopup(`
          <div style="font-family:-apple-system,system-ui,sans-serif;min-width:200px;padding:2px">
            <span style="
              background:${color};color:white;
              padding:3px 10px;border-radius:9999px;
              font-size:10px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;
              display:inline-block;margin-bottom:8px
            ">${emoji} ${r.type}</span>
            <strong style="font-size:14px;color:#0f172a;display:block;margin-bottom:4px;line-height:1.3">${r.title}</strong>
            ${r.description ? `<p style="font-size:12px;color:#64748b;margin:0 0 6px;line-height:1.4">${r.description}</p>` : ""}
            <div style="font-size:12px;color:#64748b;margin-bottom:10px">
              🗳️ <strong style="color:#0f172a">${votes}</strong> vote${votes !== 1 ? "s" : ""}
            </div>
            <button
              onclick="window.__upvote('${r.id}',this)"
              style="width:100%;padding:8px 12px;background:#dc2626;color:white;border:none;border-radius:8px;cursor:pointer;font-weight:600;font-size:13px"
            >👍 Upvote</button>
          </div>
        `, { maxWidth: 260 });

        markersRef.current.push(marker);
      });
    });
  }, [reports, mapReady]);

  // Global upvote handler for popup buttons
  useEffect(() => {
    (window as any).__upvote = async (id: string, btn: HTMLButtonElement) => {
      btn.disabled = true;
      btn.textContent = "Voting…";
      try {
        const res = await api.upvoteReport(id);
        const fresh = await api.getReports();
        setReports(fresh);
        showToast(`Voted! ${res.vote_count} vote${res.vote_count !== 1 ? "s" : ""} total`);
      } catch (e: any) {
        const msg = e.message ?? "";
        showToast(msg.includes("409") || msg.includes("Already") ? "You already voted on this" : "Failed to vote");
        btn.disabled = false;
        btn.textContent = "👍 Upvote";
      }
    };
    return () => { delete (window as any).__upvote; };
  }, []);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  }

  return (
    <AuthGate>
      {toast && (
        <div style={{
          position: "fixed", top: "1.25rem", right: "1.25rem", zIndex: 9999,
          background: "#0f172a", color: "white",
          padding: "0.875rem 1.25rem", borderRadius: 10,
          boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
          fontSize: "0.875rem", fontWeight: 500,
          borderLeft: "4px solid #dc2626",
          animation: "slideIn 0.3s ease",
        }}>
          ✅ {toast}
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
        <div>
          <h1 style={{ fontSize: "1.625rem", fontWeight: 800, letterSpacing: "-0.03em" }}>Incident Map</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginTop: "0.2rem" }}>
            {reports.length > 0 ? `${reports.length} incident${reports.length !== 1 ? "s" : ""} reported` : "Loading…"}
          </p>
        </div>
        <button
          className="btn btn-secondary"
          style={{ fontSize: "0.8rem" }}
          onClick={() => api.getReports().then(setReports).catch(console.error)}
        >
          ↻ Refresh
        </button>
      </div>

      {/* Legend */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1rem" }}>
        {Object.entries(TYPE_COLORS).map(([type, color]) => (
          <div key={type} style={{
            display: "flex", alignItems: "center", gap: "0.375rem",
            background: "white", padding: "0.3rem 0.75rem",
            borderRadius: 9999, border: "1px solid var(--border)",
            fontSize: "0.78rem", fontWeight: 600,
          }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: color, display: "inline-block", flexShrink: 0 }} />
            {TYPE_ICONS[type]} {type}
          </div>
        ))}
      </div>

      {/* Map container */}
      <div style={{ borderRadius: 16, overflow: "hidden", border: "1px solid var(--border)", boxShadow: "var(--shadow)" }}>
        <div ref={mapRef} style={{ height: 560, width: "100%" }} />
      </div>
    </AuthGate>
  );
}
