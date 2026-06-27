"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { gsap, SplitText, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { marquee, site } from "@/lib/site";
import Marquee from "@/components/ui/Marquee";
import Magnetic from "@/components/ui/Magnetic";

// WebGL never runs on the server.
const Scene = dynamic(() => import("@/components/canvas/Scene"), {
  ssr: false,
});

export default function Hero() {
  const root = useRef<HTMLDivElement>(null);
  const headline = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const reduce = prefersReducedMotion();
      if (reduce) return;

      // Load-in for the supporting elements.
      gsap.to(".hero-fade", {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.12,
        delay: 0.5,
      });

      // SplitText headline. Wait for fonts so lines do not re-wrap mid-reveal.
      let split: SplitText | null = null;
      document.fonts.ready.then(() => {
        if (!headline.current) return;
        split = new SplitText(headline.current, {
          type: "lines,chars",
          linesClass: "split-mask",
        });
        gsap.set(headline.current, { opacity: 1 });
        gsap.from(split.chars, {
          yPercent: 120,
          opacity: 0,
          duration: 0.9,
          ease: "power4.out",
          stagger: 0.014,
          delay: 0.35,
        });
      });

      return () => split?.revert();
    },
    { scope: root },
  );

  return (
    <>
      <section
        id="top"
        ref={root}
        className="relative isolate min-h-[100dvh] overflow-hidden"
      >
        {/* Atmospheric depth (intentional glow, not decoration) */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(120%_90%_at_75%_15%,rgba(198,255,58,0.10),transparent_55%)]"
        />
        {/* WebGL particle field */}
        <div className="absolute inset-0 z-0">
          <Scene />
        </div>
        {/* Bottom fade so the headline always stays legible over the canvas */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-1/2 bg-gradient-to-t from-bg via-bg/70 to-transparent"
        />

        <div className="relative z-10 mx-auto flex min-h-[100dvh] max-w-[1400px] flex-col justify-end px-5 pb-14 pt-28 md:px-8 md:pb-20">
          <p className="hero-fade pre-anim mb-6 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-muted md:mb-8">
            <span>{site.roleLong}</span>
          </p>

          <h1
            ref={headline}
            data-testid="hero-headline"
            className="display pre-anim max-w-[16ch] text-[clamp(2.6rem,8.2vw,7rem)] font-semibold text-fg"
          >
            I build products and AI systems that ship.
          </h1>

          <div className="mt-9 grid gap-8 md:mt-12 md:grid-cols-12 md:items-end">
            <p className="hero-fade pre-anim max-w-md text-base leading-relaxed text-muted md:col-span-6 md:text-lg">
              At {site.company} I work where frontend engineering meets Agentic
              AI, turning complex pipelines into products people use.
            </p>
            <div className="hero-fade pre-anim flex flex-wrap items-center gap-3 md:col-span-6 md:justify-self-end">
              <Magnetic strength={0.5}>
                <Link
                  href="#contact"
                  className="block rounded-full bg-accent px-6 py-3 font-mono text-[12px] font-medium uppercase tracking-wider text-accent-ink"
                >
                  Start a project
                </Link>
              </Magnetic>
              <Magnetic strength={0.5}>
                <Link
                  href="#work"
                  className="block rounded-full border border-line-strong px-6 py-3 font-mono text-[12px] font-medium uppercase tracking-wider text-fg transition-colors duration-200 hover:border-fg/60"
                >
                  View work
                </Link>
              </Magnetic>
            </div>
          </div>
        </div>
      </section>

      <Marquee items={marquee} />
    </>
  );
}
