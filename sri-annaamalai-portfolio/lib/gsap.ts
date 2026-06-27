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

export { gsap, ScrollTrigger, useGSAP };
