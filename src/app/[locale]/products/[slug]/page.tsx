import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowLeft, ArrowRight, CheckCircle2, Download, FileText } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/sections/section-heading";
import { ProductCard } from "@/components/cards/product-card";
import { getProduct, getProducts } from "@/lib/queries";
import { localized, formatBytes } from "@/lib/utils";
import { buildMetadata } from "@/lib/seo";
import { SITE_URL } from "@/lib/constants";
import type { Locale } from "@/i18n/routing";

type Spec = { label_id?: string; label_en?: string; value_id?: string; value_en?: string };
type Doc = { title_id?: string; title_en?: string; fileUrl?: string; fileSize?: number | null };
type Img = { url?: string; alt_id?: string; alt_en?: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  const product = await getProduct(slug);
  if (!product) return buildMetadata({ locale, path: `/${locale}/products/${slug}` });
  const name = localized(product, "name", locale);
  const description = localized(product, "tagline", locale) || localized(product, "description", locale);
  return buildMetadata({
    locale,
    title: name,
    description,
    path: `/${locale}/products/${slug}`,
    image: (product as { coverImage?: string }).coverImage,
  });
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Products");
  const tc = await getTranslations("Common");

  const product = await getProduct(slug);
  if (!product) notFound();

  const p = product as Record<string, unknown> & {
    slug: string;
    coverImage?: string;
    features_id?: string[];
    features_en?: string[];
    benefits_id?: string[];
    benefits_en?: string[];
    specifications?: Spec[];
    images?: Img[];
    documents?: Doc[];
  };

  const name = localized(p, "name", locale);
  const tagline = localized(p, "tagline", locale);
  const description = localized(p, "description", locale);
  const features = (locale === "id" ? p.features_id : p.features_en) ?? [];
  const benefits = (locale === "id" ? p.benefits_id : p.benefits_en) ?? [];
  const specifications = Array.isArray(p.specifications) ? p.specifications : [];
  const images = Array.isArray(p.images) ? p.images : [];
  const documents = Array.isArray(p.documents) ? p.documents : [];

  const allProducts = await getProducts();
  const related = allProducts.filter((item) => item.slug !== slug).slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    image: p.coverImage ? [p.coverImage] : undefined,
    brand: { "@type": "Brand", name: "ISHINOL" },
    url: `${SITE_URL}/${locale}/products/${slug}`,
  };

  return (
    <main className="pt-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb */}
      <div className="container-prose pt-2">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-gold-700"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("title")}
        </Link>
      </div>

      {/* Hero */}
      <section className="py-12 lg:py-16">
        <div className="container-prose grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted shadow-2xl">
              {p.coverImage && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.coverImage} alt={name} className="h-full w-full object-cover" />
              )}
            </div>
          </Reveal>
          <Reveal delay={1}>
            <h1 className="heading-display text-4xl text-balance sm:text-5xl">{name}</h1>
            {tagline && <p className="mt-4 text-xl text-gold-700">{tagline}</p>}
            {description && (
              <p className="mt-6 text-lg leading-relaxed text-ink-muted">{description}</p>
            )}
            <Button asChild variant="gold" size="lg" className="mt-8">
              <Link href="/contact">
                {t("inquire")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </Reveal>
        </div>
      </section>

      {/* Features & Benefits */}
      {(features.length > 0 || benefits.length > 0) && (
        <section className="bg-marble-100 py-20 lg:py-28">
          <div className="container-prose grid gap-12 lg:grid-cols-2">
            {features.length > 0 && (
              <Reveal>
                <h2 className="heading-display text-2xl sm:text-3xl">{t("features")}</h2>
                <ul className="mt-6 space-y-4">
                  {features.map((f) => (
                    <li key={f} className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-gold-600" />
                      <span className="text-ink-muted">{f}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            )}
            {benefits.length > 0 && (
              <Reveal delay={1}>
                <h2 className="heading-display text-2xl sm:text-3xl">{t("benefits")}</h2>
                <ul className="mt-6 space-y-4">
                  {benefits.map((b) => (
                    <li key={b} className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-gold-600" />
                      <span className="text-ink-muted">{b}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            )}
          </div>
        </section>
      )}

      {/* Specifications */}
      {specifications.length > 0 && (
        <section className="py-20 lg:py-28">
          <div className="container-prose">
            <SectionHeading align="left" title={t("specifications")} />
            <Reveal>
              <div className="overflow-hidden rounded-2xl border border-border">
                <table className="w-full text-left text-sm">
                  <tbody>
                    {specifications.map((spec, i) => (
                      <tr
                        key={i}
                        className="border-b border-border last:border-0 odd:bg-marble-100/60"
                      >
                        <th className="w-1/3 px-6 py-4 font-medium text-ink">
                          {localized(spec, "label", locale)}
                        </th>
                        <td className="px-6 py-4 text-ink-muted">
                          {localized(spec, "value", locale)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* Gallery */}
      {images.length > 0 && (
        <section className="bg-marble-100 py-20 lg:py-28">
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
                        alt={localized(img, "alt", locale) || name}
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

      {/* Downloads */}
      {documents.length > 0 && (
        <section className="py-20 lg:py-28">
          <div className="container-prose">
            <SectionHeading align="left" title={t("downloads")} />
            <div className="grid gap-4 sm:grid-cols-2">
              {documents.map((doc, i) => (
                <Reveal key={i} delay={i % 2}>
                  <a
                    href={doc.fileUrl}
                    download
                    className="flex items-center gap-4 rounded-xl border border-border bg-card p-5 transition-all hover:border-gold/40 hover:shadow-md"
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-gold/10 text-gold-700">
                      <FileText className="h-5 w-5" />
                    </span>
                    <span className="flex-1">
                      <span className="block font-medium text-ink">
                        {localized(doc, "title", locale)}
                      </span>
                      <span className="block text-xs text-muted-foreground">
                        {formatBytes(doc.fileSize)}
                      </span>
                    </span>
                    <Download className="h-5 w-5 text-muted-foreground" />
                  </a>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related products */}
      {related.length > 0 && (
        <section className="bg-marble-100 py-20 lg:py-28">
          <div className="container-prose">
            <SectionHeading title={tc("relatedProducts")} />
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {related.map((item, i) => (
                <Reveal key={item.slug} delay={i % 3}>
                  <ProductCard product={item as never} locale={locale} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-ink py-20 text-center text-white lg:py-28">
        <div className="container-prose">
          <Reveal>
            <Button asChild variant="gold" size="lg">
              <Link href="/contact">
                {t("inquire")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
