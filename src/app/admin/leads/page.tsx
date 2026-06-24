import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { can } from "@/lib/rbac";
import { AdminShell } from "@/components/admin/admin-shell";
import { PageHeader, EmptyState } from "@/components/admin/page-header";
import { LeadStatusSelect } from "@/components/admin/lead-status-select";
import { DeleteButton } from "@/components/admin/delete-button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { deleteLead } from "@/app/admin/actions";

export default async function LeadsPage() {
  const session = await auth();
  if (!session) redirect("/admin/login");

  const allowed = can(session.user.role, "leads:read");

  let leads: Array<{
    id: string;
    name: string;
    email: string;
    phone: string | null;
    company: string | null;
    subject: string | null;
    message: string;
    source: string;
    status: string;
    createdAt: Date;
  }> = [];
  if (allowed) {
    try {
      leads = await prisma.lead.findMany({ orderBy: { createdAt: "desc" }, take: 200 });
    } catch {
      leads = [];
    }
  }

  return (
    <AdminShell user={session.user}>
      <PageHeader title="Leads" description="Inquiries submitted through the website contact forms." />

      {!allowed ? (
        <EmptyState message="Insufficient permission — your role cannot view leads." />
      ) : leads.length === 0 ? (
        <EmptyState message="No leads yet." />
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="px-5 py-3 font-medium">Contact</th>
                    <th className="px-5 py-3 font-medium">Message</th>
                    <th className="px-5 py-3 font-medium">Source</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((l) => (
                    <tr key={l.id} className="border-b border-border align-top last:border-0">
                      <td className="px-5 py-3">
                        <p className="font-medium text-ink">{l.name}</p>
                        <p className="text-xs text-muted-foreground">{l.email}</p>
                        {l.phone && <p className="text-xs text-muted-foreground">{l.phone}</p>}
                        {l.company && <p className="text-xs text-muted-foreground">{l.company}</p>}
                      </td>
                      <td className="px-5 py-3 max-w-[320px]">
                        {l.subject && <p className="text-xs font-medium text-ink">{l.subject}</p>}
                        <p className="text-xs text-ink-muted">{l.message}</p>
                      </td>
                      <td className="px-5 py-3"><Badge variant="muted">{l.source}</Badge></td>
                      <td className="px-5 py-3"><LeadStatusSelect id={l.id} status={l.status} /></td>
                      <td className="px-5 py-3 text-right">
                        <DeleteButton id={l.id} action={deleteLead} />
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
