import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { localized } from "@/lib/utils";
import type { Locale } from "@/i18n/routing";

interface Props {
  product: Record<string, unknown> & { slug: string; coverImage?: string | null };
  locale: Locale;
}

export function ProductCard({ product, locale }: Props) {
  const name = localized(product, "name", locale);
  const tagline = localized(product, "tagline", locale);
  return (
    <Link
      href={{ pathname: "/products/[slug]", params: { slug: product.slug } }}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {product.coverImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.coverImage}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        )}
        <div className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-ink opacity-0 transition-opacity group-hover:opacity-100">
          <ArrowUpRight className="h-4 w-4" />
        </div>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-xl font-semibold text-ink">{name}</h3>
        {tagline && <p className="mt-2 text-sm text-muted-foreground">{tagline}</p>}
      </div>
    </Link>
  );
}
