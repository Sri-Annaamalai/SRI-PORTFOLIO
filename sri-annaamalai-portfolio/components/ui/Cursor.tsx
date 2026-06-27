"use client";

import { useRef } from "react";
import { gsap, useGSAP, isFinePointer } from "@/lib/gsap";

/** mix-blend cursor: a fast dot and a trailing ring that swells over targets. */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useGSAP((_context, contextSafe) => {
    if (!isFinePointer() || !dot.current || !ring.current || !contextSafe) return;
    const d = dot.current;
    const r = ring.current;

    document.documentElement.classList.add("cursor-on");
    gsap.set([d, r], { opacity: 1 });

    const dx = gsap.quickTo(d, "x", { duration: 0.15, ease: "power3" });
    const dy = gsap.quickTo(d, "y", { duration: 0.15, ease: "power3" });
    const rx = gsap.quickTo(r, "x", { duration: 0.4, ease: "power3" });
    const ry = gsap.quickTo(r, "y", { duration: 0.4, ease: "power3" });

    const move = contextSafe((e: MouseEvent) => {
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);
    });
    const grow = contextSafe(() => gsap.to(r, { scale: 1.9, borderColor: "rgba(160,107,255,0.9)", duration: 0.3 }));
    const shrink = contextSafe(() => gsap.to(r, { scale: 1, borderColor: "rgba(255,90,60,0.7)", duration: 0.3 }));

    window.addEventListener("mousemove", move);
    const targets = Array.from(document.querySelectorAll("a, button, [data-cursor]"));
    targets.forEach((el) => {
      el.addEventListener("mouseenter", grow);
      el.addEventListener("mouseleave", shrink);
    });

    return () => {
      window.removeEventListener("mousemove", move);
      targets.forEach((el) => {
        el.removeEventListener("mouseenter", grow);
        el.removeEventListener("mouseleave", shrink);
      });
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
