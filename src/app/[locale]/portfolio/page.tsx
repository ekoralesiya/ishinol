import { getTranslations, setRequestLocale } from "next-intl/server";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/sections/section-heading";
import { ProjectCard } from "@/components/cards/project-card";
import { getProjects } from "@/lib/queries";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Portfolio" });
  return buildMetadata({
    locale,
    title: t("title"),
    description: t("subtitle"),
    path: `/${locale}/portfolio`,
  });
}

export const dynamic = "force-dynamic";

export default async function PortfolioPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Portfolio");

  const projects = await getProjects();

  return (
    <main className="pt-32">
      <section className="py-16 lg:py-24">
        <div className="container-prose">
          <SectionHeading eyebrow="Portfolio" title={t("title")} subtitle={t("subtitle")} />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, i) => (
              <Reveal key={project.slug} delay={i % 3}>
                <ProjectCard project={project as never} locale={locale} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
