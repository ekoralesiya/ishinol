import type { Role } from "@prisma/client";

/**
 * Role-based access control.
 *
 * SUPER_ADMIN — full access incl. user & role management, site settings.
 * ADMIN       — manage all content + settings, but not delete users / change roles.
 * EDITOR      — manage content only (products, portfolio, news, media).
 */

export type Permission =
  | "content:read"
  | "content:write"
  | "media:write"
  | "leads:read"
  | "chat:write"
  | "settings:write"
  | "seo:write"
  | "users:read"
  | "users:write"
  | "audit:read";

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  EDITOR: ["content:read", "content:write", "media:write"],
  ADMIN: [
    "content:read",
    "content:write",
    "media:write",
    "leads:read",
    "chat:write",
    "settings:write",
    "seo:write",
    "users:read",
    "audit:read",
  ],
  SUPER_ADMIN: [
    "content:read",
    "content:write",
    "media:write",
    "leads:read",
    "chat:write",
    "settings:write",
    "seo:write",
    "users:read",
    "users:write",
    "audit:read",
  ],
};

export function can(role: Role | undefined, permission: Permission): boolean {
  if (!role) return false;
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export function roleLabel(role: Role): string {
  return {
    SUPER_ADMIN: "Super Admin",
    ADMIN: "Admin",
    EDITOR: "Editor",
  }[role];
}
