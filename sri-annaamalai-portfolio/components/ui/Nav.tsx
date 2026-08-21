"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { nav, site } from "@/lib/site";
import { getLenis } from "@/lib/lenis";
import SmoothLink from "./SmoothLink";
import Magnetic from "./Magnetic";

export default function Nav() {
  const navRef = useRef<HTMLElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

  useGSAP(() => {
    if (!navRef.current) return;
    const el = navRef.current;
    const st = ScrollTrigger.create({
      trigger: "#home",
      start: "bottom 90px",
      end: "bottom 90px",
      onEnter: () => el.classList.add("is-scrolled"),
      onLeaveBack: () => el.classList.remove("is-scrolled"),
    });
    return () => st.kill();
  }, []);

  const close = useCallback(() => setOpen(false), []);

  // Lock the page behind the drawer. Lenis owns scrolling, so `overflow:
  // hidden` alone would not stop a wheel gesture.
  useEffect(() => {
    const root = document.documentElement;
    const lenis = getLenis();
    if (open) {
      root.classList.add("menu-open");
      lenis?.stop();
      drawerRef.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    } else {
      root.classList.remove("menu-open");
      lenis?.start();
    }
    return () => {
      root.classList.remove("menu-open");
      lenis?.start();
    };
  }, [open]);

  // The drawer is hidden by media query above 860px; without this a resize
  // while it is open would leave the scroll lock on with no way to clear it.
  useEffect(() => {
    if (!open) return;
    const mq = window.matchMedia("(min-width: 861px)");
    const onChange = () => mq.matches && setOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      toggleRef.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Stagger the drawer links in. Scoped to the drawer and re-run on `open`.
  useGSAP(
    () => {
      if (!open) return;
      gsap.fromTo(
        "[data-drawer-link]",
        { y: 22, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: "power3.out", stagger: 0.05 },
      );
    },
    { dependencies: [open], scope: drawerRef },
  );

  return (
    <>
      <nav ref={navRef} className="site-nav">
        <SmoothLink href="#home" className="nav-logo" aria-label={`${site.name}, back to top`}>
          <span className="nav-badge" aria-hidden>
            {site.initial}
          </span>
          <span>Sri&nbsp;Annaamalai</span>
        </SmoothLink>

        <div className="nav-links">
          {nav.map((n) => (
            <SmoothLink key={n.href} href={n.href} className="nav-link">
              {n.label}
            </SmoothLink>
          ))}
          <Magnetic>
            <SmoothLink href="#contact" className="nav-contact">
              Contact
            </SmoothLink>
          </Magnetic>
        </div>

        {/* Below 860px the inline links used to be `display: none` with nothing
            in their place, leaving four sections unreachable on a phone. */}
        <button
          ref={toggleRef}
          type="button"
          className="nav-toggle"
          aria-expanded={open}
          aria-controls="nav-drawer"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="nav-toggle-bars" aria-hidden>
            <span />
            <span />
            <span />
          </span>
          {open ? "Close" : "Menu"}
        </button>
      </nav>

      <div
        ref={drawerRef}
        id="nav-drawer"
        className={`nav-drawer${open ? " is-open" : ""}`}
        hidden={!open}
      >
        {[...nav, { label: "Contact", href: "#contact" }].map((n, i) => (
          <SmoothLink
            key={n.href}
            href={n.href}
            className="nav-drawer-link"
            data-drawer-link
            onClick={close}
          >
            <span className="nav-drawer-index" aria-hidden>
              {String(i + 1).padStart(2, "0")}
            </span>
            {n.label}
          </SmoothLink>
        ))}
      </div>
    </>
  );
}
