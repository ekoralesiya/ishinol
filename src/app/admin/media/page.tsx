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
import { createMedia, deleteMedia } from "@/app/admin/actions";

export default async function MediaPage() {
  const session = await auth();
  if (!session) redirect("/admin/login");

  let media: Array<{
    id: string;
    url: string;
    fileName: string;
    type: string;
    fileSize: number | null;
  }> = [];
  try {
    media = await prisma.mediaLibrary.findMany({ orderBy: { createdAt: "desc" }, take: 100 });
  } catch {
    media = [];
  }

  return (
    <AdminShell user={session.user}>
      <PageHeader title="Media Library" description="Store reusable image, video and document URLs." />

      <Card className="mb-6">
        <CardHeader><CardTitle>Add media</CardTitle></CardHeader>
        <CardContent>
          <ActionForm action={createMedia} resetOnSuccess successMessage="Media added.">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-1.5 lg:col-span-2">
                <Label htmlFor="url">URL</Label>
                <Input id="url" name="url" required placeholder="https://…" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="fileName">File name</Label>
                <Input id="fileName" name="fileName" placeholder="optional" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="type">Type</Label>
                <select id="type" name="type" defaultValue="image"
                  className="flex h-11 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                  <option value="pdf">PDF</option>
                  <option value="document">Document</option>
                </select>
              </div>
            </div>
            <Button type="submit" variant="gold">Add media</Button>
          </ActionForm>
        </CardContent>
      </Card>

      {media.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border bg-white/50 px-6 py-16 text-center text-sm text-muted-foreground">
          No media yet.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {media.map((m) => (
            <Card key={m.id} className="overflow-hidden">
              <div className="aspect-video bg-muted">
                {m.type === "image" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={m.url} alt={m.fileName} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs uppercase text-muted-foreground">
                    {m.type}
                  </div>
                )}
              </div>
              <CardContent className="space-y-1 p-3">
                <p className="truncate text-xs font-medium text-ink" title={m.fileName}>{m.fileName}</p>
                <p className="text-[11px] text-muted-foreground">{formatBytes(m.fileSize)}</p>
                <DeleteButton id={m.id} action={deleteMedia} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
