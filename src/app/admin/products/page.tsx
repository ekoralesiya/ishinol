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
import { deleteProduct } from "@/app/admin/actions";

export default async function ProductsPage() {
  const session = await auth();
  if (!session) redirect("/admin/login");

  let products: Array<{
    id: string;
    name_en: string;
    name_id: string;
    isFeatured: boolean;
    isActive: boolean;
    category: { name_en: string } | null;
  }> = [];
  try {
    products = await prisma.product.findMany({
      orderBy: { order: "asc" },
      include: { category: { select: { name_en: true } } },
    });
  } catch {
    products = [];
  }

  return (
    <AdminShell user={session.user}>
      <PageHeader
        title="Products"
        description="Manage product catalog (bilingual). Public site reads the active items."
        actions={
          <Button asChild variant="gold" size="sm">
            <Link href="/admin/products/new">
              <Plus /> New product
            </Link>
          </Button>
        }
      />

      {products.length === 0 ? (
        <EmptyState message="No products yet. Create your first product to get started." />
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="px-5 py-3 font-medium">Name</th>
                    <th className="px-5 py-3 font-medium">Category</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id} className="border-b border-border last:border-0">
                      <td className="px-5 py-3">
                        <p className="font-medium text-ink">{p.name_en}</p>
                        <p className="text-xs text-muted-foreground">{p.name_id}</p>
                      </td>
                      <td className="px-5 py-3 text-ink-muted">{p.category?.name_en ?? "—"}</td>
                      <td className="px-5 py-3">
                        <div className="flex flex-wrap gap-1.5">
                          {p.isFeatured && <Badge variant="gold">Featured</Badge>}
                          <Badge variant={p.isActive ? "success" : "muted"}>
                            {p.isActive ? "Active" : "Hidden"}
                          </Badge>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/products/${p.id}`}
                            className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-ink-muted hover:bg-muted hover:text-ink"
                          >
                            <Pencil className="size-3.5" /> Edit
                          </Link>
                          <DeleteButton id={p.id} action={deleteProduct} />
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
