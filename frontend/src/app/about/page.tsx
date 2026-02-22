"use client";

export default function AboutPage() {
  const sections = [
    {
      title: "Inspiration",
      icon: "💡",
      content: "We were inspired to build Flare to close the gap between local incidents and official emergency broadcasts. Our goal was to move beyond passive news to a more unified real-time network where neighbors can instantly alert and protect one another.",
    },
    {
      title: "What it does",
      icon: "🎯",
      content: "Flare is a real-time alert system that decentralizes emergency reporting. Users can instantly report local hazards, filter by hazard type and vote thresholds, and upvote existing alerts to provide crowdsourced verification. It also features an analytics dashboard to track total community members notified and number of alerts raised.",
    },
    {
      title: "How we built it",
      icon: "🛠️",
      content: "We built Flare using a full-stack architecture: Next.js and React for a responsive frontend, and FastAPI to handle our backend logic. We chose Supabase for database management, specifically using its real-time features to push instant alerts to users. We used Claude and GitHub Copilot to help structure our database schema and generate the initial project skeleton.",
    },
  ];

  return (
    <div>
      {/* Hero section */}
      <div style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)",
        borderRadius: 20,
        padding: "3rem 2rem",
        marginBottom: "3rem",
        color: "white",
        position: "relative",
        overflow: "hidden",
        textAlign: "center",
      }}>
        <div style={{
          position: "absolute", top: -40, right: -40,
          width: 200, height: 200,
          background: "rgba(220,38,38,0.15)",
          borderRadius: "50%",
          pointerEvents: "none",
        }} />

        <div style={{ position: "relative" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🚨</div>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1.1, marginBottom: "1rem" }}>
            About <span style={{ color: "#fca5a5" }}>Flare</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "1.125rem", maxWidth: 600, margin: "0 auto" }}>
            Decentralized emergency reporting. Real-time community verification. Neighbors protecting neighbors.
          </p>
        </div>
      </div>

      {/* Content sections */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "2rem",
        marginBottom: "3rem",
      }}>
        {sections.map((section, i) => (
          <div key={i} style={{
            background: "white",
            borderRadius: 16,
            padding: "2rem",
            border: "1.5px solid var(--border)",
            boxShadow: "var(--shadow-sm)",
          }}>
            <div style={{
              fontSize: "2rem",
              marginBottom: "1rem",
            }}>{section.icon}</div>
            <h2 style={{
              fontSize: "1.375rem",
              fontWeight: 700,
              color: "var(--text)",
              marginBottom: "1rem",
            }}>
              {section.title}
            </h2>
            <p style={{
              color: "var(--text-muted)",
              fontSize: "1rem",
              lineHeight: 1.6,
            }}>
              {section.content}
            </p>
          </div>
        ))}
      </div>

      {/* Key features */}
      <div style={{
        background: "white",
        borderRadius: 16,
        padding: "2rem",
        border: "1.5px solid var(--border)",
        boxShadow: "var(--shadow-sm)",
        marginBottom: "3rem",
      }}>
        <h2 style={{
          fontSize: "1.75rem",
          fontWeight: 700,
          color: "var(--text)",
          marginBottom: "1.5rem",
        }}>
          Key Features
        </h2>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "1.5rem",
        }}>
          {[
            { icon: "📍", title: "Live Map", desc: "View all reported incidents in real-time on an interactive map" },
            { icon: "📝", title: "Easy Reporting", desc: "Submit incident reports with location and hazard details" },
            { icon: "🔔", title: "Instant Alerts", desc: "Receive notifications as verified incidents are confirmed" },
            { icon: "👥", title: "Crowdsourced Verification", desc: "Community votes determine credibility and visibility" },
            { icon: "📊", title: "Analytics", desc: "Track community impact and alert statistics" },
            { icon: "⚙️", title: "Customizable", desc: "Set your own notification preferences and vote thresholds" },
          ].map((feature, i) => (
            <div key={i}>
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>{feature.icon}</div>
              <h3 style={{
                fontSize: "1rem",
                fontWeight: 700,
                color: "var(--text)",
                marginBottom: "0.375rem",
              }}>
                {feature.title}
              </h3>
              <p style={{
                fontSize: "0.875rem",
                color: "var(--text-muted)",
                lineHeight: 1.5,
              }}>
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)",
        borderRadius: 20,
        padding: "2.5rem 2rem",
        textAlign: "center",
        color: "white",
      }}>
        <h2 style={{
          fontSize: "2rem",
          fontWeight: 700,
          marginBottom: "1rem",
        }}>
          Ready to connect with your community?
        </h2>
        <p style={{
          color: "rgba(255,255,255,0.7)",
          fontSize: "1rem",
          marginBottom: "1.5rem",
        }}>
          Join Flare today and be part of the emergency response network.
        </p>
        <a href="/" style={{
          display: "inline-block",
          background: "#dc2626",
          color: "white",
          padding: "0.75rem 1.5rem",
          borderRadius: 8,
          textDecoration: "none",
          fontWeight: 600,
          transition: "all 0.2s",
          border: "none",
          cursor: "pointer",
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.background = "#b91c1c";
          (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.background = "#dc2626";
          (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
        }}>
          Get Started →
        </a>
      </div>
    </div>
  );
}
