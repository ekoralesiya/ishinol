import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formatBytes } from "@/lib/utils";
import { AdminShell } from "@/components/admin/admin-shell";
import { PageHeader } from "@/components/admin/page-header";
import { ActionForm } from "@/components/admin/action-form";
import { DeleteButton } from "@/components/admin/delete-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createDownload, deleteDownload } from "@/app/admin/actions";

export default async function DownloadsPage() {
  const session = await auth();
  if (!session) redirect("/admin/login");

  let downloads: Array<{
    id: string;
    title_en: string;
    category: string;
    fileSize: number | null;
    downloads: number;
  }> = [];
  try {
    downloads = await prisma.download.findMany({ orderBy: { order: "asc" } });
  } catch {
    downloads = [];
  }

  return (
    <AdminShell user={session.user}>
      <PageHeader title="Downloads" description="Brochures, catalogs, datasheets and certificates." />

      <Card className="mb-6">
        <CardHeader><CardTitle>Add download</CardTitle></CardHeader>
        <CardContent>
          <ActionForm action={createDownload} resetOnSuccess successMessage="Download added.">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="title_id">Title (ID)</Label>
                <Input id="title_id" name="title_id" required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="title_en">Title (EN)</Label>
                <Input id="title_en" name="title_en" required />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="fileUrl">File URL</Label>
                <Input id="fileUrl" name="fileUrl" required placeholder="https://…/brochure.pdf" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="category">Category</Label>
                <select id="category" name="category" defaultValue="brochure"
                  className="flex h-11 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <option value="brochure">Brochure</option>
                  <option value="catalog">Catalog</option>
                  <option value="certificate">Certificate</option>
                  <option value="datasheet">Datasheet</option>
                  <option value="documentation">Documentation</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="fileSize">File size (bytes)</Label>
                <Input id="fileSize" name="fileSize" type="number" placeholder="optional" />
              </div>
            </div>
            <Button type="submit" variant="gold">Add download</Button>
          </ActionForm>
        </CardContent>
      </Card>

      {downloads.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border bg-white/50 px-6 py-16 text-center text-sm text-muted-foreground">
          No downloads yet.
        </p>
      ) : (
        <Card>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-5 py-3 font-medium">Title</th>
                  <th className="px-5 py-3 font-medium">Category</th>
                  <th className="px-5 py-3 font-medium">Size</th>
                  <th className="px-5 py-3 font-medium">Downloads</th>
                  <th className="px-5 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {downloads.map((d) => (
                  <tr key={d.id} className="border-b border-border last:border-0">
                    <td className="px-5 py-3 font-medium text-ink">{d.title_en}</td>
                    <td className="px-5 py-3"><Badge variant="muted">{d.category}</Badge></td>
                    <td className="px-5 py-3 text-ink-muted">{formatBytes(d.fileSize)}</td>
                    <td className="px-5 py-3 text-ink-muted">{d.downloads}</td>
                    <td className="px-5 py-3 text-right">
                      <DeleteButton id={d.id} action={deleteDownload} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </AdminShell>
  );
}
