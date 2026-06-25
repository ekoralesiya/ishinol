import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

/**
 * AI Content Assistant for the admin CMS.
 *
 * POST { action, text, targetLang? }
 *   action ∈ generate-product-description | generate-benefits | generate-article
 *            | rewrite | generate-seo | generate-faq | translate
 *
 * If ANTHROPIC_API_KEY is configured, proxies to the Anthropic Messages API and
 * returns { result }. Otherwise returns { result: "", disabled: true, message }.
 *
 * Requires an authenticated admin session.
 */

const ACTIONS = [
  "generate-product-description",
  "generate-benefits",
  "generate-article",
  "rewrite",
  "generate-seo",
  "generate-faq",
  "translate",
] as const;

type Action = (typeof ACTIONS)[number];

function buildPrompt(action: Action, text: string, targetLang?: string): string {
  const lang = targetLang === "en" ? "English" : targetLang === "id" ? "Indonesian" : null;
  switch (action) {
    case "generate-product-description":
      return `You are a copywriter for PT Indocoat Ishinol Utama, the official Indonesian distributor of ISHINOL — a premium Japanese marble protection coating. Write a compelling, professional product description (2-3 short paragraphs) about marble protection based on this input. Return only the description text.\n\nInput:\n${text}`;
    case "generate-benefits":
      return `Based on the following product information, generate a concise bullet list of 4-6 customer benefits. Return one benefit per line, no bullet characters, no numbering.\n\nInput:\n${text}`;
    case "generate-article":
      return `Write a professional, well-structured news/blog article for PT Indocoat Ishinol Utama (official ISHINOL marble-coating distributor in Indonesia) based on this brief. Use clear paragraphs. Return only the article body.\n\nBrief:\n${text}`;
    case "rewrite":
      return `Rewrite the following text to be clearer, more professional and engaging while preserving meaning. Return only the rewritten text.\n\nText:\n${text}`;
    case "generate-seo":
      return `Generate an SEO meta title (max 60 chars) and meta description (max 155 chars) for the following content. Return as two lines: "Title: ..." and "Description: ...".\n\nContent:\n${text}`;
    case "generate-faq":
      return `Generate 4-5 frequently asked questions with concise answers for the following product/topic. Format each as "Q: ...\\nA: ...".\n\nTopic:\n${text}`;
    case "translate":
      return `Translate the following text into ${lang ?? "the requested language"}. Preserve tone and formatting. Return only the translation.\n\nText:\n${text}`;
    default:
      return text;
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { action?: string; text?: string; targetLang?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const action = body.action as Action;
  const text = (body.text ?? "").trim();

  if (!ACTIONS.includes(action)) {
    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  }
  if (!text) {
    return NextResponse.json({ error: "Text is required" }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({
      result: "",
      disabled: true,
      message: "AI assistant not configured",
    });
  }

  const model = process.env.AI_MODEL || "claude-opus-4-8";
  const prompt = buildPrompt(action, text, body.targetLang);

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model,
        max_tokens: 1024,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      return NextResponse.json(
        { result: "", error: "AI request failed", detail: detail.slice(0, 500) },
        { status: 502 },
      );
    }

    const data = (await res.json()) as {
      content?: Array<{ type: string; text?: string }>;
    };
    const result =
      data.content
        ?.filter((c) => c.type === "text")
        .map((c) => c.text ?? "")
        .join("\n")
        .trim() ?? "";

    return NextResponse.json({ result });
  } catch (e) {
    return NextResponse.json(
      { result: "", error: e instanceof Error ? e.message : "AI request failed" },
      { status: 502 },
    );
  }
}
