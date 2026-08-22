"use client";

import { Toaster as HotToaster } from "react-hot-toast";

export function Toaster() {
  return (
    <HotToaster
      position="top-center"
      gutter={8}
      toastOptions={{
        duration: 4000,
        style: {
          background: "var(--background)",
          color: "var(--foreground)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius)",
          boxShadow: "0 8px 24px oklch(0 0 0 / 0.12)",
          fontSize: "0.875rem",
          padding: "0.625rem 0.875rem",
          maxWidth: "420px",
        },
        success: {
          iconTheme: {
            primary: "var(--primary)",
            secondary: "var(--primary-foreground)",
          },
        },
        error: {
          iconTheme: {
            primary: "var(--destructive)",
            secondary: "var(--background)",
          },
        },
      }}
    />
  );
}
