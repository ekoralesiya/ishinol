import { getTranslations, setRequestLocale } from "next-intl/server";
import { Download, FileText } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/sections/section-heading";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getDownloads } from "@/lib/queries";
import { localized, formatBytes } from "@/lib/utils";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";

const CATEGORY_ORDER = [
  "brochure",
  "catalog",
  "certificate",
  "datasheet",
  "documentation",
] as const;

const CATEGORY_LABELS: Record<string, { id: string; en: string }> = {
  brochure: { id: "Brosur", en: "Brochures" },
  catalog: { id: "Katalog", en: "Catalogs" },
  certificate: { id: "Sertifikat", en: "Certificates" },
  datasheet: { id: "Lembar Data", en: "Datasheets" },
  documentation: { id: "Dokumentasi", en: "Documentation" },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Downloads" });
  return buildMetadata({
    locale,
    title: t("title"),
    description: t("subtitle"),
    path: `/${locale}/downloads`,
  });
}

type DownloadItem = Record<string, unknown> & {
  category?: string;
  fileUrl?: string;
  fileSize?: number | null;
};

export default async function DownloadsPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Downloads");
  const tc = await getTranslations("Common");

  const downloads = (await getDownloads()) as DownloadItem[];

  const grouped = new Map<string, DownloadItem[]>();
  for (const item of downloads) {
    const key = item.category ?? "documentation";
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(item);
  }

  const orderedKeys = [
    ...CATEGORY_ORDER.filter((c) => grouped.has(c)),
    ...[...grouped.keys()].filter((c) => !CATEGORY_ORDER.includes(c as never)),
  ];

  return (
    <main className="pt-32">
      <section className="py-16 lg:py-24">
        <div className="container-prose">
          <SectionHeading title={t("title")} subtitle={t("subtitle")} />

          <div className="space-y-14">
            {orderedKeys.map((key) => {
              const items = grouped.get(key) ?? [];
              const label = CATEGORY_LABELS[key]?.[locale] ?? key;
              return (
                <div key={key}>
                  <div className="mb-6 flex items-center gap-3">
                    <h2 className="font-display text-2xl font-semibold text-ink">{label}</h2>
                    <Badge variant="gold">{items.length}</Badge>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {items.map((item, i) => (
                      <Reveal key={i} delay={i % 2}>
                        <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-5 transition-all hover:border-gold/40 hover:shadow-md">
                          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gold/10 text-gold-700">
                            <FileText className="h-6 w-6" />
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-medium text-ink">
                              {localized(item, "title", locale)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {t("fileSize")}: {formatBytes(item.fileSize)}
                            </p>
                          </div>
                          <Button asChild variant="outline" size="sm">
                            <a href={item.fileUrl} download>
                              <Download className="h-4 w-4" />
                              {tc("download")}
                            </a>
                          </Button>
                        </div>
                      </Reveal>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
