import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Flowlingo",
    short_name: "Flowlingo",
    description: "A web-first PWA demo for calm, comprehensible-input English learning.",
    start_url: "/",
    display: "standalone",
    background_color: "#f6f2e8",
    theme_color: "#1d8f6a",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml"
      },
      {
        src: "/maskable-icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable"
      }
    ]
  };
}
