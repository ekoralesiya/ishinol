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
import { deleteArticle } from "@/app/admin/actions";

export default async function NewsPage() {
  const session = await auth();
  if (!session) redirect("/admin/login");

  let articles: Array<{
    id: string;
    title_en: string;
    isPublished: boolean;
    isFeatured: boolean;
    publishedAt: Date | null;
  }> = [];
  try {
    articles = await prisma.article.findMany({ orderBy: { createdAt: "desc" } });
  } catch {
    articles = [];
  }

  return (
    <AdminShell user={session.user}>
      <PageHeader
        title="News & Articles"
        description="Publish company news, insights and updates."
        actions={
          <Button asChild variant="gold" size="sm">
            <Link href="/admin/news/new"><Plus /> New article</Link>
          </Button>
        }
      />

      {articles.length === 0 ? (
        <EmptyState message="No articles yet. Write your first article." />
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="px-5 py-3 font-medium">Title</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {articles.map((a) => (
                    <tr key={a.id} className="border-b border-border last:border-0">
                      <td className="px-5 py-3 font-medium text-ink">{a.title_en}</td>
                      <td className="px-5 py-3">
                        <div className="flex flex-wrap gap-1.5">
                          {a.isFeatured && <Badge variant="gold">Featured</Badge>}
                          <Badge variant={a.isPublished ? "success" : "muted"}>
                            {a.isPublished ? "Published" : "Draft"}
                          </Badge>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/admin/news/${a.id}`}
                            className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-ink-muted hover:bg-muted hover:text-ink">
                            <Pencil className="size-3.5" /> Edit
                          </Link>
                          <DeleteButton id={a.id} action={deleteArticle} />
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
