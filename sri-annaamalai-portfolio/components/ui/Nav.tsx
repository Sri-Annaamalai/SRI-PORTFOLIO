"use client";

import { useRef } from "react";
import { ScrollTrigger, useGSAP } from "@/lib/gsap";
import { nav, site } from "@/lib/site";
import SmoothLink from "./SmoothLink";
import Magnetic from "./Magnetic";

export default function Nav() {
  const navRef = useRef<HTMLElement>(null);

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

  return (
    <nav ref={navRef} className="site-nav">
      <SmoothLink href="#home" className="nav-logo" aria-label="Sri Annaamalai — home">
        <span className="nav-badge">{site.initial}</span>
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
    </nav>
  );
}
