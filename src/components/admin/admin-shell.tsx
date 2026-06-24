"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Home,
  Package,
  Briefcase,
  Newspaper,
  Image as ImageIcon,
  Video,
  Download,
  Quote,
  Inbox,
  MessageSquare,
  Users,
  Search,
  Settings,
  LogOut,
  Menu,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { roleLabel } from "@/lib/rbac";
import { Badge } from "@/components/ui/badge";
import type { Role } from "@prisma/client";

type NavItem = { href: string; label: string; icon: LucideIcon };

const NAV: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/home", label: "Home Page", icon: Home },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/portfolio", label: "Portfolio", icon: Briefcase },
  { href: "/admin/news", label: "News", icon: Newspaper },
  { href: "/admin/media", label: "Media", icon: ImageIcon },
  { href: "/admin/videos", label: "Videos", icon: Video },
  { href: "/admin/downloads", label: "Downloads", icon: Download },
  { href: "/admin/testimonials", label: "Testimonials", icon: Quote },
  { href: "/admin/leads", label: "Leads", icon: Inbox },
  { href: "/admin/chat", label: "Chat", icon: MessageSquare },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/seo", label: "SEO", icon: Search },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(href + "/");
}

export function AdminShell({
  user,
  children,
}: {
  user: { name?: string | null; email?: string | null; role: Role };
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const nav = (
    <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
      {NAV.map((item) => {
        const active = isActive(pathname, item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-gold/15 text-gold-700"
                : "text-ink-muted hover:bg-muted hover:text-ink",
              collapsed && "justify-center px-0",
            )}
            title={collapsed ? item.label : undefined}
          >
            <Icon className="size-4 shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </Link>
        );
      })}
    </nav>
  );

  const brand = (
    <div className="flex h-16 items-center gap-2 border-b border-border px-4">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-ink text-sm font-bold text-gold">
        IS
      </div>
      {!collapsed && (
        <div className="leading-tight">
          <p className="text-sm font-semibold text-ink">ISHINOL</p>
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Admin CMS</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex min-h-screen bg-marble">
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "sticky top-0 hidden h-screen shrink-0 flex-col border-r border-border bg-white transition-all md:flex",
          collapsed ? "w-16" : "w-60",
        )}
      >
        {brand}
        {nav}
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="flex items-center gap-3 border-t border-border px-4 py-3 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-ink"
        >
          <Menu className="size-4" />
          {!collapsed && <span>Collapse</span>}
        </button>
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-ink/40"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute left-0 top-0 flex h-full w-60 flex-col bg-white shadow-xl">
            {brand}
            {nav}
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-white/90 px-4 backdrop-blur md:px-6">
          <div className="flex items-center gap-3">
            <button
              className="rounded-md p-2 text-ink-muted hover:bg-muted md:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="size-5" />
            </button>
            <h1 className="text-sm font-semibold text-ink">
              {NAV.find((n) => isActive(pathname, n.href))?.label ?? "Admin"}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium leading-tight text-ink">{user.name ?? "User"}</p>
              <p className="text-xs leading-tight text-muted-foreground">{user.email}</p>
            </div>
            <Badge variant="gold">{roleLabel(user.role)}</Badge>
            <button
              onClick={() => signOut({ redirectTo: "/admin/login" })}
              className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-ink-muted transition-colors hover:bg-muted hover:text-ink"
              title="Sign out"
            >
              <LogOut className="size-3.5" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
