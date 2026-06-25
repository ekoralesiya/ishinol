import { PrismaClient } from "@prisma/client";

/**
 * Build a connection URL that is safe for serverless (Vercel) + Supabase.
 *
 * Supabase's transaction pooler (port 6543) requires `pgbouncer=true` so Prisma
 * disables prepared statements, and a small `connection_limit` so each
 * serverless invocation doesn't exhaust the pool. Without these, queries like
 * `$queryRaw` fail intermittently ("Invalid invocation" / connection errors).
 *
 * These params are appended automatically here so they don't have to be set
 * by hand in the Vercel environment variable.
 */
function resolveDatabaseUrl(): string | undefined {
  const raw = process.env.DATABASE_URL;
  if (!raw) return undefined;
  try {
    const url = new URL(raw);
    if (url.port === "6543") {
      if (!url.searchParams.has("pgbouncer")) url.searchParams.set("pgbouncer", "true");
      if (!url.searchParams.has("connection_limit")) url.searchParams.set("connection_limit", "1");
    }
    return url.toString();
  } catch {
    return raw;
  }
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const datasourceUrl = resolveDatabaseUrl();

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    ...(datasourceUrl ? { datasources: { db: { url: datasourceUrl } } } : {}),
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
