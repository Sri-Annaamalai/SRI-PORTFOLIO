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
        gsap.to("[data-hero-line]", {
          yPercent: 0,
          y: 0,
          duration: 1.1,
          ease: "power4.out",
          stagger: 0.09,
        });
        gsap.to("[data-hero-fade]", {
          y: 0,
          opacity: 1,
          duration: 0.85,
          ease: "power3.out",
          stagger: 0.08,
          delay: 0.35,
        });
      });
      return onIntroDone(play);
    },
    { scope: root },
  );

  return (
    <section ref={root} id="home" className="hero">
      <div className="hero-inner">
        <div className="line-mask">
          <div data-hero-line className="hero-eyebrow">
            {hero.eyebrowLead} <span className="text-coral">{hero.eyebrowAccent}</span>
          </div>
        </div>

        {/* Middle row absorbs the slack, so the headline block stays optically
            centred without the section ever exceeding the viewport. */}
        <div className="hero-body">
          <h1 className="hero-title display m-0">
            <RevealLines lines={hero.titleLines} attr="data-hero-line" className="block" />
          </h1>

          <p data-hero-fade className="hero-blurb">
            {hero.blurb}
          </p>

          <div data-hero-fade className="hero-cta">
            <Magnetic>
              <SmoothLink href="#work" className="btn-primary">
                View Work <span className="mono" aria-hidden>→</span>
              </SmoothLink>
            </Magnetic>
            <Magnetic>
              <SmoothLink href="#contact" className="btn-ghost">
                Contact
              </SmoothLink>
            </Magnetic>
          </div>
        </div>

        {/* Own grid row rather than `position: absolute`, so it can never land
            on the CTAs the way the old bottom-anchored cue did. */}
        <div className="hero-foot">
          <div className="scroll-cue" aria-hidden>
            <span className="scroll-cue-track">
              <span className="scroll-cue-run" />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
