import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { AdminShell } from "@/components/admin/admin-shell";
import { PageHeader, EmptyState } from "@/components/admin/page-header";
import { DeleteButton } from "@/components/admin/delete-button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { deleteProject } from "@/app/admin/actions";

export default async function PortfolioPage() {
  const session = await auth();
  if (!session) redirect("/admin/login");

  let projects: Array<{
    id: string;
    title_en: string;
    client: string | null;
    year: number | null;
    isFeatured: boolean;
    isActive: boolean;
  }> = [];
  try {
    projects = await prisma.portfolioProject.findMany({ orderBy: { order: "asc" } });
  } catch {
    projects = [];
  }

  return (
    <AdminShell user={session.user}>
      <PageHeader
        title="Portfolio"
        description="Showcase completed projects and case studies."
        actions={
          <Button asChild variant="gold" size="sm">
            <Link href="/admin/portfolio/new"><Plus /> New project</Link>
          </Button>
        }
      />

      {projects.length === 0 ? (
        <EmptyState message="No projects yet. Add your first portfolio project." />
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="px-5 py-3 font-medium">Title</th>
                    <th className="px-5 py-3 font-medium">Client</th>
                    <th className="px-5 py-3 font-medium">Year</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((p) => (
                    <tr key={p.id} className="border-b border-border last:border-0">
                      <td className="px-5 py-3 font-medium text-ink">{p.title_en}</td>
                      <td className="px-5 py-3 text-ink-muted">{p.client ?? "—"}</td>
                      <td className="px-5 py-3 text-ink-muted">{p.year ?? "—"}</td>
                      <td className="px-5 py-3">
                        <div className="flex flex-wrap gap-1.5">
                          {p.isFeatured && <Badge variant="gold">Featured</Badge>}
                          <Badge variant={p.isActive ? "success" : "muted"}>
                            {p.isActive ? "Active" : "Hidden"}
                          </Badge>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/admin/portfolio/${p.id}`}
                            className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-ink-muted hover:bg-muted hover:text-ink">
                            <Pencil className="size-3.5" /> Edit
                          </Link>
                          <DeleteButton id={p.id} action={deleteProject} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </AdminShell>
  );
}
