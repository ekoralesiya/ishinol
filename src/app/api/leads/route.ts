import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { leadSchema } from "@/lib/validations";
import { rateLimit, clientIp } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const ip = clientIp(req.headers);
  if (!rateLimit(`lead:${ip}`, 5, 60_000).ok) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", issues: parsed.error.flatten() }, { status: 422 });
  }

  // Honeypot triggered — silently accept without storing.
  if (parsed.data.website) {
    return NextResponse.json({ ok: true });
  }

  const { website: _hp, ...data } = parsed.data;

  try {
    await prisma.lead.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        company: data.company || null,
        subject: data.subject || null,
        message: data.message,
        source: data.source,
        productSlug: data.productSlug || null,
        locale: data.locale,
      },
    });
  } catch {
    // DB unavailable — accept gracefully so the UX still works in demo mode.
    return NextResponse.json({ ok: true, persisted: false });
  }

  return NextResponse.json({ ok: true });
}
