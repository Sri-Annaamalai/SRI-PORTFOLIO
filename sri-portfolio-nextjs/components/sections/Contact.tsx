"use client";

import { useRef, useState } from "react";
import {
  gsap,
  SplitText,
  useGSAP,
  prefersReducedMotion,
} from "@/lib/gsap";
import { site, socials } from "@/lib/site";
import Magnetic from "@/components/ui/Magnetic";

export default function Contact() {
  const root = useRef<HTMLElement>(null);
  const headline = useRef<HTMLHeadingElement>(null);
  const [copied, setCopied] = useState(false);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      gsap.set(".c-reveal", { y: 30 });
      gsap.to(".c-reveal", {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: { trigger: root.current, start: "top 72%" },
      });

      let split: SplitText | null = null;
      document.fonts.ready.then(() => {
        if (!headline.current) return;
        split = new SplitText(headline.current, {
          type: "lines,chars",
          linesClass: "split-mask",
        });
        gsap.set(headline.current, { opacity: 1 });
        gsap.from(split.chars, {
          yPercent: 120,
          opacity: 0,
          duration: 0.9,
          ease: "power4.out",
          stagger: 0.012,
          scrollTrigger: { trigger: headline.current, start: "top 82%" },
        });
      });
      return () => split?.revert();
    },
    { scope: root },
  );

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Project enquiry from ${form.name}`);
    const body = encodeURIComponent(
      `${form.message}\n\nFrom: ${form.name}\nReply to: ${form.email}`,
    );
    window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  const filled = form.name && form.email && form.message;

  return (
    <section
      id="contact"
      ref={root}
      className="mx-auto max-w-[1400px] px-5 py-24 md:px-8 md:py-36"
    >
      <div className="grid gap-14 md:grid-cols-12 md:gap-8">
        {/* Left: the ask */}
        <div className="md:col-span-6">
          <h2
            ref={headline}
            className="display pre-anim text-[clamp(2.6rem,7vw,5.5rem)] font-semibold text-fg"
          >
            Let&apos;s build something that ships.
          </h2>

          <div className="c-reveal pre-anim mt-10">
            <button
              type="button"
              onClick={copyEmail}
              className="group inline-flex items-center gap-3 text-left"
            >
              <span className="font-display text-xl text-fg transition-colors group-hover:text-accent md:text-2xl">
                {site.email}
              </span>
              <span className="font-mono text-[11px] uppercase tracking-wider text-faint">
                {copied ? "Copied" : "Copy"}
              </span>
            </button>
          </div>

          <ul className="c-reveal pre-anim mt-10 flex flex-wrap gap-x-8 gap-y-3">
            {socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target={s.href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    s.href.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined
                  }
                  className="group inline-flex items-center gap-1.5 font-mono text-sm uppercase tracking-wider text-muted transition-colors hover:text-fg"
                >
                  {s.label}
                  <span
                    aria-hidden
                    className="inline-block transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  >
                    &#8599;
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Right: minimal form */}
        <form
          onSubmit={onSubmit}
          className="c-reveal pre-anim flex flex-col gap-6 md:col-span-6 md:pl-8"
        >
          <Field
            label="Name"
            id="name"
            value={form.name}
            onChange={(v) => setForm((f) => ({ ...f, name: v }))}
          />
          <Field
            label="Email"
            id="email"
            type="email"
            value={form.email}
            onChange={(v) => setForm((f) => ({ ...f, email: v }))}
          />
          <div className="flex flex-col gap-2">
            <label
              htmlFor="message"
              className="font-mono text-xs uppercase tracking-wider text-faint"
            >
              Message
            </label>
            <textarea
              id="message"
              rows={4}
              value={form.message}
              onChange={(e) =>
                setForm((f) => ({ ...f, message: e.target.value }))
              }
              className="resize-none border-b border-line bg-transparent py-2 text-base text-fg outline-none transition-colors placeholder:text-faint focus:border-accent"
              placeholder="What are you building?"
            />
          </div>

          <Magnetic strength={0.4} className="mt-2 self-start">
            <button
              type="submit"
              disabled={!filled}
              className="block rounded-full bg-accent px-7 py-3 font-mono text-xs font-medium uppercase tracking-wider text-accent-ink transition-opacity duration-200 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Start a project
            </button>
          </Magnetic>

          {sent && (
            <p className="font-mono text-xs text-muted" role="status">
              Opening your mail client. If nothing happens, write to{" "}
              <button
                type="button"
                onClick={copyEmail}
                className="text-accent underline underline-offset-2"
              >
                {site.email}
              </button>
              .
            </p>
          )}
        </form>
      </div>
    </section>
  );
}

function Field({
  label,
  id,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  id: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className="font-mono text-xs uppercase tracking-wider text-faint"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        className="border-b border-line bg-transparent py-2 text-base text-fg outline-none transition-colors placeholder:text-faint focus:border-accent"
      />
    </div>
  );
}
