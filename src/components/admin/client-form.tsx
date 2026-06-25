"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { upsertClient } from "@/app/admin/actions";

const CATEGORIES = ["general", "marble-factory", "warehouse", "government", "hotel"] as const;

export type ClientFormValues = {
  id: string;
  name: string;
  logoUrl: string;
  website: string;
  category: string;
  order: number;
  isActive: boolean;
};

export function ClientForm({ initial }: { initial: ClientFormValues }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [values, setValues] = useState(initial);

  function set<K extends keyof ClientFormValues>(key: K, v: ClientFormValues[K]) {
    setValues((s) => ({ ...s, [key]: v }));
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    // Checkboxes aren't in FormData when unchecked controlled — set explicitly.
    fd.set("isActive", values.isActive ? "on" : "");
    startTransition(async () => {
      const res = await upsertClient(fd);
      if (!res.ok) {
        setError(res.error ?? "Failed to save");
        return;
      }
      router.push("/admin/clients");
      router.refresh();
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <input type="hidden" name="id" value={values.id} />

      <Card>
        <CardHeader>
          <CardTitle>Client details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" value={values.name}
              onChange={(e) => set("name", e.target.value)} required />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="logoUrl">Logo URL (paste a hosted image URL)</Label>
            <Input id="logoUrl" name="logoUrl" value={values.logoUrl}
              onChange={(e) => set("logoUrl", e.target.value)} placeholder="https://…" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="website">Website</Label>
            <Input id="website" name="website" value={values.website}
              onChange={(e) => set("website", e.target.value)} placeholder="https://…" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="category">Category</Label>
            <select
              id="category"
              name="category"
              value={values.category}
              onChange={(e) => set("category", e.target.value)}
              className="flex h-11 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="order">Order</Label>
            <Input id="order" name="order" type="number" value={values.order}
              onChange={(e) => set("order", Number(e.target.value))} />
          </div>
          <div className="flex items-center sm:col-span-2">
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
          Save client
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/clients")}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
