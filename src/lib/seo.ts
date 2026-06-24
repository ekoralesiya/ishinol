import type { Metadata } from "next";
import type { Locale } from "@/i18n/routing";
import { SITE_URL, SEO_KEYWORDS } from "./constants";

interface BuildMetadataArgs {
  locale: Locale;
  title?: string;
  description?: string;
  path?: string; // localized path including locale prefix, e.g. /en/products
  image?: string;
  type?: "website" | "article";
  keywords?: string[];
}

/** Build consistent, multilingual metadata with canonical + hreflang alternates. */
export function buildMetadata({
  locale,
  title,
  description,
  path = "",
  image,
  type = "website",
  keywords,
}: BuildMetadataArgs): Metadata {
  const fullTitle = title
    ? `${title} — ISHINOL Indonesia`
    : "ISHINOL Indonesia — Premium Japanese Stone & Marble Coating";
  const desc =
    description ??
    "ISHINOL is a premium Japanese protection coating for marble, granite & natural stone. Official distributor in Indonesia.";
  const url = `${SITE_URL}${path}`;
  const ogImage = image ?? `${SITE_URL}/og-image.jpg`;

  // Build hreflang alternates by swapping the locale prefix.
  const stripped = path.replace(/^\/(id|en)/, "");
  const alternates: Record<string, string> = {
    id: `${SITE_URL}/id${stripped}`,
    en: `${SITE_URL}/en${stripped}`,
  };

  return {
    title: fullTitle,
    description: desc,
    keywords: [...SEO_KEYWORDS, ...(keywords ?? [])],
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: url,
      languages: {
        "id-ID": alternates.id,
        "en-US": alternates.en,
        "x-default": alternates.id,
      },
    },
    openGraph: {
      title: fullTitle,
      description: desc,
      url,
      siteName: "ISHINOL Indonesia",
      locale: locale === "id" ? "id_ID" : "en_US",
      type,
      images: [{ url: ogImage, width: 1200, height: 630, alt: fullTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: desc,
      images: [ogImage],
    },
    robots: { index: true, follow: true },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ISHINOL Indonesia",
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description:
      "Official distributor and trademark holder of ISHINOL premium Japanese stone, marble and granite coating in Indonesia.",
    sameAs: [
      "https://instagram.com/ishinol.indonesia",
      "https://facebook.com/ishinol.indonesia",
      "https://linkedin.com/company/ishinol-indonesia",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+6285697777292",
      contactType: "sales",
      areaServed: "ID",
      availableLanguage: ["id", "en"],
    },
  };
}
