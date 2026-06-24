import type { Metadata } from "next";
import type { ReactNode } from "react";

// The admin area is NOT internationalized (middleware skips /admin).
// This root layout renders children directly so /admin/login can render
// without the authenticated chrome. Authenticated pages wrap their own
// content in <AdminShell /> after guarding with auth().

export const metadata: Metadata = {
  title: "Admin — ISHINOL Indonesia",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-marble text-ink">{children}</div>;
}
