import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";
import SmoothScroll from "@/components/providers/SmoothScroll";
import Preloader from "@/components/providers/Preloader";
import Cursor from "@/components/ui/Cursor";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sriannaamalai.dev"),
  title: {
    default: `${site.name} - ${site.roleLong}`,
    template: `%s - ${site.name}`,
  },
  description:
    "Sri Annaamalai M builds full-stack products and Agentic AI systems that ship. Software Associate at SNS Square, Databricks Generative AI Engineer Associate.",
  keywords: [
    "Sri Annaamalai",
    "Full Stack Developer",
    "AI Engineer",
    "GenAI",
    "Agentic AI",
    "Next.js",
    "SNS Square",
  ],
  authors: [{ name: site.name, url: site.linkedin }],
  openGraph: {
    type: "website",
    title: `${site.name} - ${site.roleLong}`,
    description:
      "Full-stack products and Agentic AI systems that actually ship.",
    siteName: site.name,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} - ${site.roleLong}`,
    description:
      "Full-stack products and Agentic AI systems that actually ship.",
  },
};

export const viewport: Viewport = {
  themeColor: "#050608",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${spaceGrotesk.variable} ${geistSans.variable} ${geistMono.variable} bg-bg text-fg antialiased`}
      >
        <SmoothScroll>
          <Preloader />
          <Cursor />
          <Navbar />
          <main>{children}</main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
