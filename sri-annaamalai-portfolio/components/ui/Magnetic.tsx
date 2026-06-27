"use client";

import { useRef } from "react";
import { gsap, useGSAP, isFinePointer } from "@/lib/gsap";

/** Wraps a control so it eases toward the cursor while hovered. */
export default function Magnetic({
  children,
  className,
  strength = 0.35,
}: {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    (_context, contextSafe) => {
      if (!isFinePointer() || !ref.current || !contextSafe) return;
      const el = ref.current;
      const mx = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3" });
      const my = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3" });

      const move = contextSafe((e: MouseEvent) => {
        const r = el.getBoundingClientRect();
        mx((e.clientX - (r.left + r.width / 2)) * strength);
        my((e.clientY - (r.top + r.height / 2)) * strength);
      });
      const leave = contextSafe(() => {
        mx(0);
        my(0);
      });

      el.addEventListener("mousemove", move);
      el.addEventListener("mouseleave", leave);
      return () => {
        el.removeEventListener("mousemove", move);
        el.removeEventListener("mouseleave", leave);
      };
    },
    { scope: ref },
  );

  return (
    <span ref={ref} className={className} style={{ display: "inline-flex", willChange: "transform" }}>
      {children}
    </span>
  );
}
