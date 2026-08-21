"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { isFinePointer } from "@/lib/gsap";

const CORAL = new THREE.Color("#ff5a3c");
const VIOLET = new THREE.Color("#a06bff");
const VIOLET_INK = new THREE.Color("#e3d4ff");
const R = 3.2;

/**
 * The star field is built inside render, so it has to be reproducible: a fresh
 * `Math.random()` draw would scatter the stars anew whenever React happens to
 * re-run the memo. mulberry32 keeps the same uniform distribution while making
 * the field a fixed property of the seed.
 */
function makeRng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const STAR_SEED = 0x5eed1e;

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
  fine,
  sprite,
}: {
  detail: number;
  starCount: number;
  animate: boolean;
  fine: boolean;
  sprite: THREE.Texture;
}) {
  const group = useRef<THREE.Group>(null);
  const blob = useRef<THREE.Points>(null);
  const shell = useRef<THREE.LineSegments>(null);
  const stars = useRef<THREE.Points>(null);
  const spin = useRef(0);
  // Owned here rather than handed down as a prop: useFrame counts as the
  // render path, and only a ref created by this component may be written from
  // there. The listener moves down with it.
  const mouse = useRef<Mouse>({ x: 0, y: 0, tx: 0, ty: 0 });

  useEffect(() => {
    if (!fine || !animate) return;
    const onMove = (e: MouseEvent) => {
      mouse.current.tx = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.ty = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [fine, animate]);

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
    const rand = makeRng(STAR_SEED);
    for (let i = 0; i < starCount; i++) {
      const r = 18 + rand() * 44;
      const th = rand() * Math.PI * 2;
      const ph = Math.acos(2 * rand() - 1);
      sp[i * 3] = r * Math.sin(ph) * Math.cos(th);
      sp[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
      sp[i * 3 + 2] = r * Math.cos(ph);
      tmp.copy(VIOLET).lerp(VIOLET_INK, rand());
      const f = 0.35 + rand() * 0.6;
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

    const m = mouse.current;
    m.x += (m.tx - m.x) * 0.05;
    m.y += (m.ty - m.y) * 0.05;
    spin.current += 0.0016;

    // The hero copy is left-aligned, so the orb becomes the right-hand
    // counterweight instead of sitting under the paragraph. Scaled off the
    // world-space viewport width, and off entirely on narrow screens where
    // the shift would push it out of frame.
    const vw = state.viewport.width;
    group.current.position.x = vw > 12 ? vw * 0.14 : 0;

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

    // Same camera object useThree() hands back, reached through the frame
    // state so we are not writing through a hook return value.
    const cam = state.camera;
    cam.position.x += (m.x * 0.7 - cam.position.x) * 0.04;
    cam.position.y += (-m.y * 0.5 - cam.position.y) * 0.04;
    cam.lookAt(0, 0, 0);
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

/**
 * Hydration gate. useSyncExternalStore reads the server snapshot during SSR
 * and through the hydration pass, then the client snapshot on the first render
 * after it. Same "mounted" signal a setState-in-effect gave us, without the
 * cascading render, and window stays untouched on the server.
 */
const neverChanges = () => () => {};
const onClient = () => true;
const onServer = () => false;

function readConfig() {
  const small = window.innerWidth < 768;
  return {
    detail: small ? 7 : 12,
    starCount: small ? 900 : 2600,
    // Motion is unconditional by design; see the note in app/globals.css.
    // Setting this false also drops the canvas to frameloop="demand", which
    // renders exactly one static frame.
    animate: true,
    fine: isFinePointer(),
  };
}

function Orb() {
  // Only ever mounted past the hydration gate, so window is guaranteed here
  // and both initialisers run exactly once, on the client.
  const [config] = useState(readConfig);
  const [sprite] = useState(makeSprite);

  return (
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
        fine={config.fine}
        sprite={sprite}
      />
    </Canvas>
  );
}

export default function OrbCanvas() {
  const hydrated = useSyncExternalStore(neverChanges, onClient, onServer);

  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
      {hydrated && <Orb />}
    </div>
  );
}
