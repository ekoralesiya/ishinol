/* Generates a Supabase SQL refresh script from the canonical fallback content. */
import {
  fallbackHero,
  fallbackProducts,
  fallbackProjects,
  fallbackDownloads,
  fallbackAbout,
} from "../src/lib/fallback-content";

const q = (v: unknown) => {
  if (v === null || v === undefined) return "NULL";
  return `'${String(v).replace(/'/g, "''")}'`;
};
const j = (v: unknown) => {
  if (v === null || v === undefined) return "NULL";
  return `'${JSON.stringify(v).replace(/'/g, "''")}'::jsonb`;
};
const idify = (s: string) => s.replace(/[^a-z0-9]/gi, "_");

const ADMIN_HASH = "$2a$12$NFokBU2fyXorlSOYBl6MP.kvd1zXm9eXCwpt0bUhqcIdV9NGy8aSi"; // = "kosongin001"

let sql = `-- ============================================================
-- PT INDOCOAT ISHINOL UTAMA — Refresh konten DB (sesuai Company Profile)
-- Jalankan di: Supabase Dashboard -> SQL Editor -> New query -> Run
-- Aman dijalankan berulang (idempoten).
-- ============================================================

-- Admin: password = "kosongin001"
INSERT INTO "User" (id, name, email, "passwordHash", role, "isActive", locale, "createdAt", "updatedAt")
VALUES ('usr_admin_seed','Super Admin','admin@ishinol.co.id','${ADMIN_HASH}','SUPER_ADMIN',true,'id',now(),now())
ON CONFLICT (email) DO UPDATE SET "passwordHash"=EXCLUDED."passwordHash", role='SUPER_ADMIN', "isActive"=true, "updatedAt"=now();

-- Site settings
INSERT INTO "SiteSettings" (id,"companyName",tagline_id,tagline_en,about_id,about_en,"addressLine",city,email,phone,whatsapp,"updatedAt")
VALUES ('singleton','PT Indocoat Ishinol Utama',
  'Agen utama coating ISHINOL dari Jepang untuk perawatan marmer',
  'Official Indonesian agent of ISHINOL Japanese marble-care coating',
  ${q(fallbackAbout.distributor_id)}, ${q(fallbackAbout.distributor_en)},
  'Jakarta, Indonesia','Jakarta','info@ishinol.co.id','+62 856-9777-7292','6285697777292', now())
ON CONFLICT (id) DO UPDATE SET "companyName"=EXCLUDED."companyName", tagline_id=EXCLUDED.tagline_id, tagline_en=EXCLUDED.tagline_en, about_id=EXCLUDED.about_id, about_en=EXCLUDED.about_en, "updatedAt"=now();

-- Hero
DELETE FROM "HeroBanner";
INSERT INTO "HeroBanner" (id,eyebrow_id,eyebrow_en,headline_id,headline_en,subheadline_id,subheadline_en,"imageUrl","ctaLabel_id","ctaLabel_en","ctaHref","secondaryCtaLabel_id","secondaryCtaLabel_en","secondaryCtaHref","isActive","order","createdAt")
VALUES ('hero_main',${q(fallbackHero.eyebrow_id)},${q(fallbackHero.eyebrow_en)},${q(fallbackHero.headline_id)},${q(fallbackHero.headline_en)},${q(fallbackHero.subheadline_id)},${q(fallbackHero.subheadline_en)},${q(fallbackHero.imageUrl)},${q(fallbackHero.ctaLabel_id)},${q(fallbackHero.ctaLabel_en)},'/products',${q(fallbackHero.secondaryCtaLabel_id)},${q(fallbackHero.secondaryCtaLabel_en)},'/contact',true,0,now());

-- Product categories
INSERT INTO "ProductCategory" (id,slug,name_id,name_en,"order","isActive","createdAt","updatedAt") VALUES
 ('cat_coating','coating','Coating','Coating',0,true,now(),now()),
 ('cat_cleaning','cleaning','Cleaning Agent','Cleaning Agent',1,true,now(),now())
ON CONFLICT (slug) DO UPDATE SET name_id=EXCLUDED.name_id, name_en=EXCLUDED.name_en, "updatedAt"=now();

-- Products (full refresh)
DELETE FROM "Product";
`;

fallbackProducts.forEach((p, i) => {
  const pid = `prod_${idify(p.slug)}`;
  const catRef = `(SELECT id FROM "ProductCategory" WHERE slug=${q(p.category)} LIMIT 1)`;
  sql += `INSERT INTO "Product" (id,slug,"categoryId",name_id,name_en,tagline_id,tagline_en,description_id,description_en,features_id,features_en,benefits_id,benefits_en,specifications,"coverImage","order","isFeatured","isActive","createdAt","updatedAt")
VALUES ('${pid}',${q(p.slug)},${catRef},${q(p.name_id)},${q(p.name_en)},${q(p.tagline_id)},${q(p.tagline_en)},${q(p.description_id)},${q(p.description_en)},${j(p.features_id)},${j(p.features_en)},${j(p.benefits_id)},${j(p.benefits_en)},${j(p.specifications)},${q(p.coverImage)},${i},${p.isFeatured},true,now(),now());
INSERT INTO "ProductImage" (id,"productId",url,"order","createdAt") VALUES ('img_${idify(p.slug)}','${pid}',${q(p.coverImage)},0,now());
`;
});

sql += `
-- Portfolio category + projects (full refresh)
INSERT INTO "PortfolioCategory" (id,slug,name_id,name_en,"order","isActive","createdAt") VALUES
 ('pcat_landmark','landmark','Bangunan Ikonik','Landmark',0,true,now())
ON CONFLICT (slug) DO UPDATE SET name_id=EXCLUDED.name_id, name_en=EXCLUDED.name_en;
DELETE FROM "PortfolioProject";
`;

const beforeImg = "/portfolio/monas-1.jpg";
fallbackProjects.forEach((p, i) => {
  const pjid = `pj_${idify(p.slug)}`;
  const pcatRef = `(SELECT id FROM "PortfolioCategory" WHERE slug='landmark' LIMIT 1)`;
  sql += `INSERT INTO "PortfolioProject" (id,slug,"categoryId",title_id,title_en,location,year,description_id,description_en,"coverImage","beforeImage","afterImage","isFeatured","isActive","order","createdAt","updatedAt")
VALUES ('${pjid}',${q(p.slug)},${pcatRef},${q(p.title_id)},${q(p.title_en)},${q(p.location)},${p.year},${q(p.description_id)},${q(p.description_en)},${q(p.coverImage)},${q(beforeImg)},${q(p.coverImage)},true,true,${i},now(),now());
INSERT INTO "PortfolioImage" (id,"projectId",url,"order") VALUES ('pimg_${idify(p.slug)}','${pjid}',${q(p.coverImage)},0);
`;
});

sql += `
-- Downloads (E-Katalog LKPP)
DELETE FROM "Download";
`;
fallbackDownloads.forEach((d, i) => {
  sql += `INSERT INTO "Download" (id,title_id,title_en,category,"fileUrl","isActive","order","createdAt") VALUES ('dl_${i}',${q(d.title_id)},${q(d.title_en)},${q(d.category)},${q(d.fileUrl)},true,${i},now());\n`;
});

sql += `
-- Hapus video placeholder (kelola video asli dari /admin)
DELETE FROM "Video";

-- Selesai. Refresh website untuk melihat hasilnya.
`;

console.log(sql);
