"use client";

import Image from "next/image";
import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";

export type CarouselImage = {
  src: string;
  alt: string;
};

export type CarouselProps = {
  images: CarouselImage[];
  autoPlay?: boolean;
  interval?: number;
  loop?: boolean;
  showArrows?: boolean;
  showIndicators?: boolean;
  // Sizing and styling
  aspect?: string;              // Tailwind aspect class, ignored if `height` is set.
  height?: number | string;     // e.g. 220 or "clamp(140px, 28vw, 260px)"
  rounded?: string;             // e.g. "rounded-xl"
  className?: string;
  imageSizes?: string;          // next/image sizes attribute
  onSlideChange?: (index: number) => void;
};

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(mql.matches);
    onChange();
    mql.addEventListener?.("change", onChange);
    return () => mql.removeEventListener?.("change", onChange);
  }, []);
  return reduced;
}

export function Carousel({
  images,
  autoPlay = true,
  interval = 4000,
  loop = true,
  showArrows = true,
  showIndicators = true,
  aspect = "aspect-[16/6]",
  height, // jika tidak diset, default kecil via clamp
  rounded = "rounded-xl",
  className = "",
  imageSizes = "100vw",
  onSlideChange,
}: CarouselProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  const slideCount = images.length;

  const goTo = (i: number) => {
    const next = loop ? (i + slideCount) % slideCount : Math.max(0, Math.min(i, slideCount - 1));
    setIndex(next);
    onSlideChange?.(next);
  };
  const next = useCallback(() => goTo(index + 1), [index, goTo]);
  const prev = useCallback(() => goTo(index - 1), [index, goTo]);

  useEffect(() => {
    if (!autoPlay || paused || slideCount <= 1) return;
    if (reducedMotion) return;
    const id = setInterval(next, interval);
    return () => clearInterval(id);
  }, [autoPlay, paused, interval, slideCount, index, reducedMotion, next]);

  const containerRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    el.addEventListener("keydown", onKey);
    return () => el.removeEventListener("keydown", onKey);
  }, [next, prev]);

  // touch/swipe
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const touchTime = useRef<number>(0);
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStartX.current = t.clientX;
    touchStartY.current = t.clientY;
    touchTime.current = Date.now();
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const sx = touchStartX.current;
    const sy = touchStartY.current;
    if (sx == null || sy == null) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - sx;
    const dy = t.clientY - sy;
    const dt = Date.now() - touchTime.current;
    if ((Math.abs(dx) > Math.abs(dy)) && (Math.abs(dx) > 50) && (dt < 600)) {
      dx < 0 ? next() : prev();
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  // preload neighbors
  const neighbors = useMemo(() => {
    if (slideCount === 0) return [];
    const prevI = (index - 1 + slideCount) % slideCount;
    const nextI = (index + 1) % slideCount;
    return [images[prevI]?.src, images[nextI]?.src].filter(Boolean) as string[];
  }, [index, images, slideCount]);

  if (slideCount === 0) return null;

  const sizeStyle: React.CSSProperties | undefined =
    height !== undefined
      ? { height: typeof height === "number" ? `${height}px` : height }
      : { height: "clamp(140px, 28vw, 240px)" }; // default kecil dan responsif
  const sizeClass = height !== undefined ? "" : aspect;

  return (
    <section
      ref={containerRef}
      className={`relative overflow-hidden ${rounded} outline-none ${className}`}
      role="region"
      aria-roledescription="carousel"
      aria-label="Image carousel"
      tabIndex={0}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="relative h-full">
        {images.map((img, i) => {
          const active = i === index;
          return (
            <div
              key={img.src}
              className={active ? "pointer-events-auto relative block" : "pointer-events-none absolute inset-0 block"}
              aria-hidden={!active}
            >
              <div className={`relative w-full ${sizeClass}`} style={sizeStyle}>
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  priority={i === 0}
                  className={active ? "h-full w-full object-cover opacity-100 transition-opacity duration-500" : "h-full w-full object-cover opacity-0 transition-opacity duration-500"}
                  sizes={imageSizes}
                />
              </div>
            </div>
          );
        })}
      </div>

      {showArrows && slideCount > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous"
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white backdrop-blur hover:bg-black/50 focus:outline-none focus:ring-2 focus:ring-white/60"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button
            type="button"
            aria-label="Next"
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white backdrop-blur hover:bg-black/50 focus:outline-none focus:ring-2 focus:ring-white/60"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </>
      )}

      {showIndicators && slideCount > 1 && (
        <div className="pointer-events-none absolute bottom-3 left-0 right-0 flex items-center justify-center gap-2">
          {images.map((_, i) => {
            const active = i === index;
            return (
              <button
                key={i}
                type="button"
                aria-label={`Slide ${i + 1}`}
                aria-current={active ? "true" : "false"}
                onClick={() => goTo(i)}
                className={active ? "pointer-events-auto h-2 w-6 rounded-full bg-white shadow ring-1 ring-black/10" : "pointer-events-auto h-2 w-2 rounded-full bg-white/70 hover:bg-white shadow ring-1 ring-black/10"}
              />
            );
          })}
        </div>
      )}

      <div className="sr-only" aria-hidden="true">
        {neighbors.map((src) => (
          <Image key={src} src={src} alt="" width={1} height={1} />
        ))}
      </div>
    </section>
  );
}