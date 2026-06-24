import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { AdminShell } from "@/components/admin/admin-shell";
import { PageHeader } from "@/components/admin/page-header";
import { NewsForm, type ArticleFormValues } from "@/components/admin/news-form";

const EMPTY: ArticleFormValues = {
  id: "new",
  slug: "",
  title_id: "",
  title_en: "",
  excerpt_id: "",
  excerpt_en: "",
  content_id: "",
  content_en: "",
  coverImage: "",
  isPublished: false,
  isFeatured: false,
};

export default async function ArticleEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session) redirect("/admin/login");
  const { id } = await params;
  const isNew = id === "new";

  let initial: ArticleFormValues = EMPTY;
  if (!isNew) {
    let article: Awaited<ReturnType<typeof prisma.article.findUnique>> = null;
    try {
      article = await prisma.article.findUnique({ where: { id } });
    } catch {
      article = null;
    }
    if (!article) notFound();
    initial = {
      id: article.id,
      slug: article.slug,
      title_id: article.title_id,
      title_en: article.title_en,
      excerpt_id: article.excerpt_id ?? "",
      excerpt_en: article.excerpt_en ?? "",
      content_id: article.content_id ?? "",
      content_en: article.content_en ?? "",
      coverImage: article.coverImage ?? "",
      isPublished: article.isPublished,
      isFeatured: article.isFeatured,
    };
  }

  return (
    <AdminShell user={session.user}>
      <Link href="/admin/news"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-ink">
        <ArrowLeft className="size-4" /> Back to news
      </Link>
      <PageHeader title={isNew ? "New article" : "Edit article"} />
      <NewsForm initial={initial} />
    </AdminShell>
  );
}
