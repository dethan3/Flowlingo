import type { Metadata, Viewport } from "next";
import { PropsWithChildren } from "react";

import { AppShell } from "@/components/app-shell";

import "./globals.css";

export const metadata: Metadata = {
  title: "Flowlingo",
  description:
    "AI-powered daily English acquisition through real-life scenarios.",
  applicationName: "Flowlingo",
};

export const viewport: Viewport = {
  themeColor: "#1d8f6a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body className="bg-bg text-ink">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
