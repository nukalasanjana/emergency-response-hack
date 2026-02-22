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
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => subscription.unsubscribe();
  }, []);

  if (session === undefined)
    return <p style={{ textAlign: "center", marginTop: "3rem" }}>Loading…</p>;

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
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
    } catch (err: any) {
      setError(err.message || "Auth error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 380, margin: "4rem auto" }}>
      <h2 style={{ fontSize: "1.5rem", fontWeight: 700, textAlign: "center" }}>
        {isSignUp ? "Create Account" : "Sign In"}
      </h2>
      <form onSubmit={handleSubmit} style={{ marginTop: "1rem" }}>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </label>
        {error && (
          <p style={{ color: "#ef4444", marginTop: "0.5rem", fontSize: "0.9rem" }}>
            {error}
          </p>
        )}
        <button
          type="submit"
          className="btn btn-primary"
          style={{ width: "100%", marginTop: "1rem", justifyContent: "center" }}
          disabled={loading}
        >
          {loading ? "…" : isSignUp ? "Sign Up" : "Sign In"}
        </button>
      </form>
      <p style={{ textAlign: "center", marginTop: "1rem", fontSize: "0.9rem" }}>
        {isSignUp ? "Already have an account?" : "No account?"}{" "}
        <button
          onClick={() => {
            setIsSignUp(!isSignUp);
            setError("");
          }}
          style={{ color: "#4f46e5", fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}
        >
          {isSignUp ? "Sign In" : "Sign Up"}
        </button>
      </p>
    </div>
  );
}
