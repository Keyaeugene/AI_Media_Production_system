import "./globals.css";

import type { Metadata } from "next";
import { ReactNode } from "react";

import AppNav from "@/components/AppNav";

export const metadata: Metadata = {
  title: "AI Media Production System",
  description:
    "Autonomous multi-agent pipeline for generating cinematic vertical videos from a brief, theme, or script.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="relative overflow-x-hidden">
        {/* Ambient background blobs */}
        <div className="bg-blob bg-blob-violet" aria-hidden="true" />
        <div className="bg-blob bg-blob-cyan" aria-hidden="true" />

        <div className="relative z-10 flex flex-col min-h-screen">
          <AppNav />
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
