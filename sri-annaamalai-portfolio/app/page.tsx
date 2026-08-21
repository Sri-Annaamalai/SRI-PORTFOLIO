import Hero from "@/components/sections/Hero";
import Marquee from "@/components/ui/Marquee";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Work from "@/components/sections/Work";
import Experience from "@/components/sections/Experience";
import Certifications from "@/components/sections/Certifications";
import Labs from "@/components/sections/Labs";
import Services from "@/components/sections/Services";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <About />
      <Skills />
      <Work />
      <Experience />
      <Certifications />
      <Labs />
      <Services />
      <Contact />
    </>
  );
}
