"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { can, type Permission } from "@/lib/rbac";
import { slugify } from "@/lib/utils";
import type { Role } from "@prisma/client";

/**
 * Server actions for the ISHINOL admin CMS.
 *
 * Conventions:
 *  - Every action authenticates via auth() and authorizes via can().
 *  - All prisma access is wrapped in try/catch so a downed DB never throws
 *    an unhandled error into the UI (actions return a { ok, error } result).
 *  - Mutations call revalidatePath() for the affected route(s).
 *  - Audit logging is best-effort (its own try/catch — never blocks the action).
 */

export type ActionResult = { ok: boolean; error?: string; id?: string };

type SessionUser = { id: string; role: Role; name?: string | null };

/**
 * Resolve the current session and assert the given permission.
 * Returns the session user or throws — callers should let it throw inside
 * a server action (Next renders the error boundary) or catch as needed.
 */
export async function requireRole(permission: Permission): Promise<SessionUser> {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  if (!can(session.user.role, permission)) throw new Error("Forbidden");
  return {
    id: session.user.id,
    role: session.user.role,
    name: session.user.name,
  };
}

async function authorize(
  permission: Permission,
): Promise<{ user: SessionUser } | { error: string }> {
  const session = await auth();
  if (!session?.user) return { error: "Unauthorized" };
  if (!can(session.user.role, permission)) return { error: "Insufficient permission" };
  return {
    user: { id: session.user.id, role: session.user.role, name: session.user.name },
  };
}

async function audit(
  userId: string | null,
  action: string,
  entity: string,
  entityId?: string | null,
  metadata?: Record<string, unknown>,
) {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        entity,
        entityId: entityId ?? null,
        metadata: (metadata ?? undefined) as never,
      },
    });
  } catch {
    // Best-effort only.
  }
}

function str(v: FormDataEntryValue | null): string {
  return typeof v === "string" ? v.trim() : "";
}

function optStr(v: FormDataEntryValue | null): string | null {
  const s = str(v);
  return s.length ? s : null;
}

function bool(v: FormDataEntryValue | null): boolean {
  return v === "on" || v === "true" || v === "1";
}

function intOrNull(v: FormDataEntryValue | null): number | null {
  const s = str(v);
  if (!s) return null;
  const n = Number(s);
  return Number.isFinite(n) ? Math.trunc(n) : null;
}

/** Split a textarea into a trimmed, non-empty string[] (one item per line). */
function lines(v: FormDataEntryValue | null): string[] {
  return str(v)
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

// ─────────────────────────────────────────────────────────────
// PRODUCTS
// ─────────────────────────────────────────────────────────────

export async function upsertProduct(formData: FormData): Promise<ActionResult> {
  const guard = await authorize("content:write");
  if ("error" in guard) return { ok: false, error: guard.error };

  const id = str(formData.get("id"));
  const name_id = str(formData.get("name_id"));
  const name_en = str(formData.get("name_en"));
  if (!name_id || !name_en) return { ok: false, error: "Name (ID & EN) is required" };

  const slug = str(formData.get("slug")) || slugify(name_en || name_id);

  const data = {
    slug,
    name_id,
    name_en,
    tagline_id: optStr(formData.get("tagline_id")),
    tagline_en: optStr(formData.get("tagline_en")),
    description_id: optStr(formData.get("description_id")),
    description_en: optStr(formData.get("description_en")),
    features_id: lines(formData.get("features_id")),
    features_en: lines(formData.get("features_en")),
    coverImage: optStr(formData.get("coverImage")),
    categoryId: optStr(formData.get("categoryId")),
    isFeatured: bool(formData.get("isFeatured")),
    isActive: bool(formData.get("isActive")),
  };

  try {
    if (id && id !== "new") {
      await prisma.product.update({ where: { id }, data });
      await audit(guard.user.id, "UPDATE", "Product", id);
    } else {
      const created = await prisma.product.create({ data });
      await audit(guard.user.id, "CREATE", "Product", created.id);
      revalidatePath("/admin/products");
      return { ok: true, id: created.id };
    }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Database error" };
  }

  revalidatePath("/admin/products");
  return { ok: true, id };
}

export async function deleteProduct(id: string): Promise<ActionResult> {
  const guard = await authorize("content:write");
  if ("error" in guard) return { ok: false, error: guard.error };
  try {
    await prisma.product.delete({ where: { id } });
    await audit(guard.user.id, "DELETE", "Product", id);
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Database error" };
  }
  revalidatePath("/admin/products");
  return { ok: true };
}

// ─────────────────────────────────────────────────────────────
// PORTFOLIO
// ─────────────────────────────────────────────────────────────

export async function upsertProject(formData: FormData): Promise<ActionResult> {
  const guard = await authorize("content:write");
  if ("error" in guard) return { ok: false, error: guard.error };

  const id = str(formData.get("id"));
  const title_id = str(formData.get("title_id"));
  const title_en = str(formData.get("title_en"));
  if (!title_id || !title_en) return { ok: false, error: "Title (ID & EN) is required" };

  const slug = str(formData.get("slug")) || slugify(title_en || title_id);

  const data = {
    slug,
    title_id,
    title_en,
    location: optStr(formData.get("location")),
    client: optStr(formData.get("client")),
    year: intOrNull(formData.get("year")),
    description_id: optStr(formData.get("description_id")),
    description_en: optStr(formData.get("description_en")),
    coverImage: optStr(formData.get("coverImage")),
    isFeatured: bool(formData.get("isFeatured")),
    isActive: bool(formData.get("isActive")),
  };

  try {
    if (id && id !== "new") {
      await prisma.portfolioProject.update({ where: { id }, data });
      await audit(guard.user.id, "UPDATE", "PortfolioProject", id);
    } else {
      const created = await prisma.portfolioProject.create({ data });
      await audit(guard.user.id, "CREATE", "PortfolioProject", created.id);
      revalidatePath("/admin/portfolio");
      return { ok: true, id: created.id };
    }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Database error" };
  }

  revalidatePath("/admin/portfolio");
  return { ok: true, id };
}

export async function deleteProject(id: string): Promise<ActionResult> {
  const guard = await authorize("content:write");
  if ("error" in guard) return { ok: false, error: guard.error };
  try {
    await prisma.portfolioProject.delete({ where: { id } });
    await audit(guard.user.id, "DELETE", "PortfolioProject", id);
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Database error" };
  }
  revalidatePath("/admin/portfolio");
  return { ok: true };
}

// ─────────────────────────────────────────────────────────────
// ARTICLES / NEWS
// ─────────────────────────────────────────────────────────────

export async function upsertArticle(formData: FormData): Promise<ActionResult> {
  const guard = await authorize("content:write");
  if ("error" in guard) return { ok: false, error: guard.error };

  const id = str(formData.get("id"));
  const title_id = str(formData.get("title_id"));
  const title_en = str(formData.get("title_en"));
  if (!title_id || !title_en) return { ok: false, error: "Title (ID & EN) is required" };

  const slug = str(formData.get("slug")) || slugify(title_en || title_id);
  const isPublished = bool(formData.get("isPublished"));

  const data = {
    slug,
    title_id,
    title_en,
    excerpt_id: optStr(formData.get("excerpt_id")),
    excerpt_en: optStr(formData.get("excerpt_en")),
    content_id: optStr(formData.get("content_id")),
    content_en: optStr(formData.get("content_en")),
    coverImage: optStr(formData.get("coverImage")),
    isPublished,
    isFeatured: bool(formData.get("isFeatured")),
    publishedAt: isPublished ? new Date() : null,
  };

  try {
    if (id && id !== "new") {
      // Preserve existing publishedAt if already published.
      const existing = await prisma.article.findUnique({ where: { id }, select: { publishedAt: true } });
      await prisma.article.update({
        where: { id },
        data: { ...data, publishedAt: isPublished ? existing?.publishedAt ?? new Date() : null },
      });
      await audit(guard.user.id, "UPDATE", "Article", id);
    } else {
      const created = await prisma.article.create({
        data: { ...data, authorId: guard.user.id },
      });
      await audit(guard.user.id, "CREATE", "Article", created.id);
      revalidatePath("/admin/news");
      return { ok: true, id: created.id };
    }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Database error" };
  }

  revalidatePath("/admin/news");
  return { ok: true, id };
}

export async function deleteArticle(id: string): Promise<ActionResult> {
  const guard = await authorize("content:write");
  if ("error" in guard) return { ok: false, error: guard.error };
  try {
    await prisma.article.delete({ where: { id } });
    await audit(guard.user.id, "DELETE", "Article", id);
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Database error" };
  }
  revalidatePath("/admin/news");
  return { ok: true };
}

// ─────────────────────────────────────────────────────────────
// HERO BANNER
// ─────────────────────────────────────────────────────────────

export async function upsertHero(formData: FormData): Promise<ActionResult> {
  const guard = await authorize("content:write");
  if ("error" in guard) return { ok: false, error: guard.error };

  const id = str(formData.get("id"));
  const headline_id = str(formData.get("headline_id"));
  const headline_en = str(formData.get("headline_en"));
  if (!headline_id || !headline_en) return { ok: false, error: "Headline (ID & EN) is required" };

  const data = {
    eyebrow_id: optStr(formData.get("eyebrow_id")),
    eyebrow_en: optStr(formData.get("eyebrow_en")),
    headline_id,
    headline_en,
    subheadline_id: optStr(formData.get("subheadline_id")),
    subheadline_en: optStr(formData.get("subheadline_en")),
    imageUrl: optStr(formData.get("imageUrl")),
    videoUrl: optStr(formData.get("videoUrl")),
    ctaLabel_id: optStr(formData.get("ctaLabel_id")),
    ctaLabel_en: optStr(formData.get("ctaLabel_en")),
    ctaHref: optStr(formData.get("ctaHref")),
    isActive: bool(formData.get("isActive")),
  };

  try {
    if (id && id !== "new") {
      await prisma.heroBanner.update({ where: { id }, data });
      await audit(guard.user.id, "UPDATE", "HeroBanner", id);
    } else {
      const created = await prisma.heroBanner.create({ data });
      await audit(guard.user.id, "CREATE", "HeroBanner", created.id);
    }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Database error" };
  }

  revalidatePath("/admin/home");
  return { ok: true };
}

// ─────────────────────────────────────────────────────────────
// GENERIC TOGGLES
// ─────────────────────────────────────────────────────────────

const TOGGLEABLE = {
  product: "product",
  portfolioProject: "portfolioProject",
  article: "article",
  video: "video",
  download: "download",
  testimonial: "testimonial",
} as const;

type ToggleModel = keyof typeof TOGGLEABLE;
type ToggleField = "isActive" | "isFeatured" | "isPublished";

export async function toggleFlag(
  model: ToggleModel,
  id: string,
  field: ToggleField,
  value: boolean,
  revalidate: string,
): Promise<ActionResult> {
  const guard = await authorize("content:write");
  if ("error" in guard) return { ok: false, error: guard.error };
  try {
    // @ts-expect-error — model name is validated against TOGGLEABLE above.
    await prisma[model].update({ where: { id }, data: { [field]: value } });
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Database error" };
  }
  revalidatePath(revalidate);
  return { ok: true };
}

// ─────────────────────────────────────────────────────────────
// MEDIA LIBRARY
// ─────────────────────────────────────────────────────────────

export async function createMedia(formData: FormData): Promise<ActionResult> {
  const guard = await authorize("media:write");
  if ("error" in guard) return { ok: false, error: guard.error };

  const url = str(formData.get("url"));
  if (!url) return { ok: false, error: "URL is required" };

  try {
    await prisma.mediaLibrary.create({
      data: {
        url,
        fileName: str(formData.get("fileName")) || url.split("/").pop() || "media",
        type: str(formData.get("type")) || "image",
        folder: str(formData.get("folder")) || "general",
        alt_id: optStr(formData.get("alt_id")),
        alt_en: optStr(formData.get("alt_en")),
      },
    });
    await audit(guard.user.id, "CREATE", "MediaLibrary");
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Database error" };
  }
  revalidatePath("/admin/media");
  return { ok: true };
}

export async function deleteMedia(id: string): Promise<ActionResult> {
  const guard = await authorize("media:write");
  if ("error" in guard) return { ok: false, error: guard.error };
  try {
    await prisma.mediaLibrary.delete({ where: { id } });
    await audit(guard.user.id, "DELETE", "MediaLibrary", id);
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Database error" };
  }
  revalidatePath("/admin/media");
  return { ok: true };
}

// ─────────────────────────────────────────────────────────────
// VIDEOS
// ─────────────────────────────────────────────────────────────

export async function createVideo(formData: FormData): Promise<ActionResult> {
  const guard = await authorize("content:write");
  if ("error" in guard) return { ok: false, error: guard.error };

  const title_id = str(formData.get("title_id"));
  const title_en = str(formData.get("title_en"));
  const url = str(formData.get("url"));
  if (!title_id || !title_en || !url) return { ok: false, error: "Title (ID & EN) and URL are required" };

  try {
    await prisma.video.create({
      data: {
        title_id,
        title_en,
        url,
        source: str(formData.get("source")) || "youtube",
        category: str(formData.get("category")) || "marketing",
        isFeatured: bool(formData.get("isFeatured")),
      },
    });
    await audit(guard.user.id, "CREATE", "Video");
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Database error" };
  }
  revalidatePath("/admin/videos");
  return { ok: true };
}

export async function deleteVideo(id: string): Promise<ActionResult> {
  const guard = await authorize("content:write");
  if ("error" in guard) return { ok: false, error: guard.error };
  try {
    await prisma.video.delete({ where: { id } });
    await audit(guard.user.id, "DELETE", "Video", id);
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Database error" };
  }
  revalidatePath("/admin/videos");
  return { ok: true };
}

// ─────────────────────────────────────────────────────────────
// DOWNLOADS
// ─────────────────────────────────────────────────────────────

export async function createDownload(formData: FormData): Promise<ActionResult> {
  const guard = await authorize("content:write");
  if ("error" in guard) return { ok: false, error: guard.error };

  const title_id = str(formData.get("title_id"));
  const title_en = str(formData.get("title_en"));
  const fileUrl = str(formData.get("fileUrl"));
  if (!title_id || !title_en || !fileUrl) return { ok: false, error: "Title (ID & EN) and file URL are required" };

  try {
    await prisma.download.create({
      data: {
        title_id,
        title_en,
        description_id: optStr(formData.get("description_id")),
        description_en: optStr(formData.get("description_en")),
        fileUrl,
        category: str(formData.get("category")) || "brochure",
        fileSize: intOrNull(formData.get("fileSize")),
      },
    });
    await audit(guard.user.id, "CREATE", "Download");
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Database error" };
  }
  revalidatePath("/admin/downloads");
  return { ok: true };
}

export async function deleteDownload(id: string): Promise<ActionResult> {
  const guard = await authorize("content:write");
  if ("error" in guard) return { ok: false, error: guard.error };
  try {
    await prisma.download.delete({ where: { id } });
    await audit(guard.user.id, "DELETE", "Download", id);
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Database error" };
  }
  revalidatePath("/admin/downloads");
  return { ok: true };
}

// ─────────────────────────────────────────────────────────────
// TESTIMONIALS
// ─────────────────────────────────────────────────────────────

export async function createTestimonial(formData: FormData): Promise<ActionResult> {
  const guard = await authorize("content:write");
  if ("error" in guard) return { ok: false, error: guard.error };

  const author = str(formData.get("author"));
  const quote_id = str(formData.get("quote_id"));
  const quote_en = str(formData.get("quote_en"));
  if (!author || !quote_id || !quote_en) return { ok: false, error: "Author and quote (ID & EN) are required" };

  const rating = intOrNull(formData.get("rating")) ?? 5;

  try {
    await prisma.testimonial.create({
      data: {
        author,
        role_id: optStr(formData.get("role_id")),
        role_en: optStr(formData.get("role_en")),
        company: optStr(formData.get("company")),
        quote_id,
        quote_en,
        rating: Math.min(5, Math.max(1, rating)),
      },
    });
    await audit(guard.user.id, "CREATE", "Testimonial");
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Database error" };
  }
  revalidatePath("/admin/testimonials");
  return { ok: true };
}

export async function deleteTestimonial(id: string): Promise<ActionResult> {
  const guard = await authorize("content:write");
  if ("error" in guard) return { ok: false, error: guard.error };
  try {
    await prisma.testimonial.delete({ where: { id } });
    await audit(guard.user.id, "DELETE", "Testimonial", id);
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Database error" };
  }
  revalidatePath("/admin/testimonials");
  return { ok: true };
}

// ─────────────────────────────────────────────────────────────
// LEADS
// ─────────────────────────────────────────────────────────────

const LEAD_STATUSES = ["new", "contacted", "qualified", "closed"];

export async function updateLeadStatus(id: string, status: string): Promise<ActionResult> {
  const guard = await authorize("leads:read");
  if ("error" in guard) return { ok: false, error: guard.error };
  if (!LEAD_STATUSES.includes(status)) return { ok: false, error: "Invalid status" };
  try {
    await prisma.lead.update({ where: { id }, data: { status } });
    await audit(guard.user.id, "UPDATE", "Lead", id, { status });
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Database error" };
  }
  revalidatePath("/admin/leads");
  return { ok: true };
}

export async function deleteLead(id: string): Promise<ActionResult> {
  const guard = await authorize("leads:read");
  if ("error" in guard) return { ok: false, error: guard.error };
  try {
    await prisma.lead.delete({ where: { id } });
    await audit(guard.user.id, "DELETE", "Lead", id);
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Database error" };
  }
  revalidatePath("/admin/leads");
  return { ok: true };
}

// ─────────────────────────────────────────────────────────────
// USERS
// ─────────────────────────────────────────────────────────────

const ROLES: Role[] = ["SUPER_ADMIN", "ADMIN", "EDITOR"];

export async function createUser(formData: FormData): Promise<ActionResult> {
  const guard = await authorize("users:write");
  if ("error" in guard) return { ok: false, error: guard.error };

  const name = str(formData.get("name"));
  const email = str(formData.get("email")).toLowerCase();
  const password = str(formData.get("password"));
  const role = str(formData.get("role")) as Role;

  if (!name || !email || !password) return { ok: false, error: "Name, email and password are required" };
  if (password.length < 6) return { ok: false, error: "Password must be at least 6 characters" };
  if (!ROLES.includes(role)) return { ok: false, error: "Invalid role" };

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const created = await prisma.user.create({
      data: { name, email, passwordHash, role },
    });
    await audit(guard.user.id, "CREATE", "User", created.id, { role });
  } catch (e) {
    const msg = e instanceof Error && e.message.includes("Unique") ? "Email already in use" : "Database error";
    return { ok: false, error: msg };
  }
  revalidatePath("/admin/users");
  return { ok: true };
}

export async function updateUserRole(id: string, role: string): Promise<ActionResult> {
  const guard = await authorize("users:write");
  if ("error" in guard) return { ok: false, error: guard.error };
  if (!ROLES.includes(role as Role)) return { ok: false, error: "Invalid role" };
  if (id === guard.user.id) return { ok: false, error: "You cannot change your own role" };
  try {
    await prisma.user.update({ where: { id }, data: { role: role as Role } });
    await audit(guard.user.id, "UPDATE", "User", id, { role });
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Database error" };
  }
  revalidatePath("/admin/users");
  return { ok: true };
}

export async function toggleUserActive(id: string, isActive: boolean): Promise<ActionResult> {
  const guard = await authorize("users:write");
  if ("error" in guard) return { ok: false, error: guard.error };
  if (id === guard.user.id) return { ok: false, error: "You cannot deactivate yourself" };
  try {
    await prisma.user.update({ where: { id }, data: { isActive } });
    await audit(guard.user.id, "UPDATE", "User", id, { isActive });
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Database error" };
  }
  revalidatePath("/admin/users");
  return { ok: true };
}

export async function deleteUser(id: string): Promise<ActionResult> {
  const guard = await authorize("users:write");
  if ("error" in guard) return { ok: false, error: guard.error };
  if (id === guard.user.id) return { ok: false, error: "You cannot delete yourself" };
  try {
    await prisma.user.delete({ where: { id } });
    await audit(guard.user.id, "DELETE", "User", id);
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Database error" };
  }
  revalidatePath("/admin/users");
  return { ok: true };
}

// ─────────────────────────────────────────────────────────────
// SEO
// ─────────────────────────────────────────────────────────────

export async function upsertSeo(formData: FormData): Promise<ActionResult> {
  const guard = await authorize("seo:write");
  if ("error" in guard) return { ok: false, error: guard.error };

  const pageKey = str(formData.get("pageKey"));
  if (!pageKey) return { ok: false, error: "Page key is required" };

  const data = {
    metaTitle_id: optStr(formData.get("metaTitle_id")),
    metaTitle_en: optStr(formData.get("metaTitle_en")),
    metaDescription_id: optStr(formData.get("metaDescription_id")),
    metaDescription_en: optStr(formData.get("metaDescription_en")),
    keywords: optStr(formData.get("keywords")),
  };

  try {
    await prisma.seoSetting.upsert({
      where: { pageKey },
      create: { pageKey, ...data },
      update: data,
    });
    await audit(guard.user.id, "UPDATE", "SeoSetting", pageKey);
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Database error" };
  }
  revalidatePath("/admin/seo");
  return { ok: true };
}

// ─────────────────────────────────────────────────────────────
// SITE SETTINGS
// ─────────────────────────────────────────────────────────────

export async function updateSiteSettings(formData: FormData): Promise<ActionResult> {
  const guard = await authorize("settings:write");
  if ("error" in guard) return { ok: false, error: guard.error };

  const data = {
    companyName: str(formData.get("companyName")) || "ISHINOL Indonesia",
    tagline_id: optStr(formData.get("tagline_id")),
    tagline_en: optStr(formData.get("tagline_en")),
    about_id: optStr(formData.get("about_id")),
    about_en: optStr(formData.get("about_en")),
    addressLine: optStr(formData.get("addressLine")),
    city: optStr(formData.get("city")),
    email: optStr(formData.get("email")),
    phone: optStr(formData.get("phone")),
    whatsapp: optStr(formData.get("whatsapp")),
    instagramUrl: optStr(formData.get("instagramUrl")),
    facebookUrl: optStr(formData.get("facebookUrl")),
    linkedinUrl: optStr(formData.get("linkedinUrl")),
    youtubeUrl: optStr(formData.get("youtubeUrl")),
    gaMeasurementId: optStr(formData.get("gaMeasurementId")),
  };

  try {
    await prisma.siteSettings.upsert({
      where: { id: "singleton" },
      create: { id: "singleton", ...data },
      update: data,
    });
    await audit(guard.user.id, "UPDATE", "SiteSettings", "singleton");
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Database error" };
  }
  revalidatePath("/admin/settings");
  return { ok: true };
}
