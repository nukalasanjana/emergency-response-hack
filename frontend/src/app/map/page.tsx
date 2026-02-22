"use client";

import { useEffect, useState, useRef } from "react";
import { api } from "@/lib/api";
import AuthGate from "@/components/AuthGate";

// Dynamically import Leaflet only on the client
let L: any = null;

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
        attribution: "&copy; OSM",
      }).addTo(map);
      setMapInstance(map);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!mapInstance || !L || reports.length === 0) return;

    reports.forEach((r) => {
      const marker = L.marker([r.lat, r.lng]).addTo(mapInstance);
      marker.bindPopup(`
        <strong>${r.title}</strong><br/>
        Type: ${r.type}<br/>
        ${r.description || ""}<br/>
        Votes: ${r.vote_count ?? 0}<br/>
        <button onclick="window.__upvote('${r.id}')" style="margin-top:4px;padding:4px 10px;background:#4f46e5;color:white;border:none;border-radius:6px;cursor:pointer;">
          👍 Upvote
        </button>
      `);
    });
  }, [mapInstance, reports]);

  // Expose upvote globally for popup buttons
  useEffect(() => {
    (window as any).__upvote = async (id: string) => {
      try {
        const res = await api.upvoteReport(id);
        alert(`Vote recorded! Total: ${res.vote_count}`);
        // refresh
        const fresh = await api.getReports();
        setReports(fresh);
      } catch (e: any) {
        alert(e.message || "Error voting");
      }
    };
    return () => {
      delete (window as any).__upvote;
    };
  }, []);

  return (
    <AuthGate>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1rem" }}>
        📍 Incident Map
      </h1>
      <div
        ref={mapRef}
        style={{ height: 500, borderRadius: 12, overflow: "hidden", border: "1px solid #d1d5db" }}
      />
    </AuthGate>
  );
}
