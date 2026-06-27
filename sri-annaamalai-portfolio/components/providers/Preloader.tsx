"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { markIntroDone } from "@/lib/intro";

const unlock = () => document.documentElement.classList.remove("is-loading");

export default function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const count = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;

      // Safety net: never trap the user behind the overlay.
      const safety = window.setTimeout(() => {
        gsap.set(el, { display: "none" });
        unlock();
        markIntroDone();
      }, 6500);

      const tl = gsap.timeline({
        onComplete: () => {
          window.clearTimeout(safety);
          ScrollTrigger.refresh();
        },
      });

      const counter = { v: 0 };
      tl.to(counter, {
        v: 100,
        duration: 1.5,
        ease: "power2.inOut",
        onUpdate: () => {
          if (count.current) count.current.textContent = String(Math.round(counter.v)).padStart(3, "0");
          if (bar.current) bar.current.style.transform = `scaleX(${counter.v / 100})`;
        },
      });

      tl.to(el.querySelectorAll("[data-pl]"), { yPercent: -120, duration: 0.6, ease: "power3.in", stagger: 0.06 }, "-=0.15");
      tl.to(el, { yPercent: -100, duration: 0.9, ease: "power4.inOut", onStart: unlock }, "-=0.1");
      // Cue the hero's own (scoped) intro as the overlay slides away.
      tl.call(markIntroDone, undefined, "-=0.55");
      tl.set(el, { display: "none" });
    },
    { scope: root },
  );

  return (
    <div
      ref={root}
      id="preloader"
      className="fixed inset-0 z-[100] flex flex-col justify-end bg-bg"
      style={{ padding: "clamp(24px,5vw,64px)" }}
    >
      <div className="overflow-hidden">
        <div data-pl className="mono mb-[18px] text-faint" style={{ fontSize: 12, letterSpacing: "0.25em", textTransform: "uppercase" }}>
          Portfolio — Sri Annaamalai M
        </div>
      </div>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="overflow-hidden">
          <div
            data-pl
            className="display"
            style={{ fontSize: "clamp(48px,10vw,140px)", lineHeight: 0.9, letterSpacing: "-0.03em", textTransform: "none" }}
          >
            Loading
          </div>
        </div>
        <div className="overflow-hidden">
          <div
            data-pl
            ref={count}
            className="mono text-coral"
            style={{ fontSize: "clamp(40px,7vw,96px)", fontWeight: 700, lineHeight: 1 }}
          >
            000
          </div>
        </div>
      </div>
      <div className="mt-7 h-px w-full overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
        <div ref={bar} className="h-full w-full origin-left bg-coral" style={{ transform: "scaleX(0)" }} />
      </div>
    </div>
  );
}
