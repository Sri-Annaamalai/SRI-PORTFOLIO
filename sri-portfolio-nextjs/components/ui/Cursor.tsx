"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

/**
 * trionn-style cursor: a small circle with mix-blend-difference that follows
 * the pointer on a lagged clock and scales up over interactive elements.
 * Desktop + fine-pointer only; never touch, never reduced-motion. The native
 * cursor is hidden via CSS only while this is active (keyboard nav unaffected).
 */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const el = dot.current;
    if (!el) return;

    document.documentElement.classList.add("cursor-on");
    gsap.set(el, { xPercent: -50, yPercent: -50, scale: 0, opacity: 0 });

    const xTo = gsap.quickTo(el, "x", { duration: 0.45, ease: "power3" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.45, ease: "power3" });

    let shown = false;
    const move = (e: PointerEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      if (!shown) {
        shown = true;
        gsap.to(el, { scale: 1, opacity: 1, duration: 0.3, ease: "power3.out" });
      }
    };

    const over = (e: PointerEvent) => {
      const interactive = (e.target as HTMLElement).closest(
        "a, button, input, textarea, [data-cursor]",
      );
      gsap.to(el, {
        scale: interactive ? 2.8 : 1,
        duration: 0.3,
        ease: "power3.out",
      });
    };

    const leaveWindow = () => gsap.to(el, { opacity: 0, duration: 0.2 });
    const enterWindow = () => gsap.to(el, { opacity: 1, duration: 0.2 });

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerover", over);
    document.addEventListener("pointerleave", leaveWindow);
    document.addEventListener("pointerenter", enterWindow);

    return () => {
      document.documentElement.classList.remove("cursor-on");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      document.removeEventListener("pointerleave", leaveWindow);
      document.removeEventListener("pointerenter", enterWindow);
    };
  }, []);

  return (
    <div
      ref={dot}
      aria-hidden
      data-testid="cursor"
      className="pointer-events-none fixed left-0 top-0 z-[100] hidden h-4 w-4 rounded-full bg-white mix-blend-difference md:block"
    />
  );
}
