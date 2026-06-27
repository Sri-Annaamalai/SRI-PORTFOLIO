"use client";

import { scrollToSection } from "@/lib/lenis";

type Props = React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

/** Anchor that hands in-page hash links to Lenis for momentum scrolling. */
export default function SmoothLink({ href, children, onClick, ...rest }: Props) {
  const handle = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      scrollToSection(href);
    }
    onClick?.(e);
  };
  return (
    <a href={href} onClick={handle} {...rest}>
      {children}
    </a>
  );
}
