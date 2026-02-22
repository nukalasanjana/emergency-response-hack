"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { supabase } from "@/lib/supabase";
import AuthGate from "@/components/AuthGate";

export default function SettingsPage() {
  const [threshold, setThreshold] = useState(5);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getMe()
      .then((p) => {
        setThreshold(p.default_threshold);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaved(false);
    await api.updateThreshold(threshold);
    setSaved(true);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  if (loading) return <p>Loading…</p>;

  return (
    <AuthGate>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1rem" }}>
        ⚙️ Settings
      </h1>

      <div className="card">
        <label>
          Notification Threshold (upvotes before alert)
          <input
            type="number"
            min={1}
            value={threshold}
            onChange={(e) => {
              setThreshold(parseInt(e.target.value) || 1);
              setSaved(false);
            }}
          />
        </label>
        <button
          className="btn btn-primary"
          style={{ marginTop: "1rem" }}
          onClick={handleSave}
        >
          Save
        </button>
        {saved && (
          <span style={{ color: "#059669", marginLeft: "1rem", fontWeight: 600 }}>
            ✓ Saved
          </span>
        )}
      </div>

      <div className="card" style={{ marginTop: "1rem" }}>
        <button className="btn btn-danger" onClick={handleLogout}>
          Sign Out
        </button>
      </div>
    </AuthGate>
  );
}
