"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";

/**
 * Counts from zero to `value` once, when scrolled into view.
 * Zero-padded for an editorial ledger feel (05, not 5).
 */
export default function Counter({
  value,
  suffix = "",
  pad = 2,
  duration = 1.6,
  className,
}: {
  value: number;
  suffix?: string;
  pad?: number;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  const format = (n: number) =>
    `${String(Math.round(n)).padStart(pad, "0")}${suffix}`;

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (prefersReducedMotion()) {
        el.textContent = format(value);
        return;
      }
      const obj = { v: 0 };
      gsap.to(obj, {
        v: value,
        duration,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
        onUpdate: () => {
          el.textContent = format(obj.v);
        },
      });
      ScrollTrigger.refresh();
    },
    { scope: ref },
  );

  return (
    <span ref={ref} data-testid="counter" className={className}>
      {format(0)}
    </span>
  );
}
