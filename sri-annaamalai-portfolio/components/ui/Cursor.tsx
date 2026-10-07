"use client";

import { useRef } from "react";
import { gsap, useGSAP, isFinePointer } from "@/lib/gsap";

type CursorState = "idle" | "link" | "lens";

const STATES: Record<CursorState, gsap.TweenVars> = {
  idle: { scale: 1, borderColor: "rgba(255,90,60,0.7)", backgroundColor: "rgba(255,90,60,0)" },
  link: { scale: 1.9, borderColor: "rgba(160,107,255,0.9)", backgroundColor: "rgba(160,107,255,0)" },
  // Over a screenshot the ring opens into a soft lens, like a focus ring
  // settling on a subject.
  lens: { scale: 3.3, borderColor: "rgba(255,255,255,0.55)", backgroundColor: "rgba(255,90,60,0.1)" },
};

/** mix-blend cursor: a fast dot and a trailing ring that swells over targets. */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useGSAP((_context, contextSafe) => {
    if (!isFinePointer() || !dot.current || !ring.current || !contextSafe) return;
    const d = dot.current;
    const r = ring.current;

    document.documentElement.classList.add("cursor-on");

    const dx = gsap.quickTo(d, "x", { duration: 0.15, ease: "power3" });
    const dy = gsap.quickTo(d, "y", { duration: 0.15, ease: "power3" });
    const rx = gsap.quickTo(r, "x", { duration: 0.4, ease: "power3" });
    const ry = gsap.quickTo(r, "y", { duration: 0.4, ease: "power3" });

    // Fade in on the first real move. Revealing on mount parked the ring and
    // dot at 0,0, so a visitor who never moved the mouse saw a stray circle
    // pinned to the top-left corner.
    let shown = false;
    const move = contextSafe((e: MouseEvent) => {
      if (!shown) {
        shown = true;
        gsap.set([d, r], { x: e.clientX, y: e.clientY });
        gsap.to([d, r], { opacity: 1, duration: 0.25, ease: "power2.out" });
      }
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);
    });

    // Delegated, so the state follows whatever is under the pointer without
    // binding to elements that may mount later. `pointerover` fires on every
    // element crossed, which also covers the way back out to idle.
    let state: CursorState = "idle";
    const set = (next: CursorState) => {
      if (next === state) return;
      state = next;
      gsap.to(r, { ...STATES[next], duration: 0.35, ease: "power3.out", overwrite: "auto" });
    };
    const over = contextSafe((e: PointerEvent) => {
      const target = (e.target as Element | null)?.closest<HTMLElement>("a, button, [data-cursor]");
      if (!target) return set("idle");
      set(target.dataset.cursor === "lens" ? "lens" : "link");
    });

    window.addEventListener("mousemove", move);
    document.addEventListener("pointerover", over);

    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("pointerover", over);
      document.documentElement.classList.remove("cursor-on");
    };
  }, []);

  return (
    <>
      <div ref={ring} className="cursor-ring" aria-hidden />
      <div ref={dot} className="cursor-dot" aria-hidden />
    </>
  );
}
