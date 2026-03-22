import type { Metadata, Viewport } from "next";
import { PropsWithChildren } from "react";

import { AppShell } from "@/components/app-shell";

import "./globals.css";

export const metadata: Metadata = {
  title: "Flowlingo",
  description: "A calm, comprehensible-input English learning demo built as a web-first PWA.",
  applicationName: "Flowlingo",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Flowlingo"
  }
};

export const viewport: Viewport = {
  themeColor: "#1d8f6a"
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
