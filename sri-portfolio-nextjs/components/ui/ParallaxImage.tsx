"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

/**
 * Image that drifts vertically against the scroll inside a clipped frame.
 * The inner layer is over-scaled so the parallax travel never exposes an edge.
 */
export default function ParallaxImage({
  src,
  alt,
  priority = false,
  className = "",
}: {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const layer = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion() || !wrap.current || !layer.current) return;
      gsap.fromTo(
        layer.current,
        { yPercent: -10 },
        {
          yPercent: 10,
          ease: "none",
          scrollTrigger: {
            trigger: wrap.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    },
    { scope: wrap },
  );

  return (
    <div
      ref={wrap}
      className={`relative overflow-hidden rounded-xl border border-line ${className}`}
    >
      <div ref={layer} className="absolute inset-0 scale-[1.18]">
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, 1340px"
          className="object-cover"
        />
      </div>
    </div>
  );
}
