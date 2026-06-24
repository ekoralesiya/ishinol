import { redirect } from "next/navigation";
import { Save } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { can } from "@/lib/rbac";
import { AdminShell } from "@/components/admin/admin-shell";
import { PageHeader, EmptyState } from "@/components/admin/page-header";
import { ActionForm } from "@/components/admin/action-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { upsertSeo } from "@/app/admin/actions";

const PAGE_KEYS = ["home", "about", "products", "portfolio", "news", "contact", "downloads", "videos"];

type Seo = {
  pageKey: string;
  metaTitle_id: string | null;
  metaTitle_en: string | null;
  metaDescription_id: string | null;
  metaDescription_en: string | null;
  keywords: string | null;
};

export default async function SeoPage() {
  const session = await auth();
  if (!session) redirect("/admin/login");

  const allowed = can(session.user.role, "seo:write");

  let existing: Seo[] = [];
  if (allowed) {
    try {
      existing = await prisma.seoSetting.findMany();
    } catch {
      existing = [];
    }
  }
  const byKey = new Map(existing.map((s) => [s.pageKey, s]));

  return (
    <AdminShell user={session.user}>
      <PageHeader title="SEO" description="Per-page meta titles, descriptions and keywords (bilingual)." />

      {!allowed ? (
        <EmptyState message="Insufficient permission — your role cannot edit SEO settings." />
      ) : (
        <div className="space-y-6">
          {PAGE_KEYS.map((key) => {
            const s = byKey.get(key);
            return (
              <Card key={key}>
                <CardHeader><CardTitle className="capitalize">{key}</CardTitle></CardHeader>
                <CardContent>
                  <ActionForm action={upsertSeo} successMessage="SEO saved.">
                    <input type="hidden" name="pageKey" value={key} />
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <Label htmlFor={`${key}-mt-id`}>Meta title (ID)</Label>
                        <Input id={`${key}-mt-id`} name="metaTitle_id" defaultValue={s?.metaTitle_id ?? ""} />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor={`${key}-mt-en`}>Meta title (EN)</Label>
                        <Input id={`${key}-mt-en`} name="metaTitle_en" defaultValue={s?.metaTitle_en ?? ""} />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor={`${key}-md-id`}>Meta description (ID)</Label>
                        <Textarea id={`${key}-md-id`} name="metaDescription_id" rows={2} defaultValue={s?.metaDescription_id ?? ""} />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor={`${key}-md-en`}>Meta description (EN)</Label>
                        <Textarea id={`${key}-md-en`} name="metaDescription_en" rows={2} defaultValue={s?.metaDescription_en ?? ""} />
                      </div>
                      <div className="space-y-1.5 sm:col-span-2">
                        <Label htmlFor={`${key}-kw`}>Keywords (comma-separated)</Label>
                        <Input id={`${key}-kw`} name="keywords" defaultValue={s?.keywords ?? ""} />
                      </div>
                    </div>
                    <Button type="submit" variant="gold" size="sm"><Save /> Save</Button>
                  </ActionForm>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </AdminShell>
  );
}
