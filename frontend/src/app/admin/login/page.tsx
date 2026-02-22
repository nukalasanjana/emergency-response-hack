"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { api } from "@/lib/api";

type ViewState = "loading" | "unauthenticated" | "not-admin" | "admin";

export default function AdminLoginPage() {
  const router = useRouter();
  const [view, setView] = useState<ViewState>("loading");
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    resolveView();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => resolveView());
    return () => subscription.unsubscribe();
  }, []);

  async function resolveView() {
    const { data } = await supabase.auth.getSession();
    if (!data.session) { setView("unauthenticated"); return; }
    try {
      const profile = await api.getMe();
      setView(profile.role === "admin" ? "admin" : "not-admin");
    } catch {
      setView("not-admin");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      if (isSignUp) {
        const { data: signUpData, error: err } = await supabase.auth.signUp({ email, password });
        if (err) throw err;

        if (!signUpData.session) {
          // Email confirmation is enabled — user must verify before continuing
          throw new Error(
            "A confirmation email was sent. Please verify your email first, then sign in. " +
            "To skip this step, disable 'Enable email confirmations' in your Supabase dashboard under Authentication → Email."
          );
        }

        // Wait for the DB trigger to create the profile row, then promote to admin
        await new Promise((r) => setTimeout(r, 800));
        await api.makeAdmin();
        router.push("/admin/analytics");
      } else {
        const { error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) throw err;
        const profile = await api.getMe();
        if (profile.role !== "admin") {
          await supabase.auth.signOut();
          throw new Error("This account does not have admin access. Sign up as admin or use a different account.");
        }
        router.push("/admin/analytics");
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleBecomeAdmin() {
    setSubmitting(true);
    setError("");
    try {
      await api.makeAdmin();
      router.push("/admin/analytics");
    } catch (err: any) {
      setError(err.message || "Failed to upgrade account");
    } finally {
      setSubmitting(false);
    }
  }

  // ── Loading ─────────────────────────────────────────────────
  if (view === "loading") {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
        <div style={{ textAlign: "center", color: "var(--text-muted)" }}>
          <div style={{
            width: 32, height: 32, border: "3px solid #e2e8f0", borderTopColor: "#dc2626",
            borderRadius: "50%", animation: "spin 0.65s linear infinite", margin: "0 auto 1rem",
          }} />
          Loading…
        </div>
      </div>
    );
  }

  // ── Already admin – quick-jump card ─────────────────────────
  if (view === "admin") {
    return (
      <div style={{ minHeight: "75vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem 1rem" }}>
        <div style={{ textAlign: "center", maxWidth: 400 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: 56, height: 56, background: "#059669", borderRadius: 16,
            fontSize: "1.5rem", marginBottom: "1rem", boxShadow: "0 4px 14px rgba(5,150,105,0.4)",
          }}>✓</div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.025em" }}>You're signed in as admin</h1>
          <p style={{ color: "var(--text-muted)", marginTop: "0.5rem", fontSize: "0.9rem" }}>
            Your account has admin access.
          </p>
          <a href="/admin/analytics" style={{
            display: "inline-block", marginTop: "1.5rem",
            background: "#dc2626", color: "white",
            padding: "0.75rem 1.75rem", borderRadius: 10,
            fontWeight: 700, fontSize: "0.9375rem", textDecoration: "none",
          }}>
            Go to Analytics Dashboard
          </a>
        </div>
      </div>
    );
  }

  // ── Signed in but not admin yet ──────────────────────────────
  if (view === "not-admin") {
    return (
      <div style={{ minHeight: "75vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem 1rem" }}>
        <div style={{ width: "100%", maxWidth: 400 }}>
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              width: 56, height: 56, background: "#f59e0b", borderRadius: 16,
              fontSize: "1.5rem", marginBottom: "1rem", boxShadow: "0 4px 14px rgba(245,158,11,0.4)",
            }}>🛡️</div>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.025em" }}>Admin Access Required</h1>
            <p style={{ color: "var(--text-muted)", marginTop: "0.375rem", fontSize: "0.9rem" }}>
              You're signed in but this account isn't an admin yet.
            </p>
          </div>
          <div style={{
            background: "white", borderRadius: 16, padding: "2rem",
            boxShadow: "0 4px 24px rgba(0,0,0,0.08)", border: "1px solid var(--border)",
          }}>
            {error && (
              <div style={{
                background: "#fee2e2", color: "#991b1b", padding: "0.75rem 1rem",
                borderRadius: 8, fontSize: "0.875rem", marginBottom: "1rem",
              }}>⚠️ {error}</div>
            )}
            <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginBottom: "1.5rem", lineHeight: 1.6 }}>
              Upgrade your current account to admin to access the analytics dashboard and emergency response tools.
            </p>
            <button
              className="btn btn-primary"
              style={{ width: "100%", padding: "0.75rem", fontSize: "0.9375rem" }}
              onClick={handleBecomeAdmin}
              disabled={submitting}
            >
              {submitting ? "Upgrading…" : "Upgrade to Admin"}
            </button>
            <button
              onClick={() => supabase.auth.signOut()}
              style={{
                width: "100%", marginTop: "0.75rem", padding: "0.75rem",
                background: "none", border: "1px solid var(--border)", borderRadius: 8,
                cursor: "pointer", fontSize: "0.875rem", color: "var(--text-muted)", fontWeight: 500,
              }}
            >
              Sign out and use a different account
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Unauthenticated: sign-in / sign-up form ─────────────────
  return (
    <div style={{ minHeight: "75vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem 1rem" }}>
      <div style={{ width: "100%", maxWidth: 420 }}>

        {/* Brand */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: 56, height: 56, background: "#dc2626", borderRadius: 16,
            fontSize: "1.5rem", marginBottom: "1rem", boxShadow: "0 4px 14px rgba(220,38,38,0.4)",
          }}>🛡️</div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.025em" }}>
            {isSignUp ? "Create Admin Account" : "Admin Sign In"}
          </h1>
          <p style={{ color: "var(--text-muted)", marginTop: "0.375rem", fontSize: "0.875rem" }}>
            {isSignUp
              ? "For emergency responders and town staff"
              : "Sign in to access the analytics dashboard"}
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: "white", borderRadius: 16, padding: "2rem",
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)", border: "1px solid var(--border)",
        }}>

          {/* Tab switcher */}
          <div style={{
            display: "flex", background: "#f1f5f9", borderRadius: 8,
            padding: 3, marginBottom: "1.5rem", gap: 3,
          }}>
            {(["Sign In", "Sign Up"] as const).map((tab) => {
              const active = (tab === "Sign Up") === isSignUp;
              return (
                <button key={tab}
                  onClick={() => { setIsSignUp(tab === "Sign Up"); setError(""); }}
                  style={{
                    flex: 1, padding: "0.5rem", borderRadius: 6, border: "none",
                    cursor: "pointer", fontSize: "0.875rem",
                    fontWeight: active ? 700 : 500,
                    background: active ? "white" : "transparent",
                    color: active ? "var(--text)" : "var(--text-muted)",
                    boxShadow: active ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                    transition: "all 0.15s",
                  }}
                >{tab}</button>
              );
            })}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="admin-email">Email address</label>
              <input
                id="admin-email" type="email" value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="responder@city.gov" required autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="admin-password">Password</label>
              <input
                id="admin-password" type="password" value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isSignUp ? "At least 6 characters" : "••••••••"}
                required minLength={6}
                autoComplete={isSignUp ? "new-password" : "current-password"}
              />
            </div>

            {isSignUp && (
              <div style={{
                background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 8,
                padding: "0.75rem 1rem", fontSize: "0.8rem", color: "#1d4ed8",
                marginBottom: "1rem", display: "flex", gap: "0.5rem", alignItems: "flex-start",
              }}>
                <span style={{ flexShrink: 0 }}>ℹ️</span>
                <span>This account will have admin privileges — full access to the analytics dashboard and system-wide incident data.</span>
              </div>
            )}

            {error && (
              <div style={{
                background: "#fee2e2", color: "#991b1b", padding: "0.75rem 1rem",
                borderRadius: 8, fontSize: "0.875rem", marginBottom: "1rem",
                display: "flex", alignItems: "flex-start", gap: "0.5rem",
              }}>⚠️ {error}</div>
            )}

            <button
              type="submit" className="btn btn-primary"
              style={{ width: "100%", padding: "0.75rem", fontSize: "0.9375rem" }}
              disabled={submitting}
            >
              {submitting ? "Please wait…" : isSignUp ? "Create Admin Account" : "Sign In"}
            </button>
          </form>
        </div>

        <p style={{ textAlign: "center", marginTop: "1.25rem", fontSize: "0.8rem", color: "var(--text-muted)" }}>
          Not an admin?{" "}
          <a href="/" style={{ color: "#dc2626", fontWeight: 600, textDecoration: "none" }}>
            Return to Community Alerts
          </a>
        </p>
      </div>
    </div>
  );
}