import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowLeft, MapPin, Calendar, Building2 } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/sections/section-heading";
import { BeforeAfter } from "@/components/sections/before-after";
import { VideoCard } from "@/components/cards/video-card";
import { getProject } from "@/lib/queries";
import { localized } from "@/lib/utils";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";

type Img = { url?: string; alt_id?: string; alt_en?: string };
type Vid = { url: string; source?: string; thumbnail?: string | null };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  const project = await getProject(slug);
  if (!project) return buildMetadata({ locale, path: `/${locale}/portfolio/${slug}` });
  return buildMetadata({
    locale,
    title: localized(project, "title", locale),
    description: localized(project, "description", locale),
    path: `/${locale}/portfolio/${slug}`,
    image: (project as { coverImage?: string }).coverImage,
  });
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Portfolio");
  const tc = await getTranslations("Common");
  const th = await getTranslations("Home");

  const project = await getProject(slug);
  if (!project) notFound();

  const pr = project as Record<string, unknown> & {
    slug: string;
    coverImage?: string;
    location?: string;
    year?: number;
    client?: string;
    beforeImage?: string;
    afterImage?: string;
    images?: Img[];
    videos?: Vid[];
  };

  const title = localized(pr, "title", locale);
  const description = localized(pr, "description", locale);
  const images = Array.isArray(pr.images) ? pr.images : [];
  const videos = Array.isArray(pr.videos) ? pr.videos : [];

  const meta = [
    pr.location && { Icon: MapPin, label: tc("location"), value: pr.location },
    pr.year && { Icon: Calendar, label: tc("year"), value: String(pr.year) },
    pr.client && { Icon: Building2, label: tc("client"), value: pr.client },
  ].filter(Boolean) as { Icon: typeof MapPin; label: string; value: string }[];

  return (
    <main className="pt-32">
      {/* Breadcrumb */}
      <div className="container-prose pt-2">
        <Link
          href="/portfolio"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-gold-700"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("title")}
        </Link>
      </div>

      {/* Hero */}
      <section className="py-12 lg:py-16">
        <div className="container-prose">
          <Reveal>
            <h1 className="heading-display text-4xl text-balance sm:text-5xl lg:text-6xl">
              {title}
            </h1>
            {meta.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-6">
                {meta.map((m) => (
                  <span key={m.label} className="flex items-center gap-2 text-sm text-ink-muted">
                    <m.Icon className="h-4 w-4 text-gold-600" />
                    <span className="font-medium text-ink">{m.label}:</span> {m.value}
                  </span>
                ))}
              </div>
            )}
          </Reveal>
          {pr.coverImage && (
            <Reveal delay={1}>
              <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl bg-muted shadow-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={pr.coverImage} alt={title} className="h-full w-full object-cover" />
              </div>
            </Reveal>
          )}
          {description && (
            <Reveal delay={2}>
              <p className="mt-8 max-w-3xl text-lg leading-relaxed text-ink-muted">{description}</p>
            </Reveal>
          )}
        </div>
      </section>

      {/* Before / After */}
      {pr.beforeImage && pr.afterImage && (
        <section className="bg-ink py-20 text-white lg:py-28">
          <div className="container-prose">
            <Reveal className="mx-auto mb-10 max-w-2xl text-center">
              <h2 className="heading-display text-3xl text-white text-balance sm:text-4xl">
                {th("beforeAfterTitle")}
              </h2>
            </Reveal>
            <Reveal delay={1}>
              <BeforeAfter
                before={pr.beforeImage}
                after={pr.afterImage}
                beforeLabel={th("before")}
                afterLabel={th("after")}
              />
            </Reveal>
          </div>
        </section>
      )}

      {/* Gallery */}
      {images.length > 0 && (
        <section className="py-20 lg:py-28">
          <div className="container-prose">
            <SectionHeading title={t("gallery")} />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {images.map((img, i) => (
                <Reveal key={i} delay={i % 3}>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-muted shadow-sm">
                    {img.url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={img.url}
                        alt={localized(img, "alt", locale) || title}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Videos */}
      {videos.length > 0 && (
        <section className="bg-marble-100 py-20 lg:py-28">
          <div className="container-prose">
            <SectionHeading eyebrow="Watch" title={th("videosTitle")} />
            <div className="grid gap-8 md:grid-cols-2">
              {videos.map((video, i) => (
                <Reveal key={i} delay={i % 2}>
                  <VideoCard video={video as never} locale={locale} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
