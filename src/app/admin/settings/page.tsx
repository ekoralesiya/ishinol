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
import { updateSiteSettings } from "@/app/admin/actions";

export default async function SettingsPage() {
  const session = await auth();
  if (!session) redirect("/admin/login");

  const allowed = can(session.user.role, "settings:write");

  let s: Awaited<ReturnType<typeof prisma.siteSettings.findUnique>> = null;
  if (allowed) {
    try {
      s = await prisma.siteSettings.findUnique({ where: { id: "singleton" } });
    } catch {
      s = null;
    }
  }

  return (
    <AdminShell user={session.user}>
      <PageHeader title="Settings" description="Global site settings, contact details and integrations." />

      {!allowed ? (
        <EmptyState message="Insufficient permission — your role cannot edit site settings." />
      ) : (
        <ActionForm action={updateSiteSettings} successMessage="Settings saved." className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Company</CardTitle></CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="companyName">Company name</Label>
                <Input id="companyName" name="companyName" defaultValue={s?.companyName ?? "ISHINOL Indonesia"} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="tagline_id">Tagline (ID)</Label>
                <Input id="tagline_id" name="tagline_id" defaultValue={s?.tagline_id ?? ""} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="tagline_en">Tagline (EN)</Label>
                <Input id="tagline_en" name="tagline_en" defaultValue={s?.tagline_en ?? ""} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="about_id">About (ID)</Label>
                <Textarea id="about_id" name="about_id" rows={3} defaultValue={s?.about_id ?? ""} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="about_en">About (EN)</Label>
                <Textarea id="about_en" name="about_en" rows={3} defaultValue={s?.about_en ?? ""} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Contact</CardTitle></CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="addressLine">Address</Label>
                <Input id="addressLine" name="addressLine" defaultValue={s?.addressLine ?? ""} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="city">City</Label>
                <Input id="city" name="city" defaultValue={s?.city ?? ""} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" defaultValue={s?.email ?? ""} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" name="phone" defaultValue={s?.phone ?? ""} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="whatsapp">WhatsApp</Label>
                <Input id="whatsapp" name="whatsapp" defaultValue={s?.whatsapp ?? ""} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Social & integrations</CardTitle></CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="instagramUrl">Instagram URL</Label>
                <Input id="instagramUrl" name="instagramUrl" defaultValue={s?.instagramUrl ?? ""} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="facebookUrl">Facebook URL</Label>
                <Input id="facebookUrl" name="facebookUrl" defaultValue={s?.facebookUrl ?? ""} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
                <Input id="linkedinUrl" name="linkedinUrl" defaultValue={s?.linkedinUrl ?? ""} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="youtubeUrl">YouTube URL</Label>
                <Input id="youtubeUrl" name="youtubeUrl" defaultValue={s?.youtubeUrl ?? ""} />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="gaMeasurementId">Google Analytics Measurement ID</Label>
                <Input id="gaMeasurementId" name="gaMeasurementId" defaultValue={s?.gaMeasurementId ?? ""} placeholder="G-XXXXXXX" />
              </div>
            </CardContent>
          </Card>

          <Button type="submit" variant="gold"><Save /> Save settings</Button>
        </ActionForm>
      )}
    </AdminShell>
  );
}
