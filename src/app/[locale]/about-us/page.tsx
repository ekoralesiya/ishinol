import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  ArrowRight,
  BadgeCheck,
  Eye,
  Target,
  Hammer,
  Handshake,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/sections/section-heading";
import { fallbackAbout } from "@/lib/fallback-content";
import { localized } from "@/lib/utils";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "About" });
  return buildMetadata({
    locale,
    title: t("title"),
    description: t("intro"),
    path: `/${locale}/about-us`,
  });
}

const VALUE_ICONS = [BadgeCheck, Hammer, Handshake, Sparkles] as const;

export default async function AboutPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("About");
  const tc = await getTranslations("Common");

  const distributor = localized(fallbackAbout, "distributor", locale);
  const vision = localized(fallbackAbout, "vision", locale);
  const mission = localized(fallbackAbout, "mission", locale);
  const history = localized(fallbackAbout, "history", locale);

  const values = [0, 1, 2, 3].map((i) => ({
    title: t(`value${i + 1}Title`),
    body: t(`value${i + 1}Body`),
    Icon: VALUE_ICONS[i],
  }));

  const timeline = [
    { year: "2018", text: history },
    { year: "2021", text: t("japanBody") },
    { year: "2024", text: mission },
  ];

  return (
    <main className="pt-32">
      {/* Hero / Intro */}
      <section className="marble-bg py-20 lg:py-28">
        <div className="container-prose grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <p className="eyebrow mb-3">{t("eyebrow")}</p>
            <h1 className="heading-display text-4xl text-balance sm:text-5xl lg:text-6xl">
              {t("title")}
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-ink-muted">{t("intro")}</p>
            <Button asChild variant="gold" className="mt-8">
              <Link href="/contact">
                {t("ctaButton")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </Reveal>
          <Reveal delay={1}>
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&w=1200&q=80"
                alt="ISHINOL premium marble architecture"
                className="h-full w-full object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Distributor statement */}
      <section className="py-24 lg:py-32">
        <div className="container-prose">
          <SectionHeading eyebrow="ISHINOL" title={t("distributorTitle")} />
          <Reveal>
            <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-card p-8 text-center shadow-sm lg:p-12">
              <ShieldCheck className="mx-auto h-10 w-10 text-gold-600" />
              <p className="mt-6 text-xl leading-relaxed text-ink-muted text-balance">
                {distributor}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Relationship with ISHINOL Japan */}
      <section className="bg-marble-100 py-24 lg:py-32">
        <div className="container-prose grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1545048702-79362596cdc9?auto=format&fit=crop&w=1200&q=80"
                alt="Japanese craftsmanship"
                className="h-full w-full object-cover"
              />
            </div>
          </Reveal>
          <Reveal delay={1}>
            <p className="eyebrow mb-3">Japan</p>
            <h2 className="heading-display text-3xl text-balance sm:text-4xl lg:text-5xl">
              {t("japanTitle")}
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-ink-muted">{t("japanBody")}</p>
          </Reveal>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-24 lg:py-32">
        <div className="container-prose">
          <div className="grid gap-8 lg:grid-cols-2">
            <Reveal>
              <div className="h-full rounded-2xl border border-border bg-card p-8 shadow-sm lg:p-10">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold/10 text-gold-700">
                  <Eye className="h-6 w-6" />
                </div>
                <h3 className="mt-5 font-display text-2xl font-semibold text-ink">
                  {t("visionTitle")}
                </h3>
                <p className="mt-3 text-lg leading-relaxed text-ink-muted">{vision}</p>
              </div>
            </Reveal>
            <Reveal delay={1}>
              <div className="h-full rounded-2xl border border-border bg-card p-8 shadow-sm lg:p-10">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold/10 text-gold-700">
                  <Target className="h-6 w-6" />
                </div>
                <h3 className="mt-5 font-display text-2xl font-semibold text-ink">
                  {t("missionTitle")}
                </h3>
                <p className="mt-3 text-lg leading-relaxed text-ink-muted">{mission}</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Company history timeline */}
      <section className="bg-marble-100 py-24 lg:py-32">
        <div className="container-prose">
          <SectionHeading title={t("historyTitle")} />
          <div className="mx-auto max-w-3xl">
            {timeline.map((item, i) => (
              <Reveal key={item.year} delay={i}>
                <div className="relative flex gap-6 pb-10 last:pb-0">
                  <div className="flex flex-col items-center">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gold text-sm font-semibold text-ink">
                      {item.year}
                    </span>
                    {i < timeline.length - 1 && (
                      <span className="mt-2 w-px flex-1 bg-border" />
                    )}
                  </div>
                  <p className="pt-2 text-lg leading-relaxed text-ink-muted">{item.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Corporate values */}
      <section className="py-24 lg:py-32">
        <div className="container-prose">
          <SectionHeading title={t("valuesTitle")} />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value, i) => (
              <Reveal
                key={value.title}
                delay={i}
                className="group rounded-2xl border border-border bg-card p-8 transition-all hover:border-gold/40 hover:shadow-lg"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold/10 text-gold-700 transition-colors group-hover:bg-gold group-hover:text-white">
                  <value.Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold text-ink">{value.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{value.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-ink py-24 text-white lg:py-32">
        <div className="container-prose relative text-center">
          <Reveal>
            <h2 className="heading-display mx-auto max-w-3xl text-3xl text-white text-balance sm:text-4xl lg:text-5xl">
              {t("ctaTitle")}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-white/70">{t("ctaBody")}</p>
            <Button asChild variant="gold" size="lg" className="mt-8">
              <Link href="/contact">
                {tc("learnMore")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
