"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Reveal } from "@/components/ui/reveal";
import { ArticleCard } from "@/components/cards/article-card";
import { localized } from "@/lib/utils";
import type { Locale } from "@/i18n/routing";

type Article = Record<string, unknown> & { slug: string };

interface Props {
  articles: Article[];
  locale: Locale;
}

export function NewsSearch({ articles, locale }: Props) {
  const t = useTranslations("Common");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return articles;
    return articles.filter((article) => {
      const title = localized(article, "title", locale).toLowerCase();
      const excerpt = localized(article, "excerpt", locale).toLowerCase();
      return title.includes(q) || excerpt.includes(q);
    });
  }, [articles, query, locale]);

  return (
    <div>
      <div className="relative mx-auto mb-12 max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("search")}
          className="pl-10"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="py-16 text-center text-muted-foreground">{t("noResults")}</p>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((article, i) => (
            <Reveal key={article.slug} delay={i % 3}>
              <ArticleCard article={article as never} locale={locale} />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
