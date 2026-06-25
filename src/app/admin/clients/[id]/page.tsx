import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { AdminShell } from "@/components/admin/admin-shell";
import { PageHeader } from "@/components/admin/page-header";
import { ClientForm, type ClientFormValues } from "@/components/admin/client-form";

const EMPTY: ClientFormValues = {
  id: "new",
  name: "",
  logoUrl: "",
  website: "",
  category: "general",
  order: 0,
  isActive: true,
};

export default async function ClientEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session) redirect("/admin/login");
  const { id } = await params;
  const isNew = id === "new";

  let initial: ClientFormValues = EMPTY;
  if (!isNew) {
    let client: Awaited<ReturnType<typeof prisma.client.findUnique>> = null;
    try {
      client = await prisma.client.findUnique({ where: { id } });
    } catch {
      client = null;
    }
    if (!client) notFound();
    initial = {
      id: client.id,
      name: client.name,
      logoUrl: client.logoUrl ?? "",
      website: client.website ?? "",
      category: client.category,
      order: client.order,
      isActive: client.isActive,
    };
  }

  return (
    <AdminShell user={session.user}>
      <Link
        href="/admin/clients"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-ink"
      >
        <ArrowLeft className="size-4" /> Back to clients
      </Link>
      <PageHeader title={isNew ? "Add client" : "Edit client"} />
      <ClientForm initial={initial} />
    </AdminShell>
  );
}
