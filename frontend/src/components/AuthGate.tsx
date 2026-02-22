"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Session } from "@supabase/supabase-js";

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => subscription.unsubscribe();
  }, []);

  if (session === undefined) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
        <div style={{ textAlign: "center", color: "var(--text-muted)" }}>
          <div style={{
            width: 32, height: 32,
            border: "3px solid #e2e8f0",
            borderTopColor: "#dc2626",
            borderRadius: "50%",
            animation: "spin 0.65s linear infinite",
            margin: "0 auto 1rem",
          }} />
          Loading…
        </div>
      </div>
    );
  }

  if (session) return <>{children}</>;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "75vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem 1rem",
    }}>
      <div style={{ width: "100%", maxWidth: 400 }}>
        {/* Brand mark */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 56,
            height: 56,
            background: "#dc2626",
            borderRadius: 16,
            fontSize: "1.5rem",
            marginBottom: "1rem",
            boxShadow: "0 4px 14px rgba(220,38,38,0.4)",
          }}>🚨</div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text)", letterSpacing: "-0.025em" }}>
            {isSignUp ? "Create your account" : "Welcome back"}
          </h1>
          <p style={{ color: "var(--text-muted)", marginTop: "0.375rem", fontSize: "0.9rem" }}>
            {isSignUp ? "Join Flare today" : "Sign in to continue"}
          </p>
        </div>

        {/* Form card */}
        <div style={{
          background: "white",
          borderRadius: 16,
          padding: "2rem",
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
          border: "1px solid var(--border)",
        }}>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="auth-email">Email address</label>
              <input
                id="auth-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="auth-password">Password</label>
              <input
                id="auth-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isSignUp ? "At least 6 characters" : "••••••••"}
                required
                minLength={6}
                autoComplete={isSignUp ? "new-password" : "current-password"}
              />
            </div>

            {error && (
              <div style={{
                background: "#fee2e2",
                color: "#991b1b",
                padding: "0.75rem 1rem",
                borderRadius: 8,
                fontSize: "0.875rem",
                marginBottom: "1rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}>
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: "100%", padding: "0.75rem", fontSize: "0.9375rem" }}
              disabled={loading}
            >
              {loading ? "Please wait…" : isSignUp ? "Create Account" : "Sign In"}
            </button>
          </form>
        </div>

        <p style={{ textAlign: "center", marginTop: "1.25rem", fontSize: "0.875rem", color: "var(--text-muted)" }}>
          {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            onClick={() => { setIsSignUp(!isSignUp); setError(""); }}
            style={{ color: "#dc2626", fontWeight: 600, background: "none", border: "none", cursor: "pointer", fontSize: "0.875rem" }}
          >
            {isSignUp ? "Sign In" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
}
