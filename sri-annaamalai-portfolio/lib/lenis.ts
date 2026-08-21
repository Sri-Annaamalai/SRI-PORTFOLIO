"use client";

import type Lenis from "lenis";

// Module singleton so any component (e.g. the nav) can drive the shared
// smooth-scroll instance without prop drilling.
let instance: Lenis | null = null;

export const setLenis = (l: Lenis | null) => {
  instance = l;
};

export const getLenis = (): Lenis | null => instance;

/** Smooth-scroll to a section by selector, falling back to native behaviour. */
export function scrollToSection(selector: string) {
  const el = document.querySelector(selector);
  if (!el) return;

  // Offset by the live nav height rather than a flat -10, so the target
  // section's index rail and heading clear the fixed bar. The native path
  // gets the same result from `scroll-margin-top` in globals.css.
  const nav = document.querySelector(".site-nav");
  const offset = nav ? -(nav.getBoundingClientRect().height + 20) : -10;

  if (instance) {
    instance.scrollTo(el as HTMLElement, { offset, duration: 1.4 });
  } else {
    el.scrollIntoView({ behavior: "smooth" });
  }
}
