import { getTranslations, setRequestLocale } from "next-intl/server";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/sections/section-heading";
import { VideoCard } from "@/components/cards/video-card";
import { getVideos } from "@/lib/queries";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Videos" });
  return buildMetadata({
    locale,
    title: t("title"),
    description: t("subtitle"),
    path: `/${locale}/videos`,
  });
}

export default async function VideosPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Videos");

  const videos = await getVideos();

  return (
    <main className="pt-32">
      <section className="py-16 lg:py-24">
        <div className="container-prose">
          <SectionHeading eyebrow="Watch" title={t("title")} subtitle={t("subtitle")} />
          <div className="grid gap-8 md:grid-cols-2">
            {videos.map((video, i) => (
              <Reveal key={i} delay={i % 2}>
                <VideoCard video={video as never} locale={locale} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
