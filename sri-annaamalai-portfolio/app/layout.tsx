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

const title = `${site.name} — Full-Stack Developer & AI Engineer`;
const description =
  "Sri Annaamalai M builds production-grade web applications and AI-powered products — from enterprise platforms and recruitment systems to agentic AI workflows.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "Sri Annaamalai",
    "Full-Stack Developer",
    "AI Engineer",
    "Agentic AI",
    "LLM Integration",
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

// Runs during HTML parse, before content paints: hides reveal targets so there
// is no flash, and locks scroll behind the preloader. Motion is unconditional
// to match the source design exactly.
const bootScript = `(function(){var h=document.documentElement;h.classList.add('gsap-ready');h.classList.add('is-loading');})();`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${grotesk.variable} ${spaceMono.variable} bg-bg text-fg antialiased`}>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        <OrbCanvas />
        <ScrollProgress />
        <Cursor />
        <Preloader />
        <SmoothScroll>
          <Nav />
          <main className="relative z-[1]">{children}</main>
        </SmoothScroll>
        <Reveals />
      </body>
    </html>
  );
}
