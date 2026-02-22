"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import AuthGate from "@/components/AuthGate";

const REPORT_TYPES = ["Fire", "Flood", "Accident", "Crime", "Power Outage", "Other"];

export default function ReportPage() {
  const [type, setType] = useState(REPORT_TYPES[0]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const useGeo = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude.toFixed(6));
        setLng(pos.coords.longitude.toFixed(6));
      },
      () => alert("Could not get location")
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccess(false);
    try {
      await api.createReport({
        type,
        title,
        description,
        lat: parseFloat(lat),
        lng: parseFloat(lng),
      });
      setSuccess(true);
      setTitle("");
      setDescription("");
    } catch (err: any) {
      alert(err.message || "Error creating report");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthGate>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1rem" }}>
        📝 Create Report
      </h1>
      {success && (
        <div
          style={{
            background: "#d1fae5",
            color: "#065f46",
            padding: "0.75rem 1rem",
            borderRadius: 8,
            marginBottom: "1rem",
          }}
        >
          Report submitted successfully!
        </div>
      )}
      <form onSubmit={handleSubmit} className="card">
        <label>
          Type
          <select value={type} onChange={(e) => setType(e.target.value)}>
            {REPORT_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
        <label>
          Title
          <input value={title} onChange={(e) => setTitle(e.target.value)} required />
        </label>
        <label>
          Description
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </label>

        <div style={{ display: "flex", gap: "1rem", alignItems: "flex-end" }}>
          <label style={{ flex: 1 }}>
            Latitude
            <input
              type="number"
              step="any"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              required
            />
          </label>
          <label style={{ flex: 1 }}>
            Longitude
            <input
              type="number"
              step="any"
              value={lng}
              onChange={(e) => setLng(e.target.value)}
              required
            />
          </label>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={useGeo}
            style={{ marginBottom: 2 }}
          >
            📍 Use My Location
          </button>
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          style={{ width: "100%", marginTop: "1.25rem", justifyContent: "center" }}
          disabled={submitting}
        >
          {submitting ? "Submitting…" : "Submit Report"}
        </button>
      </form>
    </AuthGate>
  );
}
