import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import {
  fallbackHero,
  fallbackProducts,
  fallbackProjects,
  fallbackTestimonials,
  fallbackArticles,
  fallbackVideos,
  fallbackDownloads,
  fallbackAbout,
} from "../src/lib/fallback-content";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱  Seeding ISHINOL Indonesia database…");

  // ── Users ──────────────────────────────────────────────
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@ishinol.co.id";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "Ishinol#2026";
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { passwordHash, role: "SUPER_ADMIN", isActive: true },
    create: {
      name: "Super Admin",
      email: adminEmail,
      passwordHash,
      role: "SUPER_ADMIN",
    },
  });

  await prisma.user.upsert({
    where: { email: "editor@ishinol.co.id" },
    update: {},
    create: {
      name: "Content Editor",
      email: "editor@ishinol.co.id",
      passwordHash: await bcrypt.hash("Editor#2026", 12),
      role: "EDITOR",
    },
  });
  console.log(`   ✓ Users (super admin: ${adminEmail})`);

  // ── Site settings ──────────────────────────────────────
  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      companyName: "ISHINOL Indonesia",
      tagline_id: "Perlindungan permukaan premium dari Jepang",
      tagline_en: "Premium Japanese surface protection",
      about_id: fallbackAbout.distributor_id,
      about_en: fallbackAbout.distributor_en,
      addressLine: "Jakarta, Indonesia",
      city: "Jakarta",
      email: "info@ishinol.co.id",
      phone: "+62 856-9777-7292",
      whatsapp: "6285697777292",
      instagramUrl: "https://instagram.com/ishinol.indonesia",
      facebookUrl: "https://facebook.com/ishinol.indonesia",
      linkedinUrl: "https://linkedin.com/company/ishinol-indonesia",
      youtubeUrl: "https://youtube.com/@ishinol",
    },
  });
  console.log("   ✓ Site settings");

  // ── Hero ───────────────────────────────────────────────
  const existingHero = await prisma.heroBanner.count();
  if (existingHero === 0) {
    await prisma.heroBanner.create({ data: { ...fallbackHero, order: 0 } });
  }
  console.log("   ✓ Hero banner");

  // ── Product categories + products ──────────────────────
  const categoryMap: Record<string, string> = {};
  for (const [slug, names] of Object.entries({
    coating: { id: "Pelapis", en: "Coating" },
    restoration: { id: "Restorasi", en: "Restoration" },
    safety: { id: "Keamanan", en: "Safety" },
  })) {
    const cat = await prisma.productCategory.upsert({
      where: { slug },
      update: {},
      create: { slug, name_id: names.id, name_en: names.en },
    });
    categoryMap[slug] = cat.id;
  }

  for (const [i, p] of fallbackProducts.entries()) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        slug: p.slug,
        categoryId: categoryMap[p.category] ?? null,
        name_id: p.name_id,
        name_en: p.name_en,
        tagline_id: p.tagline_id,
        tagline_en: p.tagline_en,
        description_id: p.description_id,
        description_en: p.description_en,
        features_id: p.features_id,
        features_en: p.features_en,
        benefits_id: p.benefits_id,
        benefits_en: p.benefits_en,
        specifications: p.specifications,
        coverImage: p.coverImage,
        isFeatured: p.isFeatured,
        order: i,
        images: {
          create: [{ url: p.coverImage, order: 0 }],
        },
      },
    });
  }
  console.log(`   ✓ ${fallbackProducts.length} products`);

  // ── Portfolio ──────────────────────────────────────────
  const portfolioCats: Record<string, string> = {};
  for (const [slug, names] of Object.entries({
    residence: { id: "Hunian", en: "Residence" },
    hotel: { id: "Hotel", en: "Hotel" },
    office: { id: "Kantor", en: "Office" },
  })) {
    const cat = await prisma.portfolioCategory.upsert({
      where: { slug },
      update: {},
      create: { slug, name_id: names.id, name_en: names.en },
    });
    portfolioCats[slug] = cat.id;
  }

  for (const [i, p] of fallbackProjects.entries()) {
    await prisma.portfolioProject.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        slug: p.slug,
        categoryId: portfolioCats[p.category] ?? null,
        title_id: p.title_id,
        title_en: p.title_en,
        location: p.location,
        year: p.year,
        description_id: p.description_id,
        description_en: p.description_en,
        coverImage: p.coverImage,
        beforeImage:
          "https://images.unsplash.com/photo-1607344645866-009c320b63e0?auto=format&fit=crop&w=1600&q=80",
        afterImage: p.coverImage,
        isFeatured: true,
        order: i,
        images: { create: [{ url: p.coverImage, order: 0 }] },
      },
    });
  }
  console.log(`   ✓ ${fallbackProjects.length} portfolio projects`);

  // ── Articles ───────────────────────────────────────────
  const articleCats: Record<string, string> = {};
  for (const [slug, names] of Object.entries({
    tips: { id: "Tips", en: "Tips" },
    technology: { id: "Teknologi", en: "Technology" },
    "case-study": { id: "Studi Kasus", en: "Case Study" },
  })) {
    const cat = await prisma.articleCategory.upsert({
      where: { slug },
      update: {},
      create: { slug, name_id: names.id, name_en: names.en },
    });
    articleCats[slug] = cat.id;
  }

  const author = await prisma.user.findFirst({ where: { role: "SUPER_ADMIN" } });
  for (const [i, a] of fallbackArticles.entries()) {
    await prisma.article.upsert({
      where: { slug: a.slug },
      update: {},
      create: {
        slug: a.slug,
        categoryId: articleCats[a.category] ?? null,
        authorId: author?.id ?? null,
        title_id: a.title_id,
        title_en: a.title_en,
        excerpt_id: a.excerpt_id,
        excerpt_en: a.excerpt_en,
        content_id: `<p>${a.excerpt_id}</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. ISHINOL menghadirkan teknologi perlindungan permukaan terbaik dari Jepang.</p>`,
        content_en: `<p>${a.excerpt_en}</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. ISHINOL brings the finest Japanese surface protection technology.</p>`,
        coverImage: a.coverImage,
        isPublished: true,
        isFeatured: i === 0,
        publishedAt: new Date(),
      },
    });
  }
  console.log(`   ✓ ${fallbackArticles.length} articles`);

  // ── Testimonials ───────────────────────────────────────
  await prisma.testimonial.deleteMany();
  for (const [i, t] of fallbackTestimonials.entries()) {
    await prisma.testimonial.create({ data: { ...t, order: i } });
  }
  console.log(`   ✓ ${fallbackTestimonials.length} testimonials`);

  // ── Videos ─────────────────────────────────────────────
  const videoCount = await prisma.video.count();
  if (videoCount === 0) {
    for (const [i, v] of fallbackVideos.entries()) {
      await prisma.video.create({ data: { ...v, order: i } });
    }
  }
  console.log(`   ✓ ${fallbackVideos.length} videos`);

  // ── Downloads ──────────────────────────────────────────
  const dlCount = await prisma.download.count();
  if (dlCount === 0) {
    for (const [i, d] of fallbackDownloads.entries()) {
      await prisma.download.create({
        data: {
          title_id: d.title_id,
          title_en: d.title_en,
          category: d.category,
          fileUrl: d.fileUrl,
          fileSize: d.fileSize,
          order: i,
        },
      });
    }
  }
  console.log(`   ✓ ${fallbackDownloads.length} downloads`);

  // ── SEO settings ───────────────────────────────────────
  for (const pageKey of ["home", "about", "products", "portfolio", "news", "contact"]) {
    await prisma.seoSetting.upsert({
      where: { pageKey },
      update: {},
      create: {
        pageKey,
        metaTitle_id: `ISHINOL Indonesia — ${pageKey}`,
        metaTitle_en: `ISHINOL Indonesia — ${pageKey}`,
        keywords: "ISHINOL Indonesia, marble coating, granite coating, stone protection",
      },
    });
  }
  console.log("   ✓ SEO settings");

  console.log("✅  Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
