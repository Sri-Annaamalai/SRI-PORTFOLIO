"use client";

import { gsap, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";

/** Hairlines that draw themselves in as their block enters. Each host gets a
 *  `::before` rule driven by the `--rule` custom property (see globals.css). */
const RULE_HOSTS = ".sec-head, .role-row, .cert-group, .work-index-row, .work-meta-row";

/**
 * One controller for every scroll reveal on the page: tilted line reveals,
 * focus-pull fades, staggered cards, drawn rules, scroll-lit statement text,
 * and count-ups.
 *
 * Mounting also flags the animation layer as live, which cancels the boot
 * failsafe in the root layout.
 */
export default function Reveals() {
  useGSAP(() => {
    const root = document.documentElement;
    root.classList.add("gsap-live");

    // Own the start state in GSAP's transform model so the percent-based line
    // reveals animate correctly. The CSS anti-flash rule offsets these with a
    // `translateY(115%)`, which getComputedStyle reports as a pixel matrix;
    // without pinning `y: 0` GSAP parses that into `y` and stacks `yPercent` on
    // top, leaving a leftover `y` that keeps the heading clipped after reveal.
    //
    // Lines also start rotated about their bottom-left corner, so a heading
    // swings up into the mask like a title card being flipped into frame.
    gsap.set("[data-line]", { yPercent: 115, y: 0, rotate: 4, transformOrigin: "0% 100%" });
    // Fades start soft as well as low: a focus pull, not just a slide.
    gsap.set("[data-fade]", { y: 42, opacity: 0, filter: "blur(7px)" });
    gsap.set("[data-card]", { y: 30, opacity: 0, scale: 0.985 });
    gsap.set(RULE_HOSTS, { "--rule": 0 });

    ScrollTrigger.batch("[data-line]", {
      start: "top 90%",
      onEnter: (els) =>
        gsap.to(els, { yPercent: 0, y: 0, rotate: 0, duration: 1.35, ease: "expo.out", stagger: 0.12 }),
    });

    ScrollTrigger.batch("[data-fade]", {
      start: "top 88%",
      onEnter: (els) =>
        gsap.to(els, {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 1.1,
          ease: "power3.out",
          stagger: 0.09,
          // Drop the filter once resolved: a blur(0) layer still costs a
          // compositing pass for as long as it stays on the element.
          clearProps: "filter",
        }),
    });

    ScrollTrigger.batch("[data-card]", {
      start: "top 90%",
      onEnter: (els) =>
        gsap.to(els, { y: 0, opacity: 1, scale: 1, duration: 0.9, ease: "power3.out", stagger: 0.07 }),
    });

    ScrollTrigger.batch(RULE_HOSTS, {
      start: "top 92%",
      onEnter: (els) => gsap.to(els, { "--rule": 1, duration: 1.5, ease: "expo.inOut", stagger: 0.1 }),
    });

    // Statement text lights up word by word as you scroll through it, like
    // subtitles being read aloud. Scrubbed, so scrolling back dims it again.
    const splits: SplitText[] = [];
    gsap.utils.toArray<HTMLElement>("[data-scrub]").forEach((el) => {
      const split = new SplitText(el, { type: "words" });
      splits.push(split);
      gsap.fromTo(
        split.words,
        { opacity: 0.14 },
        {
          opacity: 1,
          ease: "none",
          stagger: 0.12,
          scrollTrigger: { trigger: el, start: "top 82%", end: "bottom 48%", scrub: 0.6 },
        },
      );
    });

    // End card: the outlined name is wiped in left to right as it climbs into
    // view. It completes when the card's bottom edge meets the viewport's, so
    // it is always finished before the page runs out of scroll. (The insets
    // overshoot slightly so the stroke at the glyph edges is never clipped.)
    gsap.utils.toArray<HTMLElement>("[data-endcard]").forEach((el) => {
      gsap.fromTo(
        el,
        { clipPath: "inset(-6% 100% -6% -2%)" },
        {
          clipPath: "inset(-6% -2% -6% -2%)",
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom bottom", scrub: 0.8 },
        },
      );
    });

    gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
      const end = parseFloat(el.dataset.count || "0");
      const suffix = el.dataset.suffix || "";
      ScrollTrigger.create({
        trigger: el,
        start: "top 92%",
        once: true,
        onEnter: () => {
          const o = { v: 0 };
          gsap.to(o, {
            v: end,
            duration: 1.6,
            ease: "power2.out",
            onUpdate: () => {
              el.textContent = Math.round(o.v) + suffix;
            },
          });
        },
      });
    });

    ScrollTrigger.refresh();

    return () => splits.forEach((s) => s.revert());
  }, []);

  return null;
}
