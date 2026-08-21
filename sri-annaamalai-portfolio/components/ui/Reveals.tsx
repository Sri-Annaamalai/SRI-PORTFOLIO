"use client";

import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

/**
 * One controller for every scroll reveal on the page: clip-up headings,
 * fade-rise blocks, staggered cards, count-ups and parallaxing media.
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
    gsap.set("[data-line]", { yPercent: 115, y: 0 });
    gsap.set("[data-fade]", { y: 42, opacity: 0 });
    gsap.set("[data-card]", { y: 30, opacity: 0 });

    ScrollTrigger.batch("[data-line]", {
      start: "top 90%",
      onEnter: (els) =>
        gsap.to(els, { yPercent: 0, y: 0, duration: 1.1, ease: "power4.out", stagger: 0.1 }),
    });

    ScrollTrigger.batch("[data-fade]", {
      start: "top 88%",
      onEnter: (els) => gsap.to(els, { y: 0, opacity: 1, duration: 0.95, ease: "power3.out", stagger: 0.08 }),
    });

    ScrollTrigger.batch("[data-card]", {
      start: "top 90%",
      onEnter: (els) => gsap.to(els, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", stagger: 0.06 }),
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

    gsap.utils.toArray<HTMLElement>("[data-media]").forEach((el) => {
      gsap.fromTo(
        el,
        { y: 40 },
        {
          y: -40,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
        },
      );
    });

    ScrollTrigger.refresh();
  }, []);

  return null;
}
