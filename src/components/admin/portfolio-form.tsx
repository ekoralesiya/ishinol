"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { upsertProject } from "@/app/admin/actions";

export type ProjectFormValues = {
  id: string;
  slug: string;
  title_id: string;
  title_en: string;
  location: string;
  client: string;
  year: string;
  description_id: string;
  description_en: string;
  coverImage: string;
  isFeatured: boolean;
  isActive: boolean;
};

export function PortfolioForm({ initial }: { initial: ProjectFormValues }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [values, setValues] = useState(initial);

  function set<K extends keyof ProjectFormValues>(key: K, v: ProjectFormValues[K]) {
    setValues((s) => ({ ...s, [key]: v }));
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    fd.set("isFeatured", values.isFeatured ? "on" : "");
    fd.set("isActive", values.isActive ? "on" : "");
    startTransition(async () => {
      const res = await upsertProject(fd);
      if (!res.ok) {
        setError(res.error ?? "Failed to save");
        return;
      }
      router.push("/admin/portfolio");
      router.refresh();
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <input type="hidden" name="id" value={values.id} />
      <Card>
        <CardHeader><CardTitle>Project details</CardTitle></CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="title_id">Title (ID)</Label>
            <Input id="title_id" name="title_id" value={values.title_id}
              onChange={(e) => set("title_id", e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="title_en">Title (EN)</Label>
            <Input id="title_en" name="title_en" value={values.title_en}
              onChange={(e) => set("title_en", e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="client">Client</Label>
            <Input id="client" name="client" value={values.client}
              onChange={(e) => set("client", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="location">Location</Label>
            <Input id="location" name="location" value={values.location}
              onChange={(e) => set("location", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="year">Year</Label>
            <Input id="year" name="year" type="number" value={values.year}
              onChange={(e) => set("year", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="slug">Slug (optional)</Label>
            <Input id="slug" name="slug" value={values.slug}
              onChange={(e) => set("slug", e.target.value)} placeholder="auto-generated" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Description & media</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="description_id">Description (ID)</Label>
              <Textarea id="description_id" name="description_id" rows={4} value={values.description_id}
                onChange={(e) => set("description_id", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="description_en">Description (EN)</Label>
              <Textarea id="description_en" name="description_en" rows={4} value={values.description_en}
                onChange={(e) => set("description_en", e.target.value)} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="coverImage">Cover image URL</Label>
            <Input id="coverImage" name="coverImage" value={values.coverImage}
              onChange={(e) => set("coverImage", e.target.value)} placeholder="https://…" />
          </div>
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={values.isFeatured}
                onChange={(e) => set("isFeatured", e.target.checked)} className="size-4 accent-gold-600" />
              Featured
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={values.isActive}
                onChange={(e) => set("isActive", e.target.checked)} className="size-4 accent-gold-600" />
              Active
            </label>
          </div>
        </CardContent>
      </Card>

      {error && <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}

      <div className="flex gap-3">
        <Button type="submit" variant="gold" disabled={pending}>
          {pending ? <Loader2 className="animate-spin" /> : <Save />} Save project
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/portfolio")}>Cancel</Button>
      </div>
    </form>
  );
}
