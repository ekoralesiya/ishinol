import { getTranslations, setRequestLocale } from "next-intl/server";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/sections/section-heading";
import { ProductCard } from "@/components/cards/product-card";
import { getProducts } from "@/lib/queries";
import { buildMetadata } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Products" });
  return buildMetadata({
    locale,
    title: t("title"),
    description: t("subtitle"),
    path: `/${locale}/products`,
  });
}

export default async function ProductsPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Products");

  const products = await getProducts();

  return (
    <main className="pt-32">
      <section className="py-16 lg:py-24">
        <div className="container-prose">
          <SectionHeading eyebrow="Solutions" title={t("title")} subtitle={t("subtitle")} />
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product, i) => (
              <Reveal key={product.slug} delay={i % 3}>
                <ProductCard product={product as never} locale={locale} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
