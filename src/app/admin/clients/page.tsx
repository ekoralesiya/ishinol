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
import { deleteClient } from "@/app/admin/actions";

export default async function ClientsPage() {
  const session = await auth();
  if (!session) redirect("/admin/login");

  let clients: Array<{
    id: string;
    name: string;
    logoUrl: string | null;
    website: string | null;
    category: string;
    isActive: boolean;
  }> = [];
  try {
    clients = await prisma.client.findMany({ orderBy: { order: "asc" } });
  } catch {
    clients = [];
  }

  return (
    <AdminShell user={session.user}>
      <PageHeader
        title="Clients"
        description="Manage Klien Kami logos shown across the site. Public site reads the active items."
        actions={
          <Button asChild variant="gold" size="sm">
            <Link href="/admin/clients/new">
              <Plus /> Add client
            </Link>
          </Button>
        }
      />

      {clients.length === 0 ? (
        <EmptyState message="No clients yet. Add your first client to get started." />
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="px-5 py-3 font-medium">Logo</th>
                    <th className="px-5 py-3 font-medium">Name</th>
                    <th className="px-5 py-3 font-medium">Category</th>
                    <th className="px-5 py-3 font-medium">Website</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map((c) => (
                    <tr key={c.id} className="border-b border-border last:border-0">
                      <td className="px-5 py-3">
                        {c.logoUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={c.logoUrl}
                            alt={c.name}
                            className="h-8 w-auto max-w-[80px] object-contain"
                          />
                        ) : (
                          <div className="flex h-8 w-12 items-center justify-center rounded bg-muted text-[10px] text-muted-foreground">
                            No logo
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        <p className="font-medium text-ink">{c.name}</p>
                      </td>
                      <td className="px-5 py-3 text-ink-muted">{c.category}</td>
                      <td className="px-5 py-3 text-ink-muted">
                        {c.website ? (
                          <a
                            href={c.website}
                            target="_blank"
                            rel="noreferrer"
                            className="text-gold-700 hover:underline"
                          >
                            {c.website}
                          </a>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="px-5 py-3">
                        <Badge variant={c.isActive ? "success" : "muted"}>
                          {c.isActive ? "Active" : "Hidden"}
                        </Badge>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/clients/${c.id}`}
                            className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-ink-muted hover:bg-muted hover:text-ink"
                          >
                            <Pencil className="size-3.5" /> Edit
                          </Link>
                          <DeleteButton id={c.id} action={deleteClient} />
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
