"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { isFinePointer } from "@/lib/gsap";

const CORAL = new THREE.Color("#ff5a3c");
const VIOLET = new THREE.Color("#a06bff");
const VIOLET_INK = new THREE.Color("#e3d4ff");
const R = 3.2;

/** Soft round sprite so every point reads as a glow dot, not a square. */
function makeSprite() {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const x = c.getContext("2d")!;
  const g = x.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.25, "rgba(255,255,255,0.85)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  x.fillStyle = g;
  x.fillRect(0, 0, 64, 64);
  const t = new THREE.Texture(c);
  t.needsUpdate = true;
  return t;
}

type Mouse = { x: number; y: number; tx: number; ty: number };

function Scene({
  detail,
  starCount,
  animate,
  mouse,
  sprite,
}: {
  detail: number;
  starCount: number;
  animate: boolean;
  mouse: React.RefObject<Mouse>;
  sprite: THREE.Texture;
}) {
  const group = useRef<THREE.Group>(null);
  const blob = useRef<THREE.Points>(null);
  const shell = useRef<THREE.LineSegments>(null);
  const stars = useRef<THREE.Points>(null);
  const spin = useRef(0);
  const { camera } = useThree();

  // Breathing point-blob: directions + vertex colours derived once.
  const { blobGeo, dirs } = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(R, detail);
    const pos = geo.attributes.position;
    const n = pos.count;
    const d = new Float32Array(n * 3);
    const col = new Float32Array(n * 3);
    const tmp = new THREE.Color();
    for (let i = 0; i < n; i++) {
      const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
      const l = Math.hypot(x, y, z) || 1;
      d[i * 3] = x / l;
      d[i * 3 + 1] = y / l;
      d[i * 3 + 2] = z / l;
      const t = (y / R + 1) / 2;
      tmp.copy(VIOLET).lerp(CORAL, t);
      col[i * 3] = tmp.r;
      col[i * 3 + 1] = tmp.g;
      col[i * 3 + 2] = tmp.b;
    }
    geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
    return { blobGeo: geo, dirs: d };
  }, [detail]);

  const shellGeo = useMemo(() => new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(4.15, 1)), []);
  const coreGeo = useMemo(() => new THREE.IcosahedronGeometry(2.3, 2), []);

  const starGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const sp = new Float32Array(starCount * 3);
    const sc = new Float32Array(starCount * 3);
    const tmp = new THREE.Color();
    for (let i = 0; i < starCount; i++) {
      const r = 18 + Math.random() * 44;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      sp[i * 3] = r * Math.sin(ph) * Math.cos(th);
      sp[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
      sp[i * 3 + 2] = r * Math.cos(ph);
      tmp.copy(VIOLET).lerp(VIOLET_INK, Math.random());
      const f = 0.35 + Math.random() * 0.6;
      sc[i * 3] = tmp.r * f;
      sc[i * 3 + 1] = tmp.g * f;
      sc[i * 3 + 2] = tmp.b * f;
    }
    g.setAttribute("position", new THREE.BufferAttribute(sp, 3));
    g.setAttribute("color", new THREE.BufferAttribute(sc, 3));
    return g;
  }, [starCount]);

  useFrame((state) => {
    if (!animate || !blob.current || !group.current) return;
    const t = state.clock.elapsedTime * 0.6;

    // displace each point along its direction with layered sine noise
    const attr = blob.current.geometry.attributes.position as THREE.BufferAttribute;
    const a = attr.array as Float32Array;
    for (let i = 0; i < dirs.length; i += 3) {
      const dx = dirs[i], dy = dirs[i + 1], dz = dirs[i + 2];
      const nse =
        0.5 * Math.sin(dx * 2.0 + t * 1.3) +
        0.5 * Math.sin(dy * 2.6 - t * 1.05) +
        0.4 * Math.sin(dz * 2.2 + t * 0.9) +
        0.3 * Math.sin((dx + dy + dz) * 3.0 - t * 1.6);
      const r = R * (1 + 0.16 * nse);
      a[i] = dx * r;
      a[i + 1] = dy * r;
      a[i + 2] = dz * r;
    }
    attr.needsUpdate = true;

    const m = mouse.current!;
    m.x += (m.tx - m.x) * 0.05;
    m.y += (m.ty - m.y) * 0.05;
    spin.current += 0.0016;

    group.current.rotation.y = spin.current + m.x * 0.5;
    group.current.rotation.x = m.y * 0.32;
    if (shell.current) {
      shell.current.rotation.y = -spin.current * 0.6 - m.x * 0.15;
      shell.current.rotation.x = m.y * 0.18;
    }
    if (stars.current) {
      stars.current.rotation.y += 0.0003;
      stars.current.rotation.x = m.y * 0.05;
      stars.current.rotation.z = m.x * 0.05;
    }

    // scroll-driven hero focus: dense + centred at top, dissolves on scroll
    const sy = window.scrollY || 0;
    const heroF = Math.max(0, Math.min(1, 1 - sy / window.innerHeight));
    (blob.current.material as THREE.PointsMaterial).opacity = 0.22 + 0.73 * heroF;
    group.current.position.y = -(1 - heroF) * 1.4;
    group.current.scale.setScalar(0.82 + 0.18 * heroF);

    camera.position.x += (m.x * 0.7 - camera.position.x) * 0.04;
    camera.position.y += (-m.y * 0.5 - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <group ref={group}>
        <points ref={blob} geometry={blobGeo}>
          <pointsMaterial
            size={0.055}
            map={sprite}
            vertexColors
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            opacity={0.95}
            sizeAttenuation
          />
        </points>
        <lineSegments ref={shell} geometry={shellGeo}>
          <lineBasicMaterial
            color={VIOLET}
            transparent
            opacity={0.13}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </lineSegments>
        <mesh geometry={coreGeo}>
          <meshBasicMaterial
            color={CORAL}
            transparent
            opacity={0.05}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      </group>
      <points ref={stars} geometry={starGeo}>
        <pointsMaterial
          size={0.14}
          map={sprite}
          vertexColors
          transparent
          opacity={0.6}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
        />
      </points>
    </>
  );
}

export default function OrbCanvas() {
  const [mounted, setMounted] = useState(false);
  const mouse = useRef<Mouse>({ x: 0, y: 0, tx: 0, ty: 0 });
  const [config, setConfig] = useState({ detail: 12, starCount: 2600, animate: true, fine: true });

  useEffect(() => {
    const small = window.innerWidth < 768;
    setConfig({
      detail: small ? 7 : 12,
      starCount: small ? 900 : 2600,
      animate: true,
      fine: isFinePointer(),
    });
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!config.fine || !config.animate) return;
    const onMove = (e: MouseEvent) => {
      mouse.current.tx = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.ty = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [config.fine, config.animate]);

  const sprite = useMemo(() => (mounted ? makeSprite() : null), [mounted]);

  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
      {mounted && sprite && (
        <Canvas
          dpr={[1, 2]}
          frameloop={config.animate ? "always" : "demand"}
          camera={{ position: [0, 0, 11], fov: 55, near: 0.1, far: 100 }}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        >
          <Scene
            detail={config.detail}
            starCount={config.starCount}
            animate={config.animate}
            mouse={mouse}
            sprite={sprite}
          />
        </Canvas>
      )}
    </div>
  );
}
