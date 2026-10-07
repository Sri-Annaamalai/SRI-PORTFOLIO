"use client";

import { gsap, useGSAP, isFinePointer } from "@/lib/gsap";
import { getLenis } from "@/lib/lenis";

/**
 * Cinematic treatment for the work screenshots. Finds every `[data-tilt]`
 * frame and gives it:
 *
 *   - a clip-path "iris" reveal and a slow dolly-in, both scrubbed to scroll
 *   - a vertical parallax drift of the image inside its frame
 *   - a 3D tilt toward the pointer, with a specular glare that tracks it and
 *     the image sliding the opposite way for depth
 *   - a liquid ripple (SVG displacement) when the pointer enters
 *   - a small lean into the scroll direction, driven by Lenis velocity
 *
 * Pointer position is a continuous value, so none of it touches React state:
 * everything runs through gsap.quickTo and direct style writes.
 */
export default function MediaFX() {
  useGSAP((_context, contextSafe) => {
    const frames = gsap.utils.toArray<HTMLElement>("[data-tilt]");
    if (!frames.length || !contextSafe) return;

    const fine = isFinePointer();
    const disp = document.querySelector<SVGFEDisplacementMapElement>("#liquid-disp");
    const cleanups: Array<() => void> = [];

    frames.forEach((frame) => {
      const card = frame.querySelector<HTMLElement>(".media-card");
      const layer = frame.querySelector<HTMLElement>(".media-layer");
      const glare = frame.querySelector<HTMLElement>(".media-glare");
      if (!card || !layer) return;

      // Iris reveal. The corner radius rides along in the clip so the card
      // keeps its rounded edge while it opens.
      gsap.fromTo(
        card,
        { clipPath: "inset(13% 9% 13% 9% round 16px)" },
        {
          clipPath: "inset(0% 0% 0% 0% round 16px)",
          ease: "none",
          scrollTrigger: { trigger: frame, start: "top 96%", end: "top 42%", scrub: 0.6 },
        },
      );
      // Dolly-in, then a parallax drift. Different properties on the same
      // layer (scale vs yPercent), so the two scrubs never contend. The layer
      // finishes slightly over-scaled so neither the drift nor the pointer
      // parallax can expose an edge.
      gsap.fromTo(
        layer,
        { scale: 1.3 },
        {
          scale: 1.07,
          ease: "none",
          scrollTrigger: { trigger: frame, start: "top 96%", end: "top 42%", scrub: 0.6 },
        },
      );
      gsap.fromTo(
        layer,
        { yPercent: -1.8 },
        {
          yPercent: 1.8,
          ease: "none",
          scrollTrigger: { trigger: frame, start: "top bottom", end: "bottom top", scrub: true },
        },
      );

      // Lean into the scroll: a few degrees of skew that follow Lenis velocity.
      const setLean = gsap.quickSetter(frame, "skewY", "deg");
      let lean = 0;
      // Time-based smoothing (dtMs), so the settle takes the same wall-clock
      // time at 60Hz, 144Hz, or on a machine that is dropping frames.
      const tick = (_time: number, dtMs: number) => {
        const v = getLenis()?.velocity ?? 0;
        const k = 1 - Math.exp(-(Math.min(dtMs, 100) / 1000) * 7);
        lean += (gsap.utils.clamp(-2.4, 2.4, -v * 0.045) - lean) * k;
        setLean(Math.abs(lean) < 0.01 ? 0 : lean);
      };
      gsap.ticker.add(tick);
      cleanups.push(() => gsap.ticker.remove(tick));

      if (!fine) return;

      const rx = gsap.quickTo(card, "rotationX", { duration: 0.7, ease: "power3" });
      const ry = gsap.quickTo(card, "rotationY", { duration: 0.7, ease: "power3" });
      const lx = gsap.quickTo(layer, "x", { duration: 0.9, ease: "power3" });
      const ly = gsap.quickTo(layer, "y", { duration: 0.9, ease: "power3" });

      const onMove = contextSafe((e: PointerEvent) => {
        // Measured on the frame, not the card: the card is the thing rotating,
        // so its own box would shift under the pointer and feed back.
        const r = frame.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        ry(px * 11);
        rx(-py * 9);
        lx(-px * 16);
        ly(-py * 12);
        if (glare) {
          glare.style.setProperty("--gx", `${(px + 0.5) * 100}%`);
          glare.style.setProperty("--gy", `${(py + 0.5) * 100}%`);
        }
      });
      const onEnter = contextSafe(() => {
        if (!disp) return;
        // The filter is only attached for the length of the ripple. Left on,
        // it would re-rasterise the image on every scroll frame.
        layer.style.filter = "url(#liquid)";
        gsap.fromTo(
          disp,
          { attr: { scale: 0 } },
          {
            attr: { scale: 38 },
            duration: 0.5,
            ease: "power2.out",
            yoyo: true,
            repeat: 1,
            overwrite: true,
            onComplete: () => {
              layer.style.filter = "";
            },
          },
        );
      });
      const onLeave = contextSafe(() => {
        rx(0);
        ry(0);
        lx(0);
        ly(0);
      });

      frame.addEventListener("pointermove", onMove);
      frame.addEventListener("pointerenter", onEnter);
      frame.addEventListener("pointerleave", onLeave);
      cleanups.push(() => {
        frame.removeEventListener("pointermove", onMove);
        frame.removeEventListener("pointerenter", onEnter);
        frame.removeEventListener("pointerleave", onLeave);
      });
    });

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return null;
}
