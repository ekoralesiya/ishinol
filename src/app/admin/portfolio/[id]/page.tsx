import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { AdminShell } from "@/components/admin/admin-shell";
import { PageHeader } from "@/components/admin/page-header";
import { PortfolioForm, type ProjectFormValues } from "@/components/admin/portfolio-form";

const EMPTY: ProjectFormValues = {
  id: "new",
  slug: "",
  title_id: "",
  title_en: "",
  location: "",
  client: "",
  year: "",
  description_id: "",
  description_en: "",
  coverImage: "",
  isFeatured: false,
  isActive: true,
};

export default async function ProjectEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session) redirect("/admin/login");
  const { id } = await params;
  const isNew = id === "new";

  let initial: ProjectFormValues = EMPTY;
  if (!isNew) {
    let project: Awaited<ReturnType<typeof prisma.portfolioProject.findUnique>> = null;
    try {
      project = await prisma.portfolioProject.findUnique({ where: { id } });
    } catch {
      project = null;
    }
    if (!project) notFound();
    initial = {
      id: project.id,
      slug: project.slug,
      title_id: project.title_id,
      title_en: project.title_en,
      location: project.location ?? "",
      client: project.client ?? "",
      year: project.year?.toString() ?? "",
      description_id: project.description_id ?? "",
      description_en: project.description_en ?? "",
      coverImage: project.coverImage ?? "",
      isFeatured: project.isFeatured,
      isActive: project.isActive,
    };
  }

  return (
    <AdminShell user={session.user}>
      <Link href="/admin/portfolio"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-ink">
        <ArrowLeft className="size-4" /> Back to portfolio
      </Link>
      <PageHeader title={isNew ? "New project" : "Edit project"} />
      <PortfolioForm initial={initial} />
    </AdminShell>
  );
}
