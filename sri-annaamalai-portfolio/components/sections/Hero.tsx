"use client";

import { useRef } from "react";
import { hero } from "@/lib/site";
import { gsap, useGSAP } from "@/lib/gsap";
import { onIntroDone } from "@/lib/intro";
import { RevealLines } from "@/components/ui/RevealText";
import Magnetic from "@/components/ui/Magnetic";
import SmoothLink from "@/components/ui/SmoothLink";

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  // The hero owns its intro. It starts hidden via CSS and reveals itself when
  // the preloader signals it has cleared (selectors are scoped to this section).
  useGSAP(
    (_context, contextSafe) => {
      if (!contextSafe) return;
      // Establish the start state in GSAP's own transform model. The CSS
      // anti-flash rule pushes these down with a `translateY(120%)`, which
      // getComputedStyle reports back as a pixel matrix. GSAP would otherwise
      // parse that pixel value into `y` and stack `yPercent` on top, leaving a
      // leftover `y` after the reveal that keeps the line clipped out of view.
      // Pinning `y: 0` here makes GSAP own the whole transform, so animating
      // `yPercent -> 0` lands the line exactly at rest.
      gsap.set("[data-hero-line]", { yPercent: 120, y: 0 });
      gsap.set("[data-hero-fade]", { y: 26, opacity: 0 });
      const play = contextSafe(() => {
        gsap.to("[data-hero-line]", { yPercent: 0, y: 0, duration: 1.1, ease: "power4.out", stagger: 0.09 });
        gsap.to("[data-hero-fade]", { y: 0, opacity: 1, duration: 0.85, ease: "power3.out", stagger: 0.08, delay: 0.35 });
      });
      return onIntroDone(play);
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="home"
      className="relative flex min-h-[100svh] flex-col items-center justify-center text-center"
      style={{ padding: "120px clamp(20px,6vw,100px) 0" }}
    >
      <div className="overflow-hidden" style={{ marginBottom: "clamp(20px,4vh,40px)" }}>
        <div
          data-hero-line
          className="mono text-faint"
          style={{ fontSize: "clamp(11px,1.2vw,14px)", letterSpacing: "0.3em", textTransform: "uppercase" }}
        >
          {hero.eyebrowLead} <span className="text-coral">{hero.eyebrowAccent}</span>
        </div>
      </div>

      <h1 className="display m-0" style={{ lineHeight: 0.9, letterSpacing: "-0.035em", fontSize: "clamp(46px,10.5vw,168px)" }}>
        <RevealLines lines={hero.titleLines} attr="data-hero-line" className="block" />
      </h1>

      <p
        data-hero-fade
        className="text-muted"
        style={{ maxWidth: 620, margin: "clamp(26px,4vh,42px) auto 0", fontSize: "clamp(16px,1.5vw,20px)", lineHeight: 1.6 }}
      >
        {hero.blurb}
      </p>

      <div className="flex flex-wrap justify-center" data-hero-fade style={{ gap: 16, marginTop: "clamp(30px,5vh,48px)" }}>
        <Magnetic>
          <SmoothLink href="#work" className="btn-primary">
            View Work <span className="mono">→</span>
          </SmoothLink>
        </Magnetic>
        <Magnetic>
          <SmoothLink href="#contact" className="btn-ghost">
            Get in touch
          </SmoothLink>
        </Magnetic>
      </div>

      <div
        className="absolute flex flex-col items-center"
        style={{ bottom: 30, left: "50%", transform: "translateX(-50%)", gap: 12 }}
        aria-hidden
      >
        <span className="mono" style={{ fontSize: 10, letterSpacing: "0.3em", color: "var(--color-dim)", textTransform: "uppercase" }}>
          Scroll
        </span>
        <div style={{ position: "relative", width: 1, height: 46, background: "rgba(255,255,255,0.12)", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, width: 1, height: 14, background: "var(--color-coral)", animation: "scrolldot 1.8s ease-in-out infinite" }} />
        </div>
      </div>
    </section>
  );
}
