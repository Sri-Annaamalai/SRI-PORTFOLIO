"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { nav, site } from "@/lib/site";

export default function Navbar() {
  const root = useRef<HTMLElement>(null);
  const overlay = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useGSAP(
    () => {
      // Bar drops in once on load (skipped under reduced motion).
      if (!prefersReducedMotion()) {
        gsap.from(root.current, {
          y: -24,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          delay: 0.2,
        });
      }

      // Solidify the bar once we scroll past the top. Fires only on crossing
      // the threshold, so React re-renders at most twice, not per frame.
      ScrollTrigger.create({
        start: 80,
        onEnter: () => setScrolled(true),
        onLeaveBack: () => setScrolled(false),
      });
    },
    { scope: root },
  );

  // Animate the full-screen mobile overlay open/closed.
  useGSAP(
    () => {
      if (!overlay.current) return;
      const links = overlay.current.querySelectorAll(".m-link");

      // Reduced motion: toggle instantly, no clip-path or stagger animation.
      if (prefersReducedMotion()) {
        gsap.set(overlay.current, {
          clipPath: open ? "inset(0% 0% 0% 0%)" : "inset(0% 0% 100% 0%)",
          pointerEvents: open ? "auto" : "none",
        });
        gsap.set(links, { yPercent: 0, opacity: 1 });
        return;
      }

      if (open) {
        gsap
          .timeline()
          .set(overlay.current, { pointerEvents: "auto" })
          .to(overlay.current, {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 0.6,
            ease: "power4.inOut",
          })
          .from(
            links,
            { yPercent: 120, opacity: 0, stagger: 0.07, duration: 0.5, ease: "power3.out" },
            "-=0.2",
          );
      } else {
        gsap.to(overlay.current, {
          clipPath: "inset(0% 0% 100% 0%)",
          duration: 0.5,
          ease: "power4.inOut",
          onComplete: () => {
            if (overlay.current) overlay.current.style.pointerEvents = "none";
          },
        });
      }
    },
    { dependencies: [open], scope: root },
  );

  return (
    <header
      ref={root}
      className="fixed inset-x-0 top-0 z-50"
    >
      <div
        className={`mx-auto flex h-16 max-w-[1400px] items-center justify-between px-5 transition-[background-color,backdrop-filter,border-color] duration-500 md:h-[72px] md:px-8 ${
          scrolled
            ? "border-b border-line bg-bg/70 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        {/* Wordmark */}
        <Link
          href="#top"
          className="font-display text-[15px] font-semibold tracking-tight text-fg"
          aria-label={`${site.name}, home`}
        >
          Sri Annaamalai<span className="text-accent">.</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-9 md:flex">
          {nav.map((item) => (
            <NavLink key={item.href} href={item.href} label={item.label} />
          ))}
          <Link
            href="#contact"
            className="rounded-full bg-accent px-5 py-2 font-mono text-[12px] font-medium uppercase tracking-wider text-accent-ink transition-transform duration-200 hover:-translate-y-px active:translate-y-0"
          >
            Start a project
          </Link>
        </nav>

        {/* Mobile trigger */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="relative z-50 flex h-9 w-9 flex-col items-center justify-center gap-[5px] md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          <span
            className={`h-px w-6 bg-fg transition-transform duration-300 ${
              open ? "translate-y-[3px] rotate-45" : ""
            }`}
          />
          <span
            className={`h-px w-6 bg-fg transition-transform duration-300 ${
              open ? "-translate-y-[3px] -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      {/* Full-screen mobile overlay */}
      <div
        ref={overlay}
        className="fixed inset-0 z-40 flex flex-col justify-between bg-surface px-6 pb-10 pt-28 md:hidden"
        style={{ clipPath: "inset(0% 0% 100% 0%)", pointerEvents: "none" }}
      >
        <nav className="flex flex-col gap-2">
          {nav.map((item) => (
            <div key={item.href} className="overflow-hidden">
              <Link
                href={item.href}
                onClick={() => setOpen(false)}
                className="m-link block font-display text-5xl font-medium tracking-tight text-fg"
              >
                {item.label}
              </Link>
            </div>
          ))}
        </nav>
        <div className="overflow-hidden">
          <Link
            href="#contact"
            onClick={() => setOpen(false)}
            className="m-link inline-block font-mono text-sm uppercase tracking-widest text-accent"
          >
            Start a project
          </Link>
        </div>
      </div>
    </header>
  );
}

/** Desktop nav item with a GSAP-driven vertical text-swap on hover. */
function NavLink({ href, label }: { href: string; label: string }) {
  const ref = useRef<HTMLAnchorElement>(null);

  useGSAP(
    (_ctx, contextSafe) => {
      const el = ref.current;
      const top = el?.querySelector(".nl-top");
      const bot = el?.querySelector(".nl-bot");
      if (!el || !top || !bot || !contextSafe) return;

      gsap.set(bot, { yPercent: 100 });

      const enter = contextSafe(() => {
        gsap.to(top, { yPercent: -100, duration: 0.4, ease: "power3.inOut" });
        gsap.to(bot, { yPercent: 0, duration: 0.4, ease: "power3.inOut" });
      });
      const leave = contextSafe(() => {
        gsap.to(top, { yPercent: 0, duration: 0.4, ease: "power3.inOut" });
        gsap.to(bot, { yPercent: 100, duration: 0.4, ease: "power3.inOut" });
      });

      el.addEventListener("mouseenter", enter);
      el.addEventListener("mouseleave", leave);
      return () => {
        el.removeEventListener("mouseenter", enter);
        el.removeEventListener("mouseleave", leave);
      };
    },
    { scope: ref },
  );

  return (
    <a
      ref={ref}
      href={href}
      className="relative block overflow-hidden font-mono text-[12px] uppercase leading-none tracking-wider"
    >
      <span className="nl-top block text-muted">{label}</span>
      <span className="nl-bot absolute left-0 top-0 block text-accent">
        {label}
      </span>
    </a>
  );
}
