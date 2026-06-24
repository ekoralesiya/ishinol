import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/ui/reveal";
import { getArticle } from "@/lib/queries";
import { localized, formatDate } from "@/lib/utils";
import { buildMetadata } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  const article = await getArticle(slug);
  if (!article) return buildMetadata({ locale, path: `/${locale}/news/${slug}` });
  return buildMetadata({
    locale,
    title: localized(article, "title", locale),
    description: localized(article, "excerpt", locale),
    path: `/${locale}/news/${slug}`,
    image: (article as { coverImage?: string }).coverImage,
    type: "article",
  });
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("News");

  const article = await getArticle(slug);
  if (!article) notFound();

  const a = article as Record<string, unknown> & {
    slug: string;
    coverImage?: string;
    publishedAt?: string | Date;
    author?: { name?: string } | string | null;
  };

  const title = localized(a, "title", locale);
  const content = localized(a, "content", locale);
  const authorName =
    typeof a.author === "string" ? a.author : a.author?.name ?? "";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: localized(a, "excerpt", locale),
    image: a.coverImage ? [a.coverImage] : undefined,
    datePublished: a.publishedAt ? new Date(a.publishedAt).toISOString() : undefined,
    author: authorName ? { "@type": "Person", name: authorName } : undefined,
    publisher: { "@type": "Organization", name: "ISHINOL Indonesia" },
    mainEntityOfPage: `${SITE_URL}/${locale}/news/${slug}`,
  };

  return (
    <main className="pt-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="py-12 lg:py-16">
        <div className="container-prose">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-gold-700"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("title")}
          </Link>

          <Reveal>
            <header className="mx-auto mt-8 max-w-3xl">
              <h1 className="heading-display text-4xl text-balance sm:text-5xl">{title}</h1>
              <div className="mt-6 flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
                {a.publishedAt && (
                  <span className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gold-600" />
                    {formatDate(a.publishedAt, locale)}
                  </span>
                )}
                {authorName && (
                  <span className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gold-600" />
                    {t("by")} {authorName}
                  </span>
                )}
              </div>
            </header>
          </Reveal>

          {a.coverImage && (
            <Reveal delay={1}>
              <div className="relative mx-auto mt-8 aspect-[16/9] max-w-4xl overflow-hidden rounded-2xl bg-muted shadow-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={a.coverImage} alt={title} className="h-full w-full object-cover" />
              </div>
            </Reveal>
          )}

          {content && (
            <Reveal delay={2}>
              <div
                className="mx-auto mt-12 max-w-3xl space-y-5 text-lg leading-relaxed text-ink-muted [&_a]:text-gold-700 [&_a]:underline [&_h2]:heading-display [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:text-ink [&_h3]:mt-8 [&_h3]:font-display [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-ink [&_img]:rounded-xl [&_li]:ml-5 [&_li]:list-disc [&_strong]:text-ink [&_ul]:space-y-2"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </Reveal>
          )}
        </div>
      </article>
    </main>
  );
}
