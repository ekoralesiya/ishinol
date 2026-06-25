import { getTranslations, setRequestLocale } from "next-intl/server";
import { SectionHeading } from "@/components/sections/section-heading";
import { NewsSearch } from "@/components/news/news-search";
import { getArticles } from "@/lib/queries";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "News" });
  return buildMetadata({
    locale,
    title: t("title"),
    description: t("subtitle"),
    path: `/${locale}/news`,
  });
}

export const dynamic = "force-dynamic";

export default async function NewsPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("News");

  const articles = await getArticles();

  return (
    <main className="pt-32">
      <section className="py-16 lg:py-24">
        <div className="container-prose">
          <SectionHeading eyebrow="Journal" title={t("title")} subtitle={t("subtitle")} />
          <NewsSearch articles={articles as never} locale={locale} />
        </div>
      </section>
    </main>
  );
}
