"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { localized } from "@/lib/utils";
import type { Locale } from "@/i18n/routing";

interface Props {
  items: Array<Record<string, unknown> & { author: string; company?: string | null; rating?: number }>;
  locale: Locale;
}

export function Testimonials({ items, locale }: Props) {
  const [index, setIndex] = useState(0);
  if (!items.length) return null;
  const t = items[index];
  const quote = localized(t, "quote", locale);
  const role = localized(t, "role", locale);

  return (
    <div className="mx-auto max-w-3xl text-center">
      <Quote className="mx-auto h-10 w-10 text-gold/40" />
      <AnimatePresence mode="wait">
        <motion.blockquote
          key={index}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.4 }}
          className="mt-6"
        >
          <p className="font-display text-2xl leading-relaxed text-ink text-balance sm:text-3xl">
            “{quote}”
          </p>
          <div className="mt-6 flex items-center justify-center gap-1">
            {Array.from({ length: t.rating ?? 5 }).map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-gold text-gold" />
            ))}
          </div>
          <footer className="mt-4">
            <div className="font-semibold text-ink">{t.author}</div>
            <div className="text-sm text-muted-foreground">
              {[role, t.company].filter(Boolean).join(" · ")}
            </div>
          </footer>
        </motion.blockquote>
      </AnimatePresence>

      {items.length > 1 && (
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            onClick={() => setIndex((i) => (i - 1 + items.length) % items.length)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border hover:bg-muted"
            aria-label="Previous"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="flex gap-1.5">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`h-2 rounded-full transition-all ${i === index ? "w-6 bg-gold" : "w-2 bg-border"}`}
                aria-label={`Go to ${i + 1}`}
              />
            ))}
          </div>
          <button
            onClick={() => setIndex((i) => (i + 1) % items.length)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border hover:bg-muted"
            aria-label="Next"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
