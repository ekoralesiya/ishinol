"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AiAssistButton } from "@/components/admin/ai-assist-button";
import { upsertProduct } from "@/app/admin/actions";

type Category = { id: string; name_en: string };

export type ProductFormValues = {
  id: string;
  slug: string;
  name_id: string;
  name_en: string;
  tagline_id: string;
  tagline_en: string;
  description_id: string;
  description_en: string;
  features_id: string;
  features_en: string;
  coverImage: string;
  categoryId: string;
  isFeatured: boolean;
  isActive: boolean;
};

export function ProductForm({
  initial,
  categories,
}: {
  initial: ProductFormValues;
  categories: Category[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [values, setValues] = useState(initial);

  function set<K extends keyof ProductFormValues>(key: K, v: ProductFormValues[K]) {
    setValues((s) => ({ ...s, [key]: v }));
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    // Checkboxes aren't in FormData when unchecked controlled — set explicitly.
    fd.set("isFeatured", values.isFeatured ? "on" : "");
    fd.set("isActive", values.isActive ? "on" : "");
    startTransition(async () => {
      const res = await upsertProduct(fd);
      if (!res.ok) {
        setError(res.error ?? "Failed to save");
        return;
      }
      router.push("/admin/products");
      router.refresh();
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <input type="hidden" name="id" value={values.id} />

      <Card>
        <CardHeader>
          <CardTitle>Basic information</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="name_id">Name (Indonesian)</Label>
            <Input id="name_id" name="name_id" value={values.name_id}
              onChange={(e) => set("name_id", e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="name_en">Name (English)</Label>
            <Input id="name_en" name="name_en" value={values.name_en}
              onChange={(e) => set("name_en", e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="tagline_id">Tagline (ID)</Label>
            <Input id="tagline_id" name="tagline_id" value={values.tagline_id}
              onChange={(e) => set("tagline_id", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="tagline_en">Tagline (EN)</Label>
            <Input id="tagline_en" name="tagline_en" value={values.tagline_en}
              onChange={(e) => set("tagline_en", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="slug">Slug (optional — auto from name)</Label>
            <Input id="slug" name="slug" value={values.slug}
              onChange={(e) => set("slug", e.target.value)} placeholder="auto-generated" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="categoryId">Category</Label>
            <select
              id="categoryId"
              name="categoryId"
              value={values.categoryId}
              onChange={(e) => set("categoryId", e.target.value)}
              className="flex h-11 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">— None —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name_en}</option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="description_en">Description (English)</Label>
              <AiAssistButton
                action="generate-product-description"
                label="Generate"
                getText={() =>
                  values.description_en || `${values.name_en} ${values.tagline_en}`.trim()
                }
                onResult={(t) => set("description_en", t)}
              />
            </div>
            <Textarea id="description_en" name="description_en" rows={4} value={values.description_en}
              onChange={(e) => set("description_en", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="description_id">Description (Indonesian)</Label>
              <AiAssistButton
                action="translate"
                label="Translate from EN"
                targetLang="id"
                getText={() => values.description_en}
                onResult={(t) => set("description_id", t)}
              />
            </div>
            <Textarea id="description_id" name="description_id" rows={4} value={values.description_id}
              onChange={(e) => set("description_id", e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Features</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="features_id">Features ID (one per line)</Label>
            <Textarea id="features_id" name="features_id" rows={5} value={values.features_id}
              onChange={(e) => set("features_id", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="features_en">Features EN (one per line)</Label>
            <Textarea id="features_en" name="features_en" rows={5} value={values.features_en}
              onChange={(e) => set("features_en", e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Media & visibility</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="coverImage">Cover image URL</Label>
            <Input id="coverImage" name="coverImage" value={values.coverImage}
              onChange={(e) => set("coverImage", e.target.value)} placeholder="https://…" />
          </div>
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={values.isFeatured}
                onChange={(e) => set("isFeatured", e.target.checked)}
                className="size-4 accent-gold-600" />
              Featured
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={values.isActive}
                onChange={(e) => set("isActive", e.target.checked)}
                className="size-4 accent-gold-600" />
              Active (visible on site)
            </label>
          </div>
        </CardContent>
      </Card>

      {error && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
      )}

      <div className="flex gap-3">
        <Button type="submit" variant="gold" disabled={pending}>
          {pending ? <Loader2 className="animate-spin" /> : <Save />}
          Save product
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/products")}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
