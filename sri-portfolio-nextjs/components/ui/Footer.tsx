import Link from "next/link";
import { nav, site, socials } from "@/lib/site";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-bg">
      <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-8 md:py-20">
        <div className="grid gap-12 md:grid-cols-12">
          {/* Identity */}
          <div className="md:col-span-6">
            <p className="font-display text-2xl font-medium tracking-tight text-fg md:text-3xl">
              {site.thesis}
            </p>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted">
              {site.roleLong} at {site.company}, {site.location}.
            </p>
          </div>

          {/* Sitemap */}
          <nav className="md:col-span-3">
            <span className="label">Index</span>
            <ul className="mt-4 flex flex-col gap-2.5">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted transition-colors hover:text-fg"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Connect */}
          <div className="md:col-span-3">
            <span className="label">Connect</span>
            <ul className="mt-4 flex flex-col gap-2.5">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target={s.href.startsWith("http") ? "_blank" : undefined}
                    rel={s.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="text-sm text-muted transition-colors hover:text-fg"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Baseline */}
        <div className="mt-16 flex flex-col gap-4 border-t border-line pt-6 text-xs text-faint sm:flex-row sm:items-center sm:justify-between">
          <span>
            {year} {site.name}
          </span>
          <span className="font-mono">Next.js · GSAP · Three.js</span>
          <Link href="#top" className="transition-colors hover:text-fg">
            Back to top
          </Link>
        </div>
      </div>
    </footer>
  );
}
