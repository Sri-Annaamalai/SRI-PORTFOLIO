"use client";

import { useRef } from "react";
import { hero } from "@/lib/site";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
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
      if (!contextSafe || !root.current) return;

      // Establish the start state in GSAP's own transform model. The CSS
      // anti-flash rule pushes these down with a `translateY(120%)`, which
      // getComputedStyle reports back as a pixel matrix. GSAP would otherwise
      // parse that pixel value into `y` and stack `yPercent` on top, leaving a
      // leftover `y` after the reveal that keeps the line clipped out of view.
      // Pinning `y: 0` here makes GSAP own the whole transform, so animating
      // `yPercent -> 0` lands the line exactly at rest.
      const eyebrow = gsap.utils.toArray<HTMLElement>(".hero-eyebrow[data-hero-line]");
      const titleLines = gsap.utils.toArray<HTMLElement>(".hero-title [data-hero-line]");
      gsap.set(eyebrow, { yPercent: 120, y: 0 });

      // The headline is split per word, not per character: splitting into
      // characters breaks kerning at this display size, and the words are what
      // the eye reads as the beats of the title anyway. The line itself comes
      // to rest first; the words rise through the mask inside it.
      const splits = titleLines.map((line) => new SplitText(line, { type: "words" }));
      const words = splits.flatMap((s) => s.words as HTMLElement[]);
      gsap.set(titleLines, { yPercent: 0, y: 0 });
      gsap.set(words, { yPercent: 118, rotate: 7, transformOrigin: "0% 100%" });
      gsap.set("[data-hero-fade]", { y: 26, opacity: 0 });

      const play = contextSafe(() => {
        const tl = gsap.timeline();
        tl.to(eyebrow, { yPercent: 0, y: 0, duration: 1, ease: "power4.out" }, 0);
        tl.to(words, { yPercent: 0, rotate: 0, duration: 1.5, ease: "expo.out", stagger: 0.09 }, 0.05);
        // Camera settle: the title starts a touch large and eases back, the way
        // a handheld shot finds its frame.
        tl.fromTo(
          ".hero-title",
          { scale: 1.08, transformOrigin: "0% 55%" },
          { scale: 1, duration: 2.8, ease: "expo.out" },
          0,
        );
        tl.to(
          "[data-hero-fade]",
          { y: 0, opacity: 1, duration: 0.95, ease: "power3.out", stagger: 0.09 },
          0.55,
        );
        // Anamorphic streak: one slow horizontal sweep of light as the title lands.
        tl.fromTo(
          ".hero-flare",
          { xPercent: -110, opacity: 0 },
          { xPercent: 110, opacity: 1, duration: 2.1, ease: "power2.inOut" },
          0.25,
        );
        tl.to(".hero-flare", { opacity: 0, duration: 0.7, ease: "power1.in" }, 1.7);
      });

      // Scroll-out, shot as a dolly back from the title. The block drifts up,
      // shrinks and defocuses while each line slides sideways at its own
      // speed, so the headline breaks apart in depth instead of just fading.
      const out = gsap.timeline({
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: 0.7 },
      });
      out.to(".hero-inner", { scale: 0.9, yPercent: -7, opacity: 0, filter: "blur(14px)", ease: "none" }, 0);
      titleLines.forEach((line, i) => {
        out.to(line, { xPercent: [-5, 4, -3][i % 3], ease: "none" }, 0);
      });

      const off = onIntroDone(play);
      return () => {
        off();
        splits.forEach((s) => s.revert());
      };
    },
    { scope: root },
  );

  return (
    <section ref={root} id="home" className="hero">
      {/* The streak sweeps from beyond the left edge to beyond the right, so it
          lives in its own clipped box. Left unclipped, its parked end position
          widens the layout viewport on mobile browsers. */}
      <div className="hero-flare-clip" aria-hidden>
        <div className="hero-flare" />
      </div>
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
