"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// Register once, on the client only. Safe to import from any client component.
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export const isFinePointer = (): boolean =>
  typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches;

/**
 * The CSS `prefers-reduced-motion` backstop cannot stop a rAF-driven tween, so
 * every GSAP entry point has to check this in JS as well. Read at call time
 * rather than cached: the OS setting can flip while the tab is open.
 */
export const prefersReducedMotion = (): boolean =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export { gsap, ScrollTrigger, useGSAP };
