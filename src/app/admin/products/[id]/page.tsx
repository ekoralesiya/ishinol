import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { asStringList } from "@/lib/utils";
import { AdminShell } from "@/components/admin/admin-shell";
import { PageHeader } from "@/components/admin/page-header";
import { ProductForm, type ProductFormValues } from "@/components/admin/product-form";

const EMPTY: ProductFormValues = {
  id: "new",
  slug: "",
  name_id: "",
  name_en: "",
  tagline_id: "",
  tagline_en: "",
  description_id: "",
  description_en: "",
  features_id: "",
  features_en: "",
  coverImage: "",
  categoryId: "",
  isFeatured: false,
  isActive: true,
};

export default async function ProductEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session) redirect("/admin/login");
  const { id } = await params;
  const isNew = id === "new";

  let categories: Array<{ id: string; name_en: string }> = [];
  try {
    categories = await prisma.productCategory.findMany({
      orderBy: { order: "asc" },
      select: { id: true, name_en: true },
    });
  } catch {
    categories = [];
  }

  let initial: ProductFormValues = EMPTY;
  if (!isNew) {
    let product: Awaited<ReturnType<typeof prisma.product.findUnique>> = null;
    try {
      product = await prisma.product.findUnique({ where: { id } });
    } catch {
      product = null;
    }
    if (!product) notFound();
    initial = {
      id: product.id,
      slug: product.slug,
      name_id: product.name_id,
      name_en: product.name_en,
      tagline_id: product.tagline_id ?? "",
      tagline_en: product.tagline_en ?? "",
      description_id: product.description_id ?? "",
      description_en: product.description_en ?? "",
      features_id: asStringList(product.features_id).join("\n"),
      features_en: asStringList(product.features_en).join("\n"),
      coverImage: product.coverImage ?? "",
      categoryId: product.categoryId ?? "",
      isFeatured: product.isFeatured,
      isActive: product.isActive,
    };
  }

  return (
    <AdminShell user={session.user}>
      <Link
        href="/admin/products"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-ink"
      >
        <ArrowLeft className="size-4" /> Back to products
      </Link>
      <PageHeader title={isNew ? "New product" : "Edit product"} />
      <ProductForm initial={initial} categories={categories} />
    </AdminShell>
  );
}
