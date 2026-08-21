"use client";

import { useEffect } from "react";
import { isFinePointer } from "@/lib/gsap";

/**
 * Cursor-tracked spotlight for the stack and services matrices.
 *
 * Writes `--mx` / `--my` on the hovered cell, which the radial gradient in
 * `.matrix-cell::after` reads. Pointer position is a continuous value, so it
 * never touches React state: writes go straight to the element's style,
 * throttled to one per frame.
 */
export default function Spotlight() {
  useEffect(() => {
    if (!isFinePointer()) return;

    const cells = Array.from(document.querySelectorAll<HTMLElement>(".matrix-cell"));
    if (!cells.length) return;

    let frame = 0;
    let pending: { el: HTMLElement; x: number; y: number } | null = null;

    const flush = () => {
      frame = 0;
      if (!pending) return;
      const { el, x, y } = pending;
      el.style.setProperty("--mx", `${x}px`);
      el.style.setProperty("--my", `${y}px`);
      pending = null;
    };

    const onMove = (e: PointerEvent) => {
      const el = e.currentTarget as HTMLElement;
      const r = el.getBoundingClientRect();
      pending = { el, x: e.clientX - r.left, y: e.clientY - r.top };
      if (!frame) frame = requestAnimationFrame(flush);
    };

    // Re-centre on exit so the next hover does not snap in from a stale point.
    const onLeave = (e: PointerEvent) => {
      const el = e.currentTarget as HTMLElement;
      el.style.setProperty("--mx", "50%");
      el.style.setProperty("--my", "50%");
    };

    cells.forEach((el) => {
      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerleave", onLeave);
    });

    return () => {
      if (frame) cancelAnimationFrame(frame);
      cells.forEach((el) => {
        el.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerleave", onLeave);
      });
    };
  }, []);

  return null;
}
