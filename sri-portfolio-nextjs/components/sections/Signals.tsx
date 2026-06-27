"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { site, writing } from "@/lib/site";

export default function Signals() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.set(".reveal", { y: 36 });
      gsap.to(".reveal", {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: { trigger: root.current, start: "top 75%" },
      });
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      className="mx-auto max-w-[1400px] px-5 py-24 md:px-8 md:py-36"
    >
      {/* Recognition */}
      <div className="grid gap-10 md:grid-cols-12">
        <div className="md:col-span-4">
          <h2 className="reveal pre-anim display text-[clamp(2rem,5vw,3.6rem)] font-semibold text-fg">
            Recognition
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 md:col-span-8">
          <div className="reveal pre-anim flex items-start gap-4 rounded-xl border border-line bg-surface p-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://cdn.simpleicons.org/databricks/c6ff3a"
              alt="Databricks"
              width={28}
              height={28}
              className="mt-0.5 shrink-0"
            />
            <div>
              <p className="text-sm font-medium leading-snug text-fg">
                Generative AI Engineer Associate
              </p>
              <p className="mt-1 font-mono text-xs text-muted">
                Databricks certified
              </p>
            </div>
          </div>

          <div className="reveal pre-anim flex items-start gap-4 rounded-xl border border-line bg-surface p-6">
            <span
              aria-hidden
              className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-accent font-display text-sm font-bold text-accent-ink"
            >
              S
            </span>
            <div>
              <p className="text-sm font-medium leading-snug text-fg">
                Software Associate
              </p>
              <p className="mt-1 font-mono text-xs text-muted">
                {site.company}, {site.location}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Writing */}
      <div className="mt-20 md:mt-28">
        <h3 className="reveal pre-anim mb-10 font-display text-2xl font-medium text-fg md:text-3xl">
          Writing
        </h3>
        <div className="grid gap-4 md:grid-cols-3">
          {writing.map((w) => (
            <a
              key={w.title}
              href={w.href}
              target="_blank"
              rel="noopener noreferrer"
              className="reveal pre-anim group flex flex-col justify-between rounded-xl border border-line bg-surface p-7 transition-colors duration-300 hover:border-line-strong"
            >
              <div>
                <span className="font-mono text-xs uppercase tracking-wider text-accent">
                  {w.tag}
                </span>
                <h4 className="mt-4 font-display text-xl font-medium leading-snug text-fg">
                  {w.title}
                </h4>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {w.blurb}
                </p>
              </div>
              <span className="mt-8 font-mono text-xs uppercase tracking-wider text-muted transition-colors group-hover:text-fg">
                Read on LinkedIn{" "}
                <span className="inline-block transition-transform group-hover:translate-x-1">
                  &rarr;
                </span>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
