import { redirect } from "next/navigation";
import { Save } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { AdminShell } from "@/components/admin/admin-shell";
import { PageHeader } from "@/components/admin/page-header";
import { ActionForm } from "@/components/admin/action-form";
import { ToggleButton } from "@/components/admin/toggle-button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { upsertHero } from "@/app/admin/actions";

export default async function HomePage() {
  const session = await auth();
  if (!session) redirect("/admin/login");

  let hero: Awaited<ReturnType<typeof prisma.heroBanner.findFirst>> = null;
  let products: Array<{ id: string; name_en: string; isFeatured: boolean }> = [];
  let projects: Array<{ id: string; title_en: string; isFeatured: boolean }> = [];
  try {
    [hero, products, projects] = await Promise.all([
      prisma.heroBanner.findFirst({ orderBy: { order: "asc" } }),
      prisma.product.findMany({ orderBy: { order: "asc" }, select: { id: true, name_en: true, isFeatured: true } }),
      prisma.portfolioProject.findMany({ orderBy: { order: "asc" }, select: { id: true, title_en: true, isFeatured: true } }),
    ]);
  } catch {
    hero = null;
    products = [];
    projects = [];
  }

  return (
    <AdminShell user={session.user}>
      <PageHeader title="Home Page" description="Manage the hero banner and featured content." />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Hero Banner</CardTitle>
            <CardDescription>Bilingual headline shown at the top of the home page.</CardDescription>
          </CardHeader>
          <CardContent>
            <ActionForm action={upsertHero} successMessage="Hero saved.">
              <input type="hidden" name="id" value={hero?.id ?? "new"} />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="eyebrow_id">Eyebrow (ID)</Label>
                  <Input id="eyebrow_id" name="eyebrow_id" defaultValue={hero?.eyebrow_id ?? ""} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="eyebrow_en">Eyebrow (EN)</Label>
                  <Input id="eyebrow_en" name="eyebrow_en" defaultValue={hero?.eyebrow_en ?? ""} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="headline_id">Headline (ID)</Label>
                  <Input id="headline_id" name="headline_id" defaultValue={hero?.headline_id ?? ""} required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="headline_en">Headline (EN)</Label>
                  <Input id="headline_en" name="headline_en" defaultValue={hero?.headline_en ?? ""} required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="subheadline_id">Subheadline (ID)</Label>
                  <Textarea id="subheadline_id" name="subheadline_id" rows={2} defaultValue={hero?.subheadline_id ?? ""} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="subheadline_en">Subheadline (EN)</Label>
                  <Textarea id="subheadline_en" name="subheadline_en" rows={2} defaultValue={hero?.subheadline_en ?? ""} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="ctaLabel_id">CTA label (ID)</Label>
                  <Input id="ctaLabel_id" name="ctaLabel_id" defaultValue={hero?.ctaLabel_id ?? ""} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="ctaLabel_en">CTA label (EN)</Label>
                  <Input id="ctaLabel_en" name="ctaLabel_en" defaultValue={hero?.ctaLabel_en ?? ""} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="ctaHref">CTA link</Label>
                  <Input id="ctaHref" name="ctaHref" defaultValue={hero?.ctaHref ?? ""} placeholder="/products" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="imageUrl">Background image URL</Label>
                  <Input id="imageUrl" name="imageUrl" defaultValue={hero?.imageUrl ?? ""} placeholder="https://…" />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="videoUrl">Background video URL</Label>
                  <Input id="videoUrl" name="videoUrl" defaultValue={hero?.videoUrl ?? ""} placeholder="https://…" />
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="isActive" defaultChecked={hero?.isActive ?? true} className="size-4 accent-gold-600" />
                Active
              </label>
              <Button type="submit" variant="gold"><Save /> Save hero</Button>
            </ActionForm>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Featured Products</CardTitle>
              <CardDescription>Toggle which products appear on the home page.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {products.length === 0 ? (
                <p className="text-sm text-muted-foreground">No products.</p>
              ) : (
                products.map((p) => (
                  <div key={p.id} className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm text-ink">{p.name_en}</span>
                    <ToggleButton model="product" id={p.id} field="isFeatured" value={p.isFeatured}
                      revalidate="/admin/home" onLabel="Featured" offLabel="Feature" />
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Featured Projects</CardTitle>
              <CardDescription>Toggle which projects appear on the home page.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {projects.length === 0 ? (
                <p className="text-sm text-muted-foreground">No projects.</p>
              ) : (
                projects.map((p) => (
                  <div key={p.id} className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm text-ink">{p.title_en}</span>
                    <ToggleButton model="portfolioProject" id={p.id} field="isFeatured" value={p.isFeatured}
                      revalidate="/admin/home" onLabel="Featured" offLabel="Feature" />
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminShell>
  );
}
