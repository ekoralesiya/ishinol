import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { chatSchema } from "@/lib/validations";
import { rateLimit, clientIp } from "@/lib/rate-limit";

const AUTO_REPLY =
  "Thank you for reaching out to ISHINOL Indonesia! A specialist will respond shortly. For an instant reply, you can also reach us on WhatsApp.";

export async function POST(req: NextRequest) {
  const ip = clientIp(req.headers);
  if (!rateLimit(`chat:${ip}`, 20, 60_000).ok) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const parsed = chatSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed" }, { status: 422 });
  }

  const { sessionId, body, visitorName, email } = parsed.data;

  try {
    let session = sessionId
      ? await prisma.chatSession.findUnique({ where: { id: sessionId } })
      : null;

    if (!session) {
      session = await prisma.chatSession.create({
        data: { visitorId: `v_${ip}`, visitorName: visitorName || null, email: email || null },
      });
    }

    await prisma.chatMessage.create({
      data: { sessionId: session.id, sender: "visitor", body },
    });

    return NextResponse.json({ sessionId: session.id, reply: AUTO_REPLY });
  } catch {
    // DB unavailable — still provide an auto reply for demo mode.
    return NextResponse.json({ sessionId: sessionId ?? null, reply: AUTO_REPLY });
  }
}
