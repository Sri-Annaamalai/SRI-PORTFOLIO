"use client";

import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import ParticleField from "./ParticleField";

/**
 * Single R3F Canvas (one WebGLRenderer, disposed automatically on unmount).
 * dpr capped at 2, particle budget scaled down on small screens, and the
 * render loop pauses whenever the tab is hidden.
 */
export default function Scene() {
  const [active, setActive] = useState(true);
  // ssr:false guarantees this only evaluates in the browser, so window is safe.
  const [count] = useState(() =>
    typeof window !== "undefined" && window.innerWidth < 768 ? 1100 : 2200,
  );

  useEffect(() => {
    const onVis = () => setActive(!document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  return (
    <Canvas
      className="!absolute inset-0"
      dpr={[1, 2]}
      frameloop={active ? "always" : "never"}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 6], fov: 45 }}
    >
      <ParticleField count={count} />
    </Canvas>
  );
}
