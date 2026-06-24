import { MapPin } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { localized } from "@/lib/utils";
import type { Locale } from "@/i18n/routing";

interface Props {
  project: Record<string, unknown> & {
    slug: string;
    coverImage?: string | null;
    location?: string | null;
    year?: number | null;
  };
  locale: Locale;
}

export function ProjectCard({ project, locale }: Props) {
  const title = localized(project, "title", locale);
  return (
    <Link
      href={{ pathname: "/portfolio/[slug]", params: { slug: project.slug } }}
      className="group relative block aspect-[3/4] overflow-hidden rounded-xl bg-ink"
    >
      {project.coverImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={project.coverImage}
          alt={title}
          className="h-full w-full object-cover opacity-90 transition-all duration-700 group-hover:scale-105 group-hover:opacity-100"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-6 text-white">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-gold-300">
          {project.location && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" /> {project.location}
            </span>
          )}
          {project.year && <span>· {project.year}</span>}
        </div>
        <h3 className="mt-2 font-display text-2xl font-semibold leading-tight">{title}</h3>
      </div>
    </Link>
  );
}
