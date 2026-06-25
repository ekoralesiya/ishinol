import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Package,
  Briefcase,
  Newspaper,
  Inbox,
  Video,
  Download,
  type LucideIcon,
} from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { can } from "@/lib/rbac";
import { AdminShell } from "@/components/admin/admin-shell";
import { PageHeader } from "@/components/admin/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch {
    return fallback;
  }
}

function StatCard({
  label,
  value,
  icon: Icon,
  href,
}: {
  label: string;
  value: number;
  icon: LucideIcon;
  href: string;
}) {
  return (
    <Link href={href}>
      <Card className="transition-shadow hover:shadow-md">
        <CardContent className="flex items-center justify-between p-5">
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="mt-1 text-2xl font-semibold text-ink">{value}</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold/15 text-gold-700">
            <Icon className="size-5" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

const STATUS_VARIANT: Record<string, "success" | "warning" | "muted" | "gold"> = {
  new: "gold",
  contacted: "warning",
  qualified: "success",
  closed: "muted",
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/admin/login");
  const user = session.user;

  // Detect database connectivity so we can warn instead of silently showing zeros.
  let dbError: string | null = null;
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch (e) {
    dbError =
      (e instanceof Error ? e.message.split("\n").find((l) => l.trim())?.trim() : null) ??
      "Database connection failed";
  }

  const [products, projects, articles, newLeads, videos, downloads] = await Promise.all([
    safe(() => prisma.product.count(), 0),
    safe(() => prisma.portfolioProject.count(), 0),
    safe(() => prisma.article.count(), 0),
    safe(() => prisma.lead.count({ where: { status: "new" } }), 0),
    safe(() => prisma.video.count(), 0),
    safe(() => prisma.download.count(), 0),
  ]);

  const recentLeads = await safe(
    () => prisma.lead.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    [] as Awaited<ReturnType<typeof prisma.lead.findMany>>,
  );

  const recentActivity = can(user.role, "audit:read")
    ? await safe(
        () =>
          prisma.auditLog.findMany({
            orderBy: { createdAt: "desc" },
            take: 6,
            include: { user: { select: { name: true } } },
          }),
        [] as Awaited<ReturnType<typeof prisma.auditLog.findMany>>,
      )
    : [];

  return (
    <AdminShell user={user}>
      <PageHeader
        title={`Welcome back${user.name ? `, ${user.name.split(" ")[0]}` : ""}`}
        description="Overview of your PT Indocoat Ishinol Utama content and inquiries."
      />

      {dbError && (
        <div className="mb-6 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <p className="font-semibold">⚠️ Database tidak terhubung / Database not connected</p>
          <p className="mt-1 text-destructive/90">
            Statistik & konten di bawah mungkin kosong. Periksa <code>DATABASE_URL</code> /{" "}
            <code>DIRECT_URL</code> (kredensial Supabase) pada environment variables.
          </p>
          <p className="mt-1 font-mono text-xs opacity-80">{dbError}</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <StatCard label="Products" value={products} icon={Package} href="/admin/products" />
        <StatCard label="Portfolio Projects" value={projects} icon={Briefcase} href="/admin/portfolio" />
        <StatCard label="Articles" value={articles} icon={Newspaper} href="/admin/news" />
        <StatCard label="New Leads" value={newLeads} icon={Inbox} href="/admin/leads" />
        <StatCard label="Videos" value={videos} icon={Video} href="/admin/videos" />
        <StatCard label="Downloads" value={downloads} icon={Download} href="/admin/downloads" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Recent Leads</CardTitle>
            <Link href="/admin/leads" className="text-xs font-medium text-gold-700 hover:underline">
              View all
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {recentLeads.length === 0 ? (
              <p className="px-6 pb-6 text-sm text-muted-foreground">No leads yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-y border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                      <th className="px-6 py-2 font-medium">Name</th>
                      <th className="px-6 py-2 font-medium">Subject</th>
                      <th className="px-6 py-2 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentLeads.map((lead) => (
                      <tr key={lead.id} className="border-b border-border last:border-0">
                        <td className="px-6 py-3">
                          <p className="font-medium text-ink">{lead.name}</p>
                          <p className="text-xs text-muted-foreground">{lead.email}</p>
                        </td>
                        <td className="px-6 py-3 text-ink-muted">{lead.subject ?? lead.source}</td>
                        <td className="px-6 py-3">
                          <Badge variant={STATUS_VARIANT[lead.status] ?? "muted"}>{lead.status}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {recentActivity.length === 0 ? (
              <p className="text-sm text-muted-foreground">No recent activity.</p>
            ) : (
              <ul className="space-y-3">
                {recentActivity.map((log) => (
                  <li key={log.id} className="text-sm">
                    <p className="text-ink">
                      <span className="font-medium">
                        {(log as { user?: { name?: string | null } }).user?.name ?? "System"}
                      </span>{" "}
                      <span className="text-muted-foreground">
                        {log.action.toLowerCase()}d {log.entity}
                      </span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(log.createdAt).toLocaleString("en-US")}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminShell>
  );
}
