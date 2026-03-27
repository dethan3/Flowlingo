"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily:
            "Inter, SF Pro Display, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
          backgroundColor: "#f7f5f0",
          color: "#1a1a1a",
          minHeight: "100dvh",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            gap: "1rem",
            padding: "1rem",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              backgroundColor: "rgba(220, 38, 38, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
            }}
          >
            !
          </div>
          <h2 style={{ fontSize: 18, fontWeight: 700 }}>
            Something went wrong
          </h2>
          <p style={{ color: "#6b7280", fontSize: 14, maxWidth: 300 }}>
            {error.message || "An unexpected error occurred."}
          </p>
          <button
            onClick={reset}
            style={{
              marginTop: 8,
              padding: "12px 24px",
              borderRadius: 12,
              backgroundColor: "#1d8f6a",
              color: "#fff",
              fontSize: 14,
              fontWeight: 500,
              border: "none",
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
