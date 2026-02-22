"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import AuthGate from "@/components/AuthGate";

const REPORT_TYPES = [
  { value: "Fire",         icon: "🔥", label: "Fire" },
  { value: "Flood",        icon: "🌊", label: "Flood" },
  { value: "Accident",     icon: "🚗", label: "Accident" },
  { value: "Crime",        icon: "🚨", label: "Crime" },
  { value: "Power Outage", icon: "⚡", label: "Power Outage" },
  { value: "Other",        icon: "⚠️", label: "Other" },
];

export default function ReportPage() {
  const [type, setType] = useState(REPORT_TYPES[0].value);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [geoLoading, setGeoLoading] = useState(false);

  const useGeo = () => {
    if (!navigator.geolocation) { setError("Geolocation not supported by your browser"); return; }
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude.toFixed(6));
        setLng(pos.coords.longitude.toFixed(6));
        setGeoLoading(false);
      },
      () => { setError("Could not retrieve your location"); setGeoLoading(false); }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccess(false);
    setError("");
    try {
      await api.createReport({ type, title, description, lat: parseFloat(lat), lng: parseFloat(lng) });
      setSuccess(true);
      setTitle("");
      setDescription("");
    } catch (err: any) {
      setError(err.message || "Failed to submit report");
    } finally {
      setSubmitting(false);
    }
  };

  const selectedType = REPORT_TYPES.find((t) => t.value === type);

  return (
    <AuthGate>
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: "1.75rem" }}>
          <h1 style={{ fontSize: "1.625rem", fontWeight: 800, letterSpacing: "-0.03em" }}>File a Report</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginTop: "0.25rem" }}>
            Reports are reviewed by the community through upvoting
          </p>
        </div>

        {success && (
          <div style={{
            background: "#d1fae5", color: "#065f46",
            padding: "1rem 1.25rem", borderRadius: 12,
            marginBottom: "1.25rem",
            display: "flex", alignItems: "center", gap: "0.625rem",
            fontWeight: 600, fontSize: "0.9375rem",
            border: "1px solid #a7f3d0",
          }}>
            ✅ Report submitted! The community will review and verify it.
          </div>
        )}

        {error && (
          <div style={{
            background: "#fee2e2", color: "#991b1b",
            padding: "0.875rem 1.25rem", borderRadius: 12,
            marginBottom: "1.25rem",
            display: "flex", alignItems: "center", gap: "0.625rem",
            fontSize: "0.9rem", border: "1px solid #fecaca",
          }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Incident type selector */}
          <div className="card" style={{ marginBottom: "1rem" }}>
            <p style={{ fontWeight: 700, fontSize: "0.875rem", marginBottom: "0.875rem" }}>Incident Type</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.625rem" }}>
              {REPORT_TYPES.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setType(t.value)}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "0.375rem",
                    padding: "0.875rem 0.5rem",
                    borderRadius: 10,
                    border: type === t.value ? "2px solid #dc2626" : "1.5px solid var(--border)",
                    background: type === t.value ? "#fee2e2" : "var(--surface-2)",
                    cursor: "pointer",
                    transition: "all 0.15s",
                    fontSize: "1.25rem",
                  }}
                >
                  <span>{t.icon}</span>
                  <span style={{
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: type === t.value ? "#991b1b" : "var(--text-muted)",
                  }}>{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="card" style={{ marginBottom: "1rem" }}>
            <p style={{ fontWeight: 700, fontSize: "0.875rem", marginBottom: "1rem" }}>Incident Details</p>

            <div className="form-group">
              <label htmlFor="report-title">
                Title <span style={{ color: "#dc2626" }}>*</span>
              </label>
              <input
                id="report-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={`Brief description of the ${selectedType?.label.toLowerCase() ?? "incident"}`}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label htmlFor="report-desc">Description</label>
              <textarea
                id="report-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Additional details (optional)"
              />
            </div>
          </div>

          {/* Location */}
          <div className="card" style={{ marginBottom: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
              <p style={{ fontWeight: 700, fontSize: "0.875rem" }}>Location</p>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={useGeo}
                disabled={geoLoading}
                style={{ fontSize: "0.8rem", padding: "0.375rem 0.875rem" }}
              >
                {geoLoading ? "Locating…" : "📍 Use My Location"}
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label htmlFor="report-lat">Latitude <span style={{ color: "#dc2626" }}>*</span></label>
                <input
                  id="report-lat"
                  type="number"
                  step="any"
                  value={lat}
                  onChange={(e) => setLat(e.target.value)}
                  placeholder="e.g. 35.9132"
                  required
                />
              </div>
              <div>
                <label htmlFor="report-lng">Longitude <span style={{ color: "#dc2626" }}>*</span></label>
                <input
                  id="report-lng"
                  type="number"
                  step="any"
                  value={lng}
                  onChange={(e) => setLng(e.target.value)}
                  placeholder="e.g. -79.0558"
                  required
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%", padding: "0.875rem", fontSize: "1rem" }}
            disabled={submitting}
          >
            {submitting ? "Submitting…" : "Submit Report"}
          </button>
        </form>
      </div>
    </AuthGate>
  );
}
