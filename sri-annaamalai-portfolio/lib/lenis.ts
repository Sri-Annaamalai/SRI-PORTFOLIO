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
  if (instance) {
    instance.scrollTo(el as HTMLElement, { offset: -10, duration: 1.4 });
  } else {
    el.scrollIntoView({ behavior: "smooth" });
  }
}
