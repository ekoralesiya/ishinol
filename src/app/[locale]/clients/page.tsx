import { getTranslations, setRequestLocale } from "next-intl/server";
import { ExternalLink, Building2 } from "lucide-react";
import { SectionHeading } from "@/components/sections/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { getClients } from "@/lib/queries";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Clients" });
  return buildMetadata({
    locale,
    title: t("title"),
    description: t("subtitle"),
    path: `/${locale}/${locale === "id" ? "klien" : "clients"}`,
  });
}

export default async function ClientsPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Clients");
  const clients = await getClients();

  return (
    <div className="marble-bg min-h-screen pt-32">
      <div className="container-prose pb-24">
        <SectionHeading eyebrow="Trusted by" title={t("title")} subtitle={t("subtitle")} />

        {clients.length === 0 ? (
          <Reveal className="mx-auto max-w-md rounded-2xl border border-dashed border-border bg-white/60 p-12 text-center">
            <Building2 className="mx-auto h-10 w-10 text-gold/40" />
            <p className="mt-4 text-muted-foreground">{t("empty")}</p>
          </Reveal>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {clients.map((c, i) => {
              const card = (
                <div className="group flex h-32 items-center justify-center rounded-2xl border border-border bg-white p-6 transition-all hover:-translate-y-1 hover:border-gold/40 hover:shadow-lg">
                  {c.logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={c.logoUrl}
                      alt={c.name}
                      className="max-h-16 max-w-full object-contain opacity-80 grayscale transition-all group-hover:opacity-100 group-hover:grayscale-0"
                    />
                  ) : (
                    <span className="text-center font-display text-lg font-semibold text-ink">
                      {c.name}
                    </span>
                  )}
                </div>
              );
              return (
                <Reveal key={c.id ?? i} delay={i % 4}>
                  {c.website ? (
                    <a
                      href={c.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative block"
                      title={c.name}
                    >
                      {card}
                      <span className="absolute right-3 top-3 text-ink/30 opacity-0 transition-opacity group-hover:opacity-100">
                        <ExternalLink className="h-4 w-4" />
                      </span>
                    </a>
                  ) : (
                    card
                  )}
                </Reveal>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
