import { defineRouting } from "next-intl/routing";

export const locales = ["id", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "id";

export const routing = defineRouting({
  locales,
  defaultLocale,
  // Always show the locale prefix (e.g. /id, /en) for SEO-friendly URLs.
  localePrefix: "always",
  localeDetection: true,
  // SEO-friendly localized pathnames. Keys are internal pathnames.
  pathnames: {
    "/": "/",
    "/about-us": {
      id: "/tentang-kami",
      en: "/about-us",
    },
    "/products": {
      id: "/produk",
      en: "/products",
    },
    "/products/[slug]": {
      id: "/produk/[slug]",
      en: "/products/[slug]",
    },
    "/portfolio": {
      id: "/portofolio",
      en: "/portfolio",
    },
    "/portfolio/[slug]": {
      id: "/portofolio/[slug]",
      en: "/portfolio/[slug]",
    },
    "/news": {
      id: "/berita",
      en: "/news",
    },
    "/news/[slug]": {
      id: "/berita/[slug]",
      en: "/news/[slug]",
    },
    "/videos": {
      id: "/video",
      en: "/videos",
    },
    "/downloads": {
      id: "/unduhan",
      en: "/downloads",
    },
    "/contact": {
      id: "/kontak",
      en: "/contact",
    },
  },
});

export type AppPathnames = keyof typeof routing.pathnames;
