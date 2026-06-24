"use client";

import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type AiAction =
  | "generate-product-description"
  | "generate-benefits"
  | "generate-article"
  | "rewrite"
  | "generate-seo"
  | "generate-faq"
  | "translate";

/**
 * Small inline button that calls the /api/ai endpoint with the given action
 * and feeds the result back via onResult(). `getText` supplies the source
 * text at click time (e.g. current field value).
 */
export function AiAssistButton({
  action,
  label = "AI assist",
  targetLang,
  getText,
  onResult,
  className,
}: {
  action: AiAction;
  label?: string;
  targetLang?: string;
  getText: () => string;
  onResult: (text: string) => void;
  className?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  async function run() {
    const text = getText().trim();
    if (!text) {
      setNote("Add some text first.");
      return;
    }
    setLoading(true);
    setNote(null);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action, text, targetLang }),
      });
      const data = await res.json();
      if (data.disabled) {
        setNote(data.message ?? "AI assistant not configured");
      } else if (data.error) {
        setNote(data.error);
      } else if (data.result) {
        onResult(data.result);
      } else {
        setNote("No result returned.");
      }
    } catch {
      setNote("AI request failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <span className="inline-flex items-center gap-2">
      <button
        type="button"
        onClick={run}
        disabled={loading}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-md border border-gold/40 bg-gold/10 px-2.5 py-1 text-xs font-medium text-gold-700 transition-colors hover:bg-gold/20 disabled:opacity-50",
          className,
        )}
      >
        {loading ? <Loader2 className="size-3.5 animate-spin" /> : <Sparkles className="size-3.5" />}
        {label}
      </button>
      {note && <span className="text-xs text-muted-foreground">{note}</span>}
    </span>
  );
}
