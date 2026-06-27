"use client";

import { useRef } from "react";
import Link from "next/link";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { projects } from "@/lib/projects";

export default function Projects() {
  const root = useRef<HTMLElement>(null);
  const preview = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const xTo = useRef<((v: number) => void) | null>(null);
  const yTo = useRef<((v: number) => void) | null>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      // Rows reveal as the section enters.
      gsap.set(".proj-row", { y: 38 });
      gsap.to(".proj-row", {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: { trigger: root.current, start: "top 75%" },
      });

      // Floating preview follows the cursor on its own smoothed clock.
      if (preview.current) {
        gsap.set(preview.current, { xPercent: -50, yPercent: -50, autoAlpha: 0 });
        xTo.current = gsap.quickTo(preview.current, "x", {
          duration: 0.5,
          ease: "power3",
        });
        yTo.current = gsap.quickTo(preview.current, "y", {
          duration: 0.5,
          ease: "power3",
        });
      }
    },
    { scope: root },
  );

  const onMove = (e: React.MouseEvent) => {
    xTo.current?.(e.clientX);
    yTo.current?.(e.clientY);
  };

  const onEnter = (src: string) => {
    if (prefersReducedMotion() || !preview.current || !imgRef.current) return;
    imgRef.current.src = src;
    gsap.to(preview.current, {
      autoAlpha: 1,
      scale: 1,
      duration: 0.45,
      ease: "power3.out",
    });
  };

  const onLeave = () => {
    if (!preview.current) return;
    gsap.to(preview.current, {
      autoAlpha: 0,
      scale: 0.92,
      duration: 0.3,
      ease: "power3.out",
    });
  };

  return (
    <section
      id="work"
      ref={root}
      className="mx-auto max-w-[1400px] px-5 py-24 md:px-8 md:py-36"
    >
      <div className="mb-12 flex flex-wrap items-end justify-between gap-4 md:mb-16">
        <h2 className="display text-[clamp(2.2rem,6vw,5rem)] font-semibold text-fg">
          Selected work
        </h2>
        <span className="font-mono text-xs uppercase tracking-[0.18em] text-faint">
          {String(projects.length).padStart(2, "0")} projects
        </span>
      </div>

      <ul>
        {projects.map((p) => (
          <li key={p.slug}>
            <Link
              href={`/work/${p.slug}`}
              onMouseEnter={() => onEnter(p.image)}
              onMouseLeave={onLeave}
              onMouseMove={onMove}
              className="proj-row pre-anim group grid grid-cols-12 items-baseline gap-x-4 gap-y-3 border-t border-line py-7 transition-colors duration-300 last:border-b hover:border-line-strong md:py-9"
            >
              <span className="col-span-2 font-mono text-xs text-faint md:col-span-1">
                {p.index}
              </span>

              <div className="col-span-10 md:col-span-5">
                <h3 className="display text-3xl font-medium text-fg transition-colors duration-300 group-hover:text-accent md:text-5xl">
                  {p.title}
                </h3>
              </div>

              <span className="col-span-6 text-sm text-muted md:col-span-3">
                {p.role}
              </span>

              <div className="col-span-6 flex flex-wrap items-center gap-x-3 gap-y-1 md:col-span-3 md:justify-end">
                <span className="font-mono text-xs text-faint">{p.year}</span>
                <span className="font-mono text-xs text-muted">{p.domain}</span>
                <span
                  aria-hidden
                  className="text-fg opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100"
                >
                  &rarr;
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      {/* Cursor-following preview (desktop only, progressive enhancement) */}
      <div
        ref={preview}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-30 hidden h-60 w-80 overflow-hidden rounded-lg border border-line-strong md:block"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imgRef}
          alt=""
          className="h-full w-full object-cover"
          src={projects[0].image}
        />
      </div>
    </section>
  );
}
