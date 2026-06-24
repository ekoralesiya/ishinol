import { getTranslations, setRequestLocale } from "next-intl/server";
import { ShieldCheck, Sparkles, Clock, Award, ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { Hero } from "@/components/sections/hero";
import { SectionHeading } from "@/components/sections/section-heading";
import { BeforeAfter } from "@/components/sections/before-after";
import { Testimonials } from "@/components/sections/testimonials";
import { ProductCard } from "@/components/cards/product-card";
import { ProjectCard } from "@/components/cards/project-card";
import { ArticleCard } from "@/components/cards/article-card";
import { VideoCard } from "@/components/cards/video-card";
import {
  getHero,
  getFeaturedProducts,
  getFeaturedProjects,
  getTestimonials,
  getArticles,
  getVideos,
} from "@/lib/queries";
import { fallbackWhy } from "@/lib/fallback-content";
import { localized } from "@/lib/utils";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";

const ICONS = { ShieldCheck, Sparkles, Clock, Award } as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  return buildMetadata({ locale, path: `/${locale}` });
}

export default async function HomePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Home");

  const [hero, products, projects, testimonials, articles, videos] = await Promise.all([
    getHero(),
    getFeaturedProducts(3),
    getFeaturedProjects(3),
    getTestimonials(),
    getArticles(3),
    getVideos(true),
  ]);

  return (
    <>
      <Hero
        eyebrow={localized(hero, "eyebrow", locale) || t("heroEyebrow")}
        headline={localized(hero, "headline", locale) || t("heroHeadline")}
        subheadline={localized(hero, "subheadline", locale) || t("heroSubheadline")}
        imageUrl={(hero as { imageUrl?: string }).imageUrl}
        videoUrl={(hero as { videoUrl?: string }).videoUrl}
        ctaLabel={localized(hero, "ctaLabel", locale) || t("heroCta")}
        ctaHref="/products"
        secondaryCtaLabel={localized(hero, "secondaryCtaLabel", locale) || t("heroSecondaryCta")}
        secondaryCtaHref="/contact"
      />

      {/* About */}
      <section className="marble-bg py-24 lg:py-32">
        <div className="container-prose grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <p className="eyebrow mb-3">{t("aboutEyebrow")}</p>
            <h2 className="heading-display text-3xl text-balance sm:text-4xl lg:text-5xl">
              {t("aboutTitle")}
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-ink-muted">{t("aboutBody")}</p>
            <Button asChild variant="outline" className="mt-8">
              <Link href="/about-us">
                {t("aboutEyebrow")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </Reveal>
          <Reveal delay={1}>
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&w=1200&q=80"
                alt="ISHINOL craftsmanship"
                className="h-full w-full object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Why ISHINOL */}
      <section className="py-24 lg:py-32">
        <div className="container-prose">
          <SectionHeading title={t("whyTitle")} subtitle={t("whySubtitle")} />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {fallbackWhy.map((item, i) => {
              const Icon = ICONS[item.icon as keyof typeof ICONS] ?? ShieldCheck;
              return (
                <Reveal key={i} delay={i} className="group rounded-2xl border border-border bg-card p-8 transition-all hover:border-gold/40 hover:shadow-lg">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold/10 text-gold-700 transition-colors group-hover:bg-gold group-hover:text-white">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 font-display text-lg font-semibold text-ink">
                    {localized(item, "title", locale)}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {localized(item, "body", locale)}
                  </p>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="bg-marble-100 py-24 lg:py-32">
        <div className="container-prose">
          <SectionHeading eyebrow="Solutions" title={t("productsTitle")} subtitle={t("productsSubtitle")} />
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {products.map((p, i) => (
              <Reveal key={p.slug} delay={i}>
                <ProductCard product={p as never} locale={locale} />
              </Reveal>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button asChild variant="gold">
              <Link href="/products">
                {t("productsTitle")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 lg:py-32">
        <div className="container-prose grid items-center gap-12 lg:grid-cols-2">
          <Reveal className="order-2 lg:order-1">
            <div className="relative aspect-square overflow-hidden rounded-2xl shadow-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=80"
                alt="Protected marble surface"
                className="h-full w-full object-cover"
              />
            </div>
          </Reveal>
          <Reveal delay={1} className="order-1 lg:order-2">
            <h2 className="heading-display text-3xl text-balance sm:text-4xl lg:text-5xl">
              {t("benefitsTitle")}
            </h2>
            <ul className="mt-8 space-y-4">
              {(locale === "id"
                ? [
                    "Perlindungan permanen terhadap noda, air, dan minyak",
                    "Menjaga keindahan alami tanpa mengubah tampilan",
                    "Memperpanjang usia permukaan batu hingga puluhan tahun",
                    "Perawatan harian yang lebih mudah dan hemat",
                    "Teknologi Jepang yang ramah lingkungan",
                  ]
                : [
                    "Permanent protection against stains, water and oil",
                    "Preserves natural beauty without altering appearance",
                    "Extends stone surface life for decades",
                    "Easier, more economical daily maintenance",
                    "Eco-friendly Japanese technology",
                  ]
              ).map((b) => (
                <li key={b} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-gold-600" />
                  <span className="text-ink-muted">{b}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* Before / After */}
      <section className="bg-ink py-24 text-white lg:py-32">
        <div className="container-prose">
          <Reveal className="mx-auto mb-12 max-w-2xl text-center">
            <p className="eyebrow mb-3 text-gold-400">{t("beforeAfterSubtitle")}</p>
            <h2 className="heading-display text-3xl text-white text-balance sm:text-4xl lg:text-5xl">
              {t("beforeAfterTitle")}
            </h2>
          </Reveal>
          <Reveal delay={1}>
            <BeforeAfter
              before="https://images.unsplash.com/photo-1607344645866-009c320b63e0?auto=format&fit=crop&w=1600&q=80"
              after="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80"
              beforeLabel={t("before")}
              afterLabel={t("after")}
            />
          </Reveal>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-24 lg:py-32">
        <div className="container-prose">
          <SectionHeading eyebrow="Portfolio" title={t("projectsTitle")} subtitle={t("projectsSubtitle")} />
          <div className="grid gap-6 md:grid-cols-3">
            {projects.map((p, i) => (
              <Reveal key={p.slug} delay={i}>
                <ProjectCard project={p as never} locale={locale} />
              </Reveal>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button asChild variant="outline">
              <Link href="/portfolio">
                {t("projectsTitle")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Videos */}
      {videos.length > 0 && (
        <section className="bg-marble-100 py-24 lg:py-32">
          <div className="container-prose">
            <SectionHeading eyebrow="Watch" title={t("videosTitle")} />
            <div className="grid gap-8 md:grid-cols-2">
              {videos.slice(0, 2).map((v, i) => (
                <Reveal key={i} delay={i}>
                  <VideoCard video={v as never} locale={locale} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      <section className="py-24 lg:py-32">
        <div className="container-prose">
          <SectionHeading title={t("testimonialsTitle")} />
          <Testimonials items={testimonials as never} locale={locale} />
        </div>
      </section>

      {/* Latest News */}
      <section className="bg-marble-100 py-24 lg:py-32">
        <div className="container-prose">
          <SectionHeading eyebrow="Journal" title={t("newsTitle")} />
          <div className="grid gap-8 md:grid-cols-3">
            {articles.map((a, i) => (
              <Reveal key={a.slug} delay={i}>
                <ArticleCard article={a as never} locale={locale} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="relative overflow-hidden bg-ink py-24 text-white lg:py-32">
        <div className="container-prose relative text-center">
          <Reveal>
            <h2 className="heading-display mx-auto max-w-3xl text-3xl text-white text-balance sm:text-4xl lg:text-5xl">
              {t("contactTitle")}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-white/70">{t("contactSubtitle")}</p>
            <Button asChild variant="gold" size="lg" className="mt-8">
              <Link href="/contact">
                {t("contactTitle")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </Reveal>
        </div>
      </section>
    </>
  );
}
