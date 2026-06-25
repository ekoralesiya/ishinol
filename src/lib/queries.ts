import { prisma } from "./prisma";
import * as fb from "./fallback-content";

/**
 * Data access for the public site. Each function attempts a Prisma query and
 * falls back to curated default content if the database is empty or
 * unavailable. This keeps the site rendering during builds without a DB and
 * provides a populated demo out of the box.
 */

async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    const result = await fn();
    if (Array.isArray(result) && result.length === 0) return fallback;
    if (result == null) return fallback;
    return result;
  } catch {
    return fallback;
  }
}

export async function getHero() {
  return safe(
    async () => (await prisma.heroBanner.findFirst({
      where: { isActive: true },
      orderBy: { order: "asc" },
    })) as unknown as typeof fb.fallbackHero,
    fb.fallbackHero,
  );
}

export async function getFeaturedProducts(limit = 3) {
  return safe(async () => {
    const rows = await prisma.product.findMany({
      where: { isActive: true, isFeatured: true },
      orderBy: { order: "asc" },
      take: limit,
    });
    return rows as unknown as typeof fb.fallbackProducts;
  }, fb.fallbackProducts.slice(0, limit));
}

export async function getProducts() {
  return safe(async () => {
    const rows = await prisma.product.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      include: { category: true },
    });
    return rows as unknown as typeof fb.fallbackProducts;
  }, fb.fallbackProducts);
}

export async function getProduct(slug: string) {
  return safe(async () => {
    const row = await prisma.product.findUnique({
      where: { slug },
      include: { category: true, images: true, videos: true, documents: true },
    });
    return row as unknown as (typeof fb.fallbackProducts)[number] | null;
  }, fb.fallbackProducts.find((p) => p.slug === slug) ?? null);
}

export async function getFeaturedProjects(limit = 3) {
  return safe(async () => {
    const rows = await prisma.portfolioProject.findMany({
      where: { isActive: true, isFeatured: true },
      orderBy: { order: "asc" },
      take: limit,
    });
    return rows as unknown as typeof fb.fallbackProjects;
  }, fb.fallbackProjects.slice(0, limit));
}

export async function getProjects() {
  return safe(async () => {
    const rows = await prisma.portfolioProject.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      include: { category: true },
    });
    return rows as unknown as typeof fb.fallbackProjects;
  }, fb.fallbackProjects);
}

export async function getProject(slug: string) {
  return safe(async () => {
    const row = await prisma.portfolioProject.findUnique({
      where: { slug },
      include: { category: true, images: true, videos: true },
    });
    return row as unknown as (typeof fb.fallbackProjects)[number] | null;
  }, fb.fallbackProjects.find((p) => p.slug === slug) ?? null);
}

export async function getTestimonials() {
  return safe(async () => {
    const rows = await prisma.testimonial.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });
    return rows as unknown as typeof fb.fallbackTestimonials;
  }, fb.fallbackTestimonials);
}

export async function getArticles(limit?: number) {
  return safe(async () => {
    const rows = await prisma.article.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: "desc" },
      take: limit,
      include: { category: true },
    });
    return rows as unknown as typeof fb.fallbackArticles;
  }, limit ? fb.fallbackArticles.slice(0, limit) : fb.fallbackArticles);
}

export async function getArticle(slug: string) {
  return safe(async () => {
    const row = await prisma.article.findUnique({
      where: { slug },
      include: { category: true, tags: true, author: true },
    });
    return row as unknown as (typeof fb.fallbackArticles)[number] | null;
  }, fb.fallbackArticles.find((a) => a.slug === slug) ?? null);
}

export async function getVideos(featuredOnly = false) {
  return safe(async () => {
    const rows = await prisma.video.findMany({
      where: { isActive: true, ...(featuredOnly ? { isFeatured: true } : {}) },
      orderBy: { order: "asc" },
    });
    return rows as unknown as typeof fb.fallbackVideos;
  }, featuredOnly ? fb.fallbackVideos.filter((v) => v.isFeatured) : fb.fallbackVideos);
}

export async function getDownloads() {
  return safe(async () => {
    const rows = await prisma.download.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });
    return rows as unknown as typeof fb.fallbackDownloads;
  }, fb.fallbackDownloads);
}

export async function getClients() {
  return safe(async () => {
    const rows = await prisma.client.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });
    return rows as unknown as typeof fb.fallbackClients;
  }, fb.fallbackClients);
}

export async function getSiteSettings() {
  return safe(
    async () => await prisma.siteSettings.findUnique({ where: { id: "singleton" } }),
    null,
  );
}
