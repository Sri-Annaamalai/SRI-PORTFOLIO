"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { chapters } from "@/lib/motion";

// The whole page is treated as a two-minute reel at 24 fps, so scroll position
// maps to a running timecode.
const FPS = 24;
const RUNTIME_SECONDS = 120;

const pad = (n: number) => String(n).padStart(2, "0");

function timecode(progress: number) {
  const frames = Math.round(progress * RUNTIME_SECONDS * FPS);
  const seconds = Math.floor(frames / FPS);
  return `${pad(Math.floor(seconds / 3600))}:${pad(Math.floor(seconds / 60) % 60)}:${pad(seconds % 60)}:${pad(frames % FPS)}`;
}

/**
 * Edge-of-frame readouts: a running timecode down the left gutter and the
 * current scene down the right. They sit in the page margin, so they only
 * render where the margin is wide enough to hold them (see globals.css).
 *
 * Text is written straight to the DOM from ScrollTrigger callbacks. A timecode
 * that changes every frame must not go through React state.
 */
export default function CinemaHUD() {
  const tc = useRef<HTMLSpanElement>(null);
  const scene = useRef<HTMLSpanElement>(null);
  const sceneNo = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    let last = "";
    const progress = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        const next = timecode(self.progress);
        if (next === last || !tc.current) return;
        tc.current.textContent = next;
        last = next;
      },
    });

    let current = 0;
    const cut = (index: number) => {
      const el = scene.current;
      if (!el || index === current) return;
      current = index;
      const c = chapters[index];
      // The label slides out along its reading direction and the next one
      // slides in behind it, like a ticker changing scene.
      gsap
        .timeline({ overwrite: true })
        .to(el, { yPercent: 120, opacity: 0, duration: 0.25, ease: "power2.in" })
        .call(() => {
          el.textContent = c.label;
          if (sceneNo.current) sceneNo.current.textContent = c.no;
        })
        .fromTo(el, { yPercent: -120, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.5, ease: "power3.out" });
    };

    const triggers = chapters.map((c, i) =>
      ScrollTrigger.create({
        trigger: `#${c.id}`,
        start: "top 55%",
        end: "bottom 55%",
        onToggle: (self) => self.isActive && cut(i),
      }),
    );

    return () => {
      progress.kill();
      triggers.forEach((t) => t.kill());
    };
  }, []);

  return (
    <>
      <div className="hud hud-left" aria-hidden>
        <span className="hud-dot" />
        <span ref={tc} className="hud-tc">
          00:00:00:00
        </span>
      </div>
      <div className="hud hud-right" aria-hidden>
        <span ref={sceneNo} className="hud-no">
          00
        </span>
        <span className="hud-slash">/</span>
        <span className="hud-clip">
          <span ref={scene} className="hud-scene">
            Title
          </span>
        </span>
      </div>
    </>
  );
}
