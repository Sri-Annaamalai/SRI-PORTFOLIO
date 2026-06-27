// Single, global GSAP + plugin registration. Import { gsap, ScrollTrigger, ... }
// from here everywhere. Never call registerPlugin inside a component.
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

// Guard against SSR: GSAP touches the DOM, so only register in the browser.
if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);
}

// Returns true when motion should be suppressed.
// Honors prefers-reduced-motion, with a manual override for testing:
//   /?motion=force  -> force all motion ON  (persists via localStorage)
//   /?motion=reduce -> force all motion OFF (clears the override)
export const prefersReducedMotion = () => {
  if (typeof window === "undefined") return false;
  try {
    const q = new URLSearchParams(window.location.search).get("motion");
    if (q === "force") window.localStorage.setItem("motion", "force");
    if (q === "reduce") window.localStorage.removeItem("motion");
    if (window.localStorage.getItem("motion") === "force") return false;
    if (q === "reduce") return true;
  } catch {
    // localStorage can throw in privacy modes; fall through to the media query.
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

export { gsap, ScrollTrigger, SplitText, useGSAP };
