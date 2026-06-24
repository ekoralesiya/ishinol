import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { AdminShell } from "@/components/admin/admin-shell";
import { PageHeader } from "@/components/admin/page-header";
import { ActionForm } from "@/components/admin/action-form";
import { DeleteButton } from "@/components/admin/delete-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createVideo, deleteVideo } from "@/app/admin/actions";

export default async function VideosPage() {
  const session = await auth();
  if (!session) redirect("/admin/login");

  let videos: Array<{ id: string; title_en: string; url: string; isFeatured: boolean }> = [];
  try {
    videos = await prisma.video.findMany({ orderBy: { order: "asc" } });
  } catch {
    videos = [];
  }

  return (
    <AdminShell user={session.user}>
      <PageHeader title="Videos" description="YouTube and uploaded marketing videos." />

      <Card className="mb-6">
        <CardHeader><CardTitle>Add video</CardTitle></CardHeader>
        <CardContent>
          <ActionForm action={createVideo} resetOnSuccess successMessage="Video added.">
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
                <Label htmlFor="url">YouTube / video URL</Label>
                <Input id="url" name="url" required placeholder="https://youtube.com/watch?v=…" />
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="isFeatured" className="size-4 accent-gold-600" /> Featured
            </label>
            <Button type="submit" variant="gold">Add video</Button>
          </ActionForm>
        </CardContent>
      </Card>

      {videos.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border bg-white/50 px-6 py-16 text-center text-sm text-muted-foreground">
          No videos yet.
        </p>
      ) : (
        <Card>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-5 py-3 font-medium">Title</th>
                  <th className="px-5 py-3 font-medium">URL</th>
                  <th className="px-5 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {videos.map((v) => (
                  <tr key={v.id} className="border-b border-border last:border-0">
                    <td className="px-5 py-3">
                      <span className="font-medium text-ink">{v.title_en}</span>
                      {v.isFeatured && <Badge variant="gold" className="ml-2">Featured</Badge>}
                    </td>
                    <td className="px-5 py-3 max-w-[260px] truncate text-xs text-muted-foreground">
                      <a href={v.url} target="_blank" rel="noreferrer" className="hover:underline">{v.url}</a>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <DeleteButton id={v.id} action={deleteVideo} />
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
