"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { getLenis } from "@/lib/lenis";

/**
 * Seamless horizontal loop. The row is rendered twice and translated by -50%,
 * so the second copy lands exactly where the first started. One marquee per
 * page (taste rule); this is the hero's.
 */
export default function Marquee({
  items,
  duration = 22,
}: {
  items: readonly string[];
  duration?: number;
}) {
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion() || !track.current) return;

      const tween = gsap.to(track.current, {
        xPercent: -50,
        duration,
        ease: "none",
        repeat: -1,
      });

      // Modulate speed and flip direction with the live scroll velocity.
      let dir = 1;
      let current = 1;
      const update = () => {
        const v = getLenis()?.velocity ?? 0;
        if (v > 0.4) dir = 1;
        else if (v < -0.4) dir = -1;
        const target = 1 + Math.min(Math.abs(v) * 0.05, 5);
        current = gsap.utils.interpolate(current, target, 0.08);
        tween.timeScale(dir * current);
      };
      gsap.ticker.add(update);
      return () => gsap.ticker.remove(update);
    },
    { scope: track },
  );

  const row = (
    <div className="flex shrink-0 items-center">
      {items.map((item, i) => (
        <span key={`${item}-${i}`} className="flex items-center">
          <span className="px-6 font-display text-2xl font-medium tracking-tight text-fg/90 md:px-10 md:text-4xl">
            {item}
          </span>
          <span aria-hidden className="text-accent">
            /
          </span>
        </span>
      ))}
    </div>
  );

  return (
    <div className="relative flex overflow-hidden border-y border-line py-5 md:py-7">
      <div
        ref={track}
        data-testid="marquee-track"
        className="flex will-change-transform"
      >
        {row}
        {row}
      </div>
    </div>
  );
}
