import { redirect } from "next/navigation";
import { Star } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { AdminShell } from "@/components/admin/admin-shell";
import { PageHeader } from "@/components/admin/page-header";
import { ActionForm } from "@/components/admin/action-form";
import { DeleteButton } from "@/components/admin/delete-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { createTestimonial, deleteTestimonial } from "@/app/admin/actions";

export default async function TestimonialsPage() {
  const session = await auth();
  if (!session) redirect("/admin/login");

  let testimonials: Array<{
    id: string;
    author: string;
    company: string | null;
    quote_en: string;
    rating: number;
  }> = [];
  try {
    testimonials = await prisma.testimonial.findMany({ orderBy: { order: "asc" } });
  } catch {
    testimonials = [];
  }

  return (
    <AdminShell user={session.user}>
      <PageHeader title="Testimonials" description="Client quotes shown across the site." />

      <Card className="mb-6">
        <CardHeader><CardTitle>Add testimonial</CardTitle></CardHeader>
        <CardContent>
          <ActionForm action={createTestimonial} resetOnSuccess successMessage="Testimonial added.">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label htmlFor="author">Author</Label>
                <Input id="author" name="author" required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="role_en">Role (EN)</Label>
                <Input id="role_en" name="role_en" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="company">Company</Label>
                <Input id="company" name="company" />
              </div>
              <div className="space-y-1.5 sm:col-span-3">
                <Label htmlFor="role_id">Role (ID)</Label>
                <Input id="role_id" name="role_id" />
              </div>
              <div className="space-y-1.5 sm:col-span-3">
                <Label htmlFor="quote_en">Quote (EN)</Label>
                <Textarea id="quote_en" name="quote_en" rows={2} required />
              </div>
              <div className="space-y-1.5 sm:col-span-3">
                <Label htmlFor="quote_id">Quote (ID)</Label>
                <Textarea id="quote_id" name="quote_id" rows={2} required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="rating">Rating (1–5)</Label>
                <Input id="rating" name="rating" type="number" min={1} max={5} defaultValue={5} />
              </div>
            </div>
            <Button type="submit" variant="gold">Add testimonial</Button>
          </ActionForm>
        </CardContent>
      </Card>

      {testimonials.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border bg-white/50 px-6 py-16 text-center text-sm text-muted-foreground">
          No testimonials yet.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {testimonials.map((t) => (
            <Card key={t.id}>
              <CardContent className="space-y-2 p-5">
                <div className="flex gap-0.5 text-gold">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="size-3.5 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-ink-muted">&ldquo;{t.quote_en}&rdquo;</p>
                <div className="flex items-center justify-between pt-1">
                  <div>
                    <p className="text-sm font-medium text-ink">{t.author}</p>
                    {t.company && <p className="text-xs text-muted-foreground">{t.company}</p>}
                  </div>
                  <DeleteButton id={t.id} action={deleteTestimonial} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
