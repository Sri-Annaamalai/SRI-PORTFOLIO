import type Lenis from "lenis";

// Module singleton so velocity-reactive components (marquee, cursor) can read
// the live Lenis instance without prop-drilling or context re-renders.
let instance: Lenis | null = null;

export const setLenis = (l: Lenis | null) => {
  instance = l;
};

export const getLenis = () => instance;
