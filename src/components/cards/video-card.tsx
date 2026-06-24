"use client";

import { useState } from "react";
import { Play, X } from "lucide-react";
import { localized, youtubeId, youtubeThumb } from "@/lib/utils";
import type { Locale } from "@/i18n/routing";

interface Props {
  video: Record<string, unknown> & { url: string; source?: string; thumbnail?: string | null };
  locale: Locale;
}

export function VideoCard({ video, locale }: Props) {
  const [open, setOpen] = useState(false);
  const title = localized(video, "title", locale);
  const id = youtubeId(video.url);
  const thumb = video.thumbnail || youtubeThumb(video.url) || undefined;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="group relative block aspect-video w-full overflow-hidden rounded-xl bg-ink text-left"
      >
        {thumb && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumb}
            alt={title}
            className="h-full w-full object-cover opacity-80 transition-all duration-500 group-hover:scale-105 group-hover:opacity-100"
          />
        )}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-ink shadow-lg transition-transform group-hover:scale-110">
            <Play className="ml-1 h-6 w-6 fill-current" />
          </span>
        </div>
        {title && (
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <h3 className="font-medium text-white">{title}</h3>
          </div>
        )}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 p-4"
          onClick={() => setOpen(false)}
        >
          <button className="absolute right-5 top-5 text-white" aria-label="Close">
            <X className="h-7 w-7" />
          </button>
          <div className="aspect-video w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            {id ? (
              <iframe
                className="h-full w-full rounded-xl"
                src={`https://www.youtube.com/embed/${id}?autoplay=1`}
                title={title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video className="h-full w-full rounded-xl" controls autoPlay src={video.url} />
            )}
          </div>
        </div>
      )}
    </>
  );
}
