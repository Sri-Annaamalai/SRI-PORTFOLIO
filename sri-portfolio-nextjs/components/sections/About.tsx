"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { site, stats } from "@/lib/site";
import Counter from "@/components/ui/Counter";

export default function About() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.set(".reveal", { y: 42 });
      gsap.to(".reveal", {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.09,
        scrollTrigger: { trigger: root.current, start: "top 70%" },
      });
    },
    { scope: root },
  );

  return (
    <section
      id="about"
      ref={root}
      className="mx-auto max-w-[1400px] px-5 py-24 md:px-8 md:py-36"
    >
      <div className="grid gap-12 md:grid-cols-12 md:gap-8">
        {/* Pull quote */}
        <div className="md:col-span-7">
          <h2 className="reveal pre-anim display text-[clamp(2rem,5.2vw,4.4rem)] font-medium text-fg">
            AI is not a tool anymore.{" "}
            <span className="text-accent">It is the OS.</span>
          </h2>
        </div>

        {/* Bio */}
        <div className="flex flex-col gap-5 text-base leading-relaxed text-muted md:col-span-5 md:pt-3 md:text-lg">
          <p className="reveal pre-anim">
            I build full-stack products and AI systems that actually ship. At{" "}
            {site.company} I sit at the intersection of frontend engineering and
            Agentic AI, turning complex pipelines into products people use.
          </p>
          <p className="reveal pre-anim text-fg">
            {site.certification}.
          </p>
        </div>
      </div>

      {/* Ledger */}
      <dl className="mt-20 grid grid-cols-1 border-t border-line sm:grid-cols-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className="reveal pre-anim flex flex-col gap-3 border-b border-line py-8 sm:border-b-0 sm:border-r sm:py-10 sm:pr-8 sm:last:border-r-0"
          >
            <dt className="font-display text-[clamp(3rem,7vw,5.5rem)] font-semibold leading-none tracking-tight text-fg">
              <Counter value={s.value} suffix={s.suffix} />
            </dt>
            <dd className="font-mono text-xs uppercase tracking-[0.18em] text-faint">
              {s.label}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
