import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { getProducts, getProjects, getArticles } from "@/lib/queries";
import { localized } from "@/lib/utils";

const STATIC_PATHS = {
  "": { id: "", en: "" },
  about: { id: "tentang-kami", en: "about-us" },
  products: { id: "produk", en: "products" },
  portfolio: { id: "portofolio", en: "portfolio" },
  news: { id: "berita", en: "news" },
  videos: { id: "video", en: "videos" },
  downloads: { id: "unduhan", en: "downloads" },
  contact: { id: "kontak", en: "contact" },
};

function entry(idPath: string, enPath: string, priority = 0.7): MetadataRoute.Sitemap[number] {
  return {
    url: `${SITE_URL}/id${idPath ? `/${idPath}` : ""}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority,
    alternates: {
      languages: {
        id: `${SITE_URL}/id${idPath ? `/${idPath}` : ""}`,
        en: `${SITE_URL}/en${enPath ? `/${enPath}` : ""}`,
      },
    },
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const items: MetadataRoute.Sitemap = Object.entries(STATIC_PATHS).map(([key, v]) =>
    entry(v.id, v.en, key === "" ? 1 : 0.7),
  );

  try {
    const [products, projects, articles] = await Promise.all([
      getProducts(),
      getProjects(),
      getArticles(),
    ]);
    for (const p of products) items.push(entry(`produk/${p.slug}`, `products/${p.slug}`, 0.8));
    for (const p of projects) items.push(entry(`portofolio/${p.slug}`, `portfolio/${p.slug}`, 0.6));
    for (const a of articles) items.push(entry(`berita/${a.slug}`, `news/${a.slug}`, 0.6));
  } catch {
    // ignore — static entries still emitted
  }

  return items;
}
