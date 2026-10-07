"use client";

import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { onIntroDone } from "@/lib/intro";
import { chapters, orbState } from "@/lib/motion";

/**
 * Directs the fixed WebGL set. Renders nothing: it only wires ScrollTriggers
 * and the intro cue to the shared `orbState` the scene reads each frame.
 *
 * - Each section is a chapter. When one becomes the active scene the camera
 *   cuts to that chapter's pose, tweened with a long in-out ease so it reads
 *   as a camera move rather than a snap.
 * - When the preloader clears, the globe assembles out of a scattered cloud.
 */
export default function OrbDirector() {
  useGSAP(() => {
    const triggers = chapters.map((c) =>
      ScrollTrigger.create({
        trigger: `#${c.id}`,
        start: "top 60%",
        end: "bottom 60%",
        onToggle: (self) => {
          if (!self.isActive) return;
          // overwrite "auto" only kills tweens on the same properties, so a
          // chapter cut never cancels the assemble / intro tweens below.
          gsap.to(orbState, { ...c.orb, duration: 1.9, ease: "power3.inOut", overwrite: "auto" });
        },
      }),
    );

    const off = onIntroDone(() => {
      gsap.to(orbState, { assemble: 1, duration: 3, ease: "expo.out" });
      gsap.to(orbState, { intro: 1, duration: 1.8, ease: "power2.out" });
    });

    return () => {
      triggers.forEach((t) => t.kill());
      off();
    };
  }, []);

  return null;
}
