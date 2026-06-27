"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { getLenis } from "@/lib/lenis";
import { site } from "@/lib/site";

/**
 * One-time intro: lock scroll, run a 000 -> 100 counter with a progress bar,
 * then wipe the panel up to reveal the page. Skipped under reduced motion.
 */
export default function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const num = useRef<HTMLSpanElement>(null);
  const [done, setDone] = useState(false);

  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        // Defer a frame so this isn't a synchronous setState inside the effect.
        requestAnimationFrame(() => setDone(true));
        return;
      }

      document.documentElement.classList.add("is-loading");
      getLenis()?.stop();

      const counter = { v: 0 };
      const tl = gsap.timeline({
        onComplete: () => {
          document.documentElement.classList.remove("is-loading");
          getLenis()?.start();
          setDone(true);
        },
      });

      tl.to(counter, {
        v: 100,
        duration: 1.7,
        ease: "power2.inOut",
        onUpdate: () => {
          if (num.current)
            num.current.textContent = String(Math.round(counter.v)).padStart(
              3,
              "0",
            );
        },
      })
        .to(".pl-bar", { scaleX: 1, duration: 1.7, ease: "power2.inOut" }, 0)
        .to(".pl-name", { yPercent: -110, duration: 0.7, ease: "power3.inOut" })
        .to(
          root.current,
          { yPercent: -100, duration: 0.9, ease: "power4.inOut" },
          "-=0.25",
        );
    },
    { scope: root },
  );

  if (done) return null;

  return (
    <div
      ref={root}
      data-testid="preloader"
      className="fixed inset-0 z-[120] flex flex-col items-center justify-center bg-bg"
    >
      <div className="overflow-hidden">
        <span className="pl-name block font-display text-2xl font-medium tracking-tight text-fg md:text-3xl">
          {site.name}
        </span>
      </div>

      <div className="mt-10 h-px w-56 overflow-hidden bg-line md:w-72">
        <div className="pl-bar h-full w-full origin-left scale-x-0 bg-accent" />
      </div>

      <span
        ref={num}
        className="mt-6 font-mono text-xs tracking-[0.3em] text-muted"
      >
        000
      </span>
    </div>
  );
}
