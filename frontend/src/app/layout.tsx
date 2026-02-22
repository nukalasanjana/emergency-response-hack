import "./globals.css";
import type { Metadata } from "next";
import NavBar from "@/components/NavBar";

export const metadata: Metadata = {
  title: "Community Alerts",
  description: "Crowdsourced incident reporting and real-time alerts",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head />
      <body>
        <NavBar />
        <main style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem 1.5rem" }}>
          {children}
        </main>
      </body>
    </html>
  );
}
