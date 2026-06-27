"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { stackGroups, vibeTools } from "@/lib/site";

// The AI groups carry the differentiator, so their titles take the accent.
const accentGroups = new Set(["AI / ML", "Local LLM"]);

export default function Stack() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      gsap.set(".stack-cell", { y: 32 });
      gsap.set(".vibe-tool", { y: 18 });

      ScrollTrigger.batch(".stack-cell", {
        start: "top 85%",
        onEnter: (els) =>
          gsap.to(els, {
            opacity: 1,
            y: 0,
            stagger: 0.08,
            duration: 0.7,
            ease: "power3.out",
          }),
      });

      ScrollTrigger.batch(".vibe-tool", {
        start: "top 92%",
        onEnter: (els) =>
          gsap.to(els, {
            opacity: 1,
            y: 0,
            stagger: 0.04,
            duration: 0.5,
            ease: "power3.out",
          }),
      });
    },
    { scope: root },
  );

  return (
    <section
      id="stack"
      ref={root}
      className="mx-auto max-w-[1400px] px-5 py-24 md:px-8 md:py-36"
    >
      <div className="mb-12 max-w-2xl md:mb-16">
        <h2 className="display text-[clamp(2.2rem,6vw,5rem)] font-semibold text-fg">
          The stack
        </h2>
        <p className="mt-5 text-base leading-relaxed text-muted md:text-lg">
          Full-stack from the database to the interface, with an AI layer that
          runs on hosted models and local metal alike.
        </p>
      </div>

      {/* Hairline grid: 1px gaps over the line color read as separators. */}
      <div className="grid grid-cols-1 gap-px bg-line sm:grid-cols-2 md:grid-cols-3">
        {stackGroups.map((group, i) => (
          <div
            key={group.title}
            className="stack-cell pre-anim bg-bg p-7 md:p-9"
          >
            <div className="flex items-baseline justify-between">
              <h3
                className={`font-display text-xl font-medium ${
                  accentGroups.has(group.title) ? "text-accent" : "text-fg"
                }`}
              >
                {group.title}
              </h3>
              <span className="font-mono text-xs text-faint">
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>
            <ul className="mt-5 flex flex-col gap-2.5">
              {group.items.map((item) => (
                <li key={item} className="text-sm text-muted md:text-base">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Build tools */}
      <div className="mt-16 md:mt-20">
        <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-faint">
          Tools in the workflow
        </h3>
        <div className="mt-6 flex flex-wrap gap-2.5">
          {vibeTools.map((tool) => (
            <span
              key={tool}
              className="vibe-tool pre-anim rounded-full border border-line-strong px-4 py-2 font-mono text-xs text-muted transition-colors hover:border-fg/50 hover:text-fg md:text-sm"
            >
              {tool}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
