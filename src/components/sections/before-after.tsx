"use client";

import { useState, useRef } from "react";

interface Props {
  before: string;
  after: string;
  beforeLabel: string;
  afterLabel: string;
}

export function BeforeAfter({ before, after, beforeLabel, afterLabel }: Props) {
  const [pos, setPos] = useState(50);
  const ref = useRef<HTMLDivElement>(null);

  function onMove(clientX: number) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const p = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(0, Math.min(100, p)));
  }

  return (
    <div
      ref={ref}
      className="relative aspect-[16/9] w-full select-none overflow-hidden rounded-2xl border border-border shadow-xl"
      onMouseMove={(e) => e.buttons === 1 && onMove(e.clientX)}
      onTouchMove={(e) => onMove(e.touches[0].clientX)}
    >
      {/* After (full) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={after} alt={afterLabel} className="absolute inset-0 h-full w-full object-cover" />
      <span className="absolute right-4 top-4 rounded-full bg-gold px-3 py-1 text-xs font-semibold text-ink">
        {afterLabel}
      </span>

      {/* Before (clipped) */}
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={before} alt={beforeLabel} className="absolute inset-0 h-full w-full object-cover" style={{ width: `${100 / (pos / 100)}%`, maxWidth: "none" }} />
        <span className="absolute left-4 top-4 rounded-full bg-ink px-3 py-1 text-xs font-semibold text-white">
          {beforeLabel}
        </span>
      </div>

      {/* Handle */}
      <div className="absolute inset-y-0 z-10 w-0.5 bg-white shadow-lg" style={{ left: `${pos}%` }}>
        <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-white/30 backdrop-blur">
          <div className="flex gap-0.5">
            <span className="text-white">‹</span>
            <span className="text-white">›</span>
          </div>
        </div>
      </div>

      <input
        type="range"
        min={0}
        max={100}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        className="absolute inset-0 z-20 h-full w-full cursor-ew-resize opacity-0"
        aria-label="Before after slider"
      />
    </div>
  );
}
