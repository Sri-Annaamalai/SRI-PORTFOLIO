"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { prefersReducedMotion } from "@/lib/gsap";

/**
 * Deterministic PRNG (mulberry32). Seeded so the field is identical on every
 * render and on the server, which keeps the generation pure and hydration-safe.
 */
function makeRand(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Ambient point cloud. BufferGeometry (not individual meshes), additive blend,
 * most points are faint grey with a small fraction in the lime accent.
 * Slow autonomous rotation plus a gentle parallax toward the pointer.
 */
export default function ParticleField({ count = 2200 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const reduce = prefersReducedMotion();

  const { positions, colors } = useMemo(() => {
    const rand = makeRand(0x9e3779 ^ count);
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const accent = new THREE.Color("#c6ff3a");
    const base = new THREE.Color("#9aa1ac");

    for (let i = 0; i < count; i++) {
      // Even-ish distribution through a flattened sphere volume.
      const r = 4.4 * Math.cbrt(rand());
      const theta = rand() * Math.PI * 2;
      const phi = Math.acos(2 * rand() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.68;
      positions[i * 3 + 2] = r * Math.cos(phi);

      const c = rand() < 0.07 ? accent : base;
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    return { positions, colors };
  }, [count]);

  useFrame((state, delta) => {
    const p = ref.current;
    if (!p || reduce) return;
    p.rotation.y += delta * 0.035;
    const { x, y } = state.pointer;
    p.rotation.x = THREE.MathUtils.lerp(p.rotation.x, y * 0.14, 0.04);
    p.position.x = THREE.MathUtils.lerp(p.position.x, x * 0.45, 0.04);
    p.position.y = THREE.MathUtils.lerp(p.position.y, -y * 0.25, 0.04);
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        vertexColors
        transparent
        opacity={0.85}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
