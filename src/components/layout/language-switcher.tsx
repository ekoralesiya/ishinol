"use client";

import { useLocale } from "next-intl";
import { useParams } from "next/navigation";
import { useTransition } from "react";
import { Globe } from "lucide-react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ className }: { className?: string }) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [isPending, startTransition] = useTransition();

  function switchTo(next: string) {
    if (next === locale) return;
    // Persist preference for browser-language redirect logic.
    document.cookie = `NEXT_LOCALE=${next};path=/;max-age=31536000;samesite=lax`;
    startTransition(() => {
      // @ts-expect-error -- pathname + params are compatible at runtime
      router.replace({ pathname, params }, { locale: next });
    });
  }

  return (
    <div className={cn("flex items-center gap-1 text-sm", className)}>
      <Globe className="mr-1 h-4 w-4 text-muted-foreground" aria-hidden />
      {routing.locales.map((l, i) => (
        <span key={l} className="flex items-center">
          {i > 0 && <span className="mx-1 text-border">/</span>}
          <button
            type="button"
            onClick={() => switchTo(l)}
            disabled={isPending}
            className={cn(
              "uppercase tracking-wide transition-colors hover:text-gold-700",
              l === locale ? "font-semibold text-ink" : "text-muted-foreground",
            )}
            aria-current={l === locale}
          >
            {l}
          </button>
        </span>
      ))}
    </div>
  );
}
