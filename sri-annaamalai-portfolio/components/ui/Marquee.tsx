"use client";

import { useRef } from "react";
import { marquee } from "@/lib/site";
import { gsap, useGSAP } from "@/lib/gsap";
import { getLenis } from "@/lib/lenis";

function Sequence({ hidden }: { hidden?: boolean }) {
  return (
    <span style={{ display: "flex", alignItems: "center" }} aria-hidden={hidden}>
      {marquee.map((item, i) => (
        <span key={i} style={{ display: "inline-flex", alignItems: "center" }}>
          {item}
          <span
            style={{ color: i % 2 === 0 ? "var(--color-coral)" : "var(--color-violet)", margin: "0 28px" }}
          >
            ✦
          </span>
        </span>
      ))}
    </span>
  );
}

/**
 * Ticker that reacts to the scroll. It idles at a steady crawl, then speeds up
 * with scroll velocity, flips direction when you scroll back up, and leans
 * into the motion with a skew, the way a title crawl catches a whip-pan.
 */
export default function Marquee() {
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = track.current;
      if (!el) return;

      // The row is two identical sequences, so -50% lands the second exactly
      // where the first started and the loop has no seam.
      const tween = gsap.to(el, { xPercent: -50, duration: 32, ease: "none", repeat: -1 });
      const setSkew = gsap.quickSetter(el, "skewX", "deg");

      let dir = 1;
      let boost = 1;
      let lean = 0;
      // Time-based smoothing (dtMs), so the feel does not depend on frame rate.
      const tick = (_time: number, dtMs: number) => {
        const dt = Math.min(dtMs, 100) / 1000;
        const v = getLenis()?.velocity ?? 0;
        if (v > 0.5) dir = 1;
        else if (v < -0.5) dir = -1;
        boost += (1 + Math.min(Math.abs(v) * 0.14, 8) - boost) * (1 - Math.exp(-dt * 5));
        lean += (gsap.utils.clamp(-9, 9, -v * 0.3) - lean) * (1 - Math.exp(-dt * 6));
        tween.timeScale(dir * boost);
        setSkew(Math.abs(lean) < 0.01 ? 0 : lean);
      };
      gsap.ticker.add(tick);
      return () => gsap.ticker.remove(tick);
    },
    { scope: track },
  );

  return (
    <div
      style={{
        borderTop: "1px solid rgba(255,255,255,0.08)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        padding: "22px 0",
        overflow: "hidden",
        background: "rgba(10,10,12,0.5)",
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        ref={track}
        style={{
          display: "flex",
          width: "max-content",
          willChange: "transform",
          fontFamily: "var(--font-mono), monospace",
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          fontSize: "clamp(14px,1.6vw,20px)",
          color: "var(--color-soft)",
        }}
      >
        <Sequence />
        <Sequence hidden />
      </div>
    </div>
  );
}
