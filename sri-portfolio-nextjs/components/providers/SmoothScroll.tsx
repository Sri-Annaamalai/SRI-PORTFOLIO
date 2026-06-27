"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { setLenis } from "@/lib/lenis";

/**
 * Page-wide Lenis smooth scroll, tuned for weighted, trionn-style momentum
 * (lerp mode, not a fixed duration). Driven off GSAP's ticker so Lenis and
 * ScrollTrigger share one clock. Disabled under prefers-reduced-motion.
 */
export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const reduced = prefersReducedMotion();
    if (process.env.NODE_ENV !== "production") {
      console.info(
        reduced
          ? "[motion] OFF - prefers-reduced-motion is ON (Windows 'Animation effects' likely off). Open /?motion=force to override."
          : "[motion] ON - Lenis smooth scroll active.",
      );
    }
    if (reduced) return;

    const lenis = new Lenis({
      lerp: 0.08, // low = heavy, continuous glide (the "buttery" feel)
      wheelMultiplier: 1,
      smoothWheel: true,
      syncTouch: false,
      touchMultiplier: 1.5,
      autoRaf: false, // we drive raf ourselves via the GSAP ticker below
    });
    setLenis(lenis);

    // Keep ScrollTrigger in sync with Lenis' virtual scroll position.
    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Recalculate trigger positions once layout/fonts settle.
    const refresh = () => ScrollTrigger.refresh();
    requestAnimationFrame(refresh);
    window.addEventListener("resize", refresh);

    // Anchor links hand off to Lenis for a weighted scroll-to.
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest<HTMLAnchorElement>('a[href^="#"]');
      if (!link) return;
      const id = link.getAttribute("href");
      if (!id || id === "#") return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el as HTMLElement, { offset: 0, duration: 1.4 });
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("resize", refresh);
      gsap.ticker.remove(raf);
      setLenis(null);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
