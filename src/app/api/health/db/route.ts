import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * Database health check. Used by the admin login to tell the difference
 * between "wrong credentials" and "database not reachable", and by the
 * admin dashboard to show a connection warning banner.
 */
export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown database error";
    // Surface a concise reason (first line only) without leaking the full DSN.
    const reason = message.split("\n").find((l) => l.trim().length > 0)?.trim() ?? message;
    return NextResponse.json(
      { ok: false, error: reason },
      { status: 503 },
    );
  }
}
