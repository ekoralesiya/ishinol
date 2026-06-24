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
import { upsertArticle } from "@/app/admin/actions";

export type ArticleFormValues = {
  id: string;
  slug: string;
  title_id: string;
  title_en: string;
  excerpt_id: string;
  excerpt_en: string;
  content_id: string;
  content_en: string;
  coverImage: string;
  isPublished: boolean;
  isFeatured: boolean;
};

export function NewsForm({ initial }: { initial: ArticleFormValues }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [values, setValues] = useState(initial);

  function set<K extends keyof ArticleFormValues>(key: K, v: ArticleFormValues[K]) {
    setValues((s) => ({ ...s, [key]: v }));
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    fd.set("isPublished", values.isPublished ? "on" : "");
    fd.set("isFeatured", values.isFeatured ? "on" : "");
    startTransition(async () => {
      const res = await upsertArticle(fd);
      if (!res.ok) {
        setError(res.error ?? "Failed to save");
        return;
      }
      router.push("/admin/news");
      router.refresh();
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <input type="hidden" name="id" value={values.id} />
      <Card>
        <CardHeader><CardTitle>Article</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
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
              <Label htmlFor="excerpt_id">Excerpt (ID)</Label>
              <Textarea id="excerpt_id" name="excerpt_id" rows={2} value={values.excerpt_id}
                onChange={(e) => set("excerpt_id", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="excerpt_en">Excerpt (EN)</Label>
              <Textarea id="excerpt_en" name="excerpt_en" rows={2} value={values.excerpt_en}
                onChange={(e) => set("excerpt_en", e.target.value)} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="slug">Slug (optional)</Label>
            <Input id="slug" name="slug" value={values.slug}
              onChange={(e) => set("slug", e.target.value)} placeholder="auto-generated" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="coverImage">Cover image URL</Label>
            <Input id="coverImage" name="coverImage" value={values.coverImage}
              onChange={(e) => set("coverImage", e.target.value)} placeholder="https://…" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Content</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="content_en">Content (EN)</Label>
              <div className="flex gap-2">
                <AiAssistButton action="generate-article" label="Draft"
                  getText={() => values.content_en || values.title_en}
                  onResult={(t) => set("content_en", t)} />
                <AiAssistButton action="rewrite" label="Rewrite"
                  getText={() => values.content_en}
                  onResult={(t) => set("content_en", t)} />
              </div>
            </div>
            <Textarea id="content_en" name="content_en" rows={8} value={values.content_en}
              onChange={(e) => set("content_en", e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="content_id">Content (ID)</Label>
              <AiAssistButton action="translate" label="Translate from EN" targetLang="id"
                getText={() => values.content_en}
                onResult={(t) => set("content_id", t)} />
            </div>
            <Textarea id="content_id" name="content_id" rows={8} value={values.content_id}
              onChange={(e) => set("content_id", e.target.value)} />
          </div>
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={values.isPublished}
                onChange={(e) => set("isPublished", e.target.checked)} className="size-4 accent-gold-600" />
              Published
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={values.isFeatured}
                onChange={(e) => set("isFeatured", e.target.checked)} className="size-4 accent-gold-600" />
              Featured
            </label>
          </div>
        </CardContent>
      </Card>

      {error && <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}

      <div className="flex gap-3">
        <Button type="submit" variant="gold" disabled={pending}>
          {pending ? <Loader2 className="animate-spin" /> : <Save />} Save article
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/news")}>Cancel</Button>
      </div>
    </form>
  );
}
