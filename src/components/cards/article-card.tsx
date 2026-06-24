import { Link } from "@/i18n/navigation";
import { localized } from "@/lib/utils";
import type { Locale } from "@/i18n/routing";

interface Props {
  article: Record<string, unknown> & {
    slug: string;
    coverImage?: string | null;
    category?: string | { name_id: string; name_en: string } | null;
  };
  locale: Locale;
}

export function ArticleCard({ article, locale }: Props) {
  const title = localized(article, "title", locale);
  const excerpt = localized(article, "excerpt", locale);
  return (
    <Link
      href={{ pathname: "/news/[slug]", params: { slug: article.slug } }}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="aspect-[16/10] overflow-hidden bg-muted">
        {article.coverImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={article.coverImage}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-lg font-semibold leading-snug text-ink group-hover:text-gold-700">
          {title}
        </h3>
        {excerpt && (
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{excerpt}</p>
        )}
      </div>
    </Link>
  );
}
