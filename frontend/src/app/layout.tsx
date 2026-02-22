import "./globals.css";
import type { Metadata } from "next";

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
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        />
      </head>
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <nav className="bg-indigo-600 text-white px-6 py-3 flex items-center gap-6 shadow">
          <a href="/" className="font-bold text-lg">
            🚨 Community Alerts
          </a>
          <a href="/map" className="hover:underline">Map</a>
          <a href="/report" className="hover:underline">Report</a>
          <a href="/alerts" className="hover:underline">Alerts</a>
          <a href="/settings" className="hover:underline">Settings</a>
        </nav>
        <main className="max-w-5xl mx-auto p-6">{children}</main>
      </body>
    </html>
  );
}
