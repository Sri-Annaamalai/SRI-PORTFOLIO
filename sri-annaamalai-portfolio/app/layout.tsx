import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Space_Mono } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";
import OrbCanvas from "@/components/canvas/OrbCanvas";
import SmoothScroll from "@/components/providers/SmoothScroll";
import Preloader from "@/components/providers/Preloader";
import Cursor from "@/components/ui/Cursor";
import ScrollProgress from "@/components/ui/ScrollProgress";
import Nav from "@/components/ui/Nav";
import Reveals from "@/components/ui/Reveals";
import Spotlight from "@/components/ui/Spotlight";

const grotesk = Space_Grotesk({
  variable: "--font-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
});

const title = `${site.name}, ${site.discipline}`;
const description =
  "Sri Annaamalai M designs multi-agent systems and RAG pipelines with LangChain and LangGraph, and ships them as production full-stack products.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "Sri Annaamalai",
    "GenAI Engineer",
    "Agentic AI",
    "LangChain",
    "LangGraph",
    "RAG",
    "Multi-Agent Systems",
    "LLM Integration",
    "Full-Stack Developer",
    "Next.js",
    "SNS Square",
  ],
  authors: [{ name: site.name, url: site.linkedin }],
  openGraph: { type: "website", title, description, siteName: site.name },
  twitter: { card: "summary_large_image", title, description },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0c",
  colorScheme: "dark",
};

/**
 * Runs during HTML parse, before content paints: hides reveal targets so there
 * is no flash, and locks scroll behind the preloader.
 *
 * The failsafe matters. `.gsap-ready` sets `opacity: 0` on every reveal
 * target, so if the animation chunk fails to load the page would stay blank
 * for good. Reveals adds `.gsap-live` when it mounts; if that has not happened
 * within 4s, `.reveal-fallback` forces everything visible.
 */
const bootScript = `(function(){var h=document.documentElement;h.classList.add('gsap-ready');h.classList.add('is-loading');setTimeout(function(){if(!h.classList.contains('gsap-live')){h.classList.add('reveal-fallback');h.classList.remove('is-loading');}},4000);})();`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${grotesk.variable} ${spaceMono.variable} bg-bg text-fg antialiased`}>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        {/* Without JS the reveal states never apply, so content stays visible
            and indexable; this only covers the JS-enabled failure case. */}
        <noscript>
          <style>{`[data-line],[data-fade],[data-card],[data-hero-line],[data-hero-fade]{opacity:1!important;transform:none!important}`}</style>
        </noscript>

        <a href="#work" className="skip-link">
          Skip to content
        </a>

        <OrbCanvas />
        <ScrollProgress />
        <Cursor />
        <Preloader />
        <SmoothScroll>
          <Nav />
          <main className="relative z-[1]">{children}</main>
        </SmoothScroll>
        <Reveals />
        <Spotlight />
      </body>
    </html>
  );
}
