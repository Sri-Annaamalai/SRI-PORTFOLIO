"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";
import { markIntroDone } from "@/lib/intro";
import { site } from "@/lib/site";

const unlock = () => document.documentElement.classList.remove("is-loading");

/**
 * Opening title sequence, shot as three beats:
 *
 *   1. Title card: the name sets in letter by letter over a counting timecode.
 *   2. Shutter: the black splits at the horizontal and parts to a 2.39:1
 *      letterbox. The hero plays its own intro inside that frame.
 *   3. Open up: the bars retract and the page takes the full screen.
 *
 * The black is two half-height panels rather than one overlay, which is what
 * lets beats 2 and 3 be a real aperture instead of a slide-away.
 */
export default function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const top = useRef<HTMLDivElement>(null);
  const bottom = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const name = useRef<HTMLDivElement>(null);
  const count = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el || !top.current || !bottom.current || !name.current) return;

      // Safety net: never trap the user behind the overlay.
      const safety = window.setTimeout(() => {
        gsap.set(el, { display: "none" });
        unlock();
        markIntroDone();
      }, 8000);

      // 2.39:1 is the cinema-scope ratio. On portrait screens the bars would
      // eat most of the viewport, so they are capped at a fifth of the height.
      const vh = window.innerHeight;
      const scope = (vh - window.innerWidth / 2.39) / 2;
      const letterbox = Math.round(Math.min(Math.max(scope, 0), vh * 0.2));

      const split = new SplitText(name.current, { type: "chars" });
      gsap.set(split.chars, { yPercent: 118, rotate: 7, transformOrigin: "0% 100%" });
      gsap.set(name.current, { visibility: "visible" });

      const counter = { v: 0 };
      const tl = gsap.timeline({
        onComplete: () => {
          window.clearTimeout(safety);
          ScrollTrigger.refresh();
        },
      });

      // Beat 1: title card.
      tl.fromTo(
        "[data-pl-meta]",
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power2.out", stagger: 0.08 },
        0,
      );
      tl.to(
        split.chars,
        { yPercent: 0, rotate: 0, duration: 1, ease: "expo.out", stagger: 0.03 },
        0.1,
      );
      tl.to(
        counter,
        {
          v: 100,
          duration: 1.4,
          ease: "power2.inOut",
          onUpdate: () => {
            if (count.current) count.current.textContent = String(Math.round(counter.v)).padStart(3, "0");
            if (bar.current) bar.current.style.transform = `scaleX(${counter.v / 100})`;
          },
        },
        0.1,
      );

      // Hold on the full title for a beat, then the letters leave upward.
      tl.to(split.chars, { yPercent: -118, rotate: -4, duration: 0.55, ease: "power3.in", stagger: 0.015 }, ">+0.1");
      tl.to(stage.current, { opacity: 0, duration: 0.3, ease: "power2.in" }, "<0.2");

      // Beat 2: shutter parts to the letterbox, and the hero starts.
      tl.to([top.current, bottom.current], { height: letterbox, duration: 0.95, ease: "expo.inOut" }, ">-0.05");
      tl.call(
        () => {
          el.style.pointerEvents = "none";
          markIntroDone();
        },
        undefined,
        "<0.3",
      );

      // Beat 3: hold inside the frame while the title lands, then open up.
      tl.to({}, { duration: letterbox > 0 ? 0.75 : 0.2 });
      tl.call(unlock);
      tl.to([top.current, bottom.current], { height: 0, duration: 1.1, ease: "expo.inOut" });
      tl.set(el, { display: "none" });

      return () => {
        window.clearTimeout(safety);
        split.revert();
      };
    },
    { scope: root },
  );

  return (
    <div ref={root} id="preloader" className="pl-root" aria-hidden>
      <div ref={top} className="pl-panel pl-panel-top" />
      <div ref={bottom} className="pl-panel pl-panel-bottom" />

      <div ref={stage} className="pl-stage">
        <div className="pl-row">
          <span data-pl-meta>Reel 2026</span>
          <span data-pl-meta>24 fps &middot; 2.39:1</span>
        </div>

        <div className="pl-title-wrap">
          <div ref={name} className="display pl-name">
            {site.name.replace(/ M$/, "")}
          </div>
          <div data-pl-meta className="pl-role">
            {site.discipline}
          </div>
        </div>

        <div>
          <div className="pl-row pl-row-end">
            <span data-pl-meta>Loading</span>
            <div ref={count} className="pl-count">
              000
            </div>
          </div>
          <div className="pl-bar-track">
            <div ref={bar} className="pl-bar" />
          </div>
        </div>
      </div>
    </div>
  );
}
