"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { isFinePointer } from "@/lib/gsap";
import { getLenis } from "@/lib/lenis";
import { orbState } from "@/lib/motion";

const CORAL = new THREE.Color("#ff5a3c");
const VIOLET = new THREE.Color("#a06bff");
const VIOLET_INK = new THREE.Color("#e3d4ff");
const R = 3.2;

/**
 * The star field and the assemble scatter are built inside render, so they
 * have to be reproducible: a fresh `Math.random()` draw would scatter them
 * anew whenever React happens to re-run the memo. mulberry32 keeps the same
 * uniform distribution while making each field a fixed property of the seed.
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
const SCATTER_SEED = 0xa55e3b;

/** Soft round sprite so every star reads as a glow dot, not a square. */
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

/**
 * Particle globe, shaded entirely on the GPU.
 *
 * Every point is displaced along its own direction by layered sine noise (the
 * breathing), then three scene-driven effects are layered on in clip space:
 *   - assemble: points start as a scattered cloud and snap into the sphere
 *   - cursor lens: points near the pointer are pushed outward and swell
 *   - scroll warp: fast scrolling stretches the globe along the vertical axis
 * Doing this in the vertex shader keeps ~10k points free on the CPU.
 */
const VERT = /* glsl */ `
  uniform float uTime;
  uniform float uAssemble;
  uniform float uBias;
  uniform float uVel;
  uniform float uSize;
  uniform float uScale;
  uniform float uAspect;
  uniform float uLens;
  uniform vec2 uPointer;
  uniform vec3 uCoral;
  uniform vec3 uViolet;
  attribute vec3 aScatter;
  varying vec3 vColor;
  varying float vLift;

  void main() {
    vec3 dir = normalize(position);
    float t = uTime * 0.6;
    float nse = 0.5 * sin(dir.x * 2.0 + t * 1.3)
              + 0.5 * sin(dir.y * 2.6 - t * 1.05)
              + 0.4 * sin(dir.z * 2.2 + t * 0.9)
              + 0.3 * sin((dir.x + dir.y + dir.z) * 3.0 - t * 1.6);
    vec3 p = dir * ${R.toFixed(2)} * (1.0 + 0.16 * nse);

    // Cubic falloff: the cloud lingers, then the last stretch snaps home.
    float k = 1.0 - uAssemble;
    p += aScatter * k * k * k;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vec4 clip = projectionMatrix * mv;

    vec2 ndc = clip.xy / clip.w;
    vec2 d = ndc - uPointer;
    d.x *= uAspect;
    float dist = length(d);
    float f = smoothstep(0.46, 0.0, dist) * uLens;
    vec2 push = d / max(dist, 0.0001);
    push.x /= uAspect;
    clip.xy += push * f * 0.1 * clip.w;
    clip.y += ndc.y * uVel * 0.05 * clip.w;

    gl_Position = clip;

    float tc = clamp((position.y / ${R.toFixed(2)} + 1.0) * 0.5 + uBias, 0.0, 1.0);
    vColor = mix(uViolet, uCoral, tc);
    vLift = f;
    gl_PointSize = uSize * (1.0 + f * 1.6) * (uScale / -mv.z);
  }
`;

const FRAG = /* glsl */ `
  uniform float uOpacity;
  uniform sampler2D uMap;
  varying vec3 vColor;
  varying float vLift;

  void main() {
    // The same glow sprite the original PointsMaterial used as its \`map\`,
    // sampled the same way. At this point size the texture is mip-averaged into
    // a soft solid block, which is what gives the globe its dense, colourful
    // dot rows. An analytic falloff shrinks each dot to a speck and loses it.
    float a = texture2D(uMap, gl_PointCoord).a;
    vec3 col = vColor + vLift * 0.45;
    gl_FragColor = vec4(col, a * uOpacity);
    #include <colorspace_fragment>
  }
`;

type Pointer = { tx: number; ty: number; x: number; y: number; moved: boolean };

function Scene({
  detail,
  starCount,
  fine,
  sprite,
}: {
  detail: number;
  starCount: number;
  fine: boolean;
  sprite: THREE.Texture;
}) {
  const group = useRef<THREE.Group>(null);
  const shell = useRef<THREE.LineSegments>(null);
  const stars = useRef<THREE.Points>(null);
  const blobMat = useRef<THREE.ShaderMaterial>(null);
  const spin = useRef(0);
  const vel = useRef(0);
  const lens = useRef(0);
  // Owned here rather than handed down as a prop: useFrame counts as the
  // render path, and only a ref created by this component may be written from
  // there. The listener moves down with it.
  const pointer = useRef<Pointer>({ tx: 0, ty: 0, x: 0, y: 0, moved: false });

  useEffect(() => {
    if (!fine) return;
    const onMove = (e: MouseEvent) => {
      const p = pointer.current;
      p.tx = (e.clientX / window.innerWidth) * 2 - 1;
      p.ty = (e.clientY / window.innerHeight) * 2 - 1;
      p.moved = true;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [fine]);

  const blobGeo = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(R, detail);
    const n = geo.attributes.position.count;
    const scatter = new Float32Array(n * 3);
    const rand = makeRng(SCATTER_SEED);
    for (let i = 0; i < n; i++) {
      // Random direction, random throw distance: a loose cloud, not a shell.
      const th = rand() * Math.PI * 2;
      const ph = Math.acos(2 * rand() - 1);
      const dist = 5 + rand() * 17;
      scatter[i * 3] = dist * Math.sin(ph) * Math.cos(th);
      scatter[i * 3 + 1] = dist * Math.sin(ph) * Math.sin(th);
      scatter[i * 3 + 2] = dist * Math.cos(ph);
    }
    geo.setAttribute("aScatter", new THREE.BufferAttribute(scatter, 3));
    return geo;
  }, [detail]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAssemble: { value: 0 },
      uBias: { value: 0 },
      uVel: { value: 0 },
      uSize: { value: 0.055 },
      uScale: { value: 450 },
      uAspect: { value: 1.6 },
      uLens: { value: 0 },
      uPointer: { value: new THREE.Vector2(9, 9) },
      uOpacity: { value: 0 },
      uMap: { value: sprite },
      uCoral: { value: CORAL },
      uViolet: { value: VIOLET },
    }),
    [sprite],
  );

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

  useFrame((state, delta) => {
    const g = group.current;
    const mat = blobMat.current;
    if (!g || !mat) return;

    const o = orbState;
    const u = mat.uniforms;
    const dt = Math.min(delta, 0.05);
    // Frame-rate independent smoothing: same feel at 60Hz and 144Hz.
    const ease = (rate: number) => 1 - Math.exp(-rate * dt);

    // Scroll speed, normalised and smoothed. Drives the warp and the push-in.
    const raw = getLenis()?.velocity ?? 0;
    vel.current += (Math.max(-1, Math.min(1, raw / 45)) - vel.current) * ease(6);
    const speed = Math.abs(vel.current);

    const p = pointer.current;
    p.x += (p.tx - p.x) * ease(5);
    p.y += (p.ty - p.y) * ease(5);
    // The lens only wakes once a real pointer has moved, so touch devices and
    // visitors who never touch the mouse do not get a phantom dent at centre.
    lens.current += ((p.moved ? 1 : 0) - lens.current) * ease(3);

    u.uTime.value = state.clock.elapsedTime;
    u.uAssemble.value = o.assemble;
    u.uBias.value += (o.bias - u.uBias.value) * ease(3);
    u.uVel.value = vel.current;
    u.uLens.value = lens.current;
    u.uPointer.value.set(p.x, -p.y);
    u.uAspect.value = state.size.width / state.size.height;
    u.uScale.value = (state.size.height * state.viewport.dpr) / 2;
    u.uOpacity.value += (o.opacity * o.intro - u.uOpacity.value) * ease(4);

    spin.current += dt * 0.1 * o.spin * (1 + speed * 5);

    // The hero copy is left-aligned, so in the title chapter the orb becomes
    // the right-hand counterweight. Offsets are fractions of the visible world
    // width, and off entirely on narrow screens where they would push the
    // globe out of frame.
    const vw = state.viewport.width;
    const targetX = vw > 12 ? vw * o.x : 0;
    g.position.x += (targetX - g.position.x) * ease(3.5);
    const s = g.scale.x + (o.scale - g.scale.x) * ease(3.5);
    g.scale.setScalar(s);

    g.rotation.y = spin.current + p.x * 0.5;
    g.rotation.x = p.y * 0.32;
    if (shell.current) {
      shell.current.rotation.y = -spin.current * 0.6 - p.x * 0.15;
      shell.current.rotation.x = p.y * 0.18;
      const sm = shell.current.material as THREE.LineBasicMaterial;
      sm.opacity = 0.13 * o.intro * Math.min(1, o.opacity + 0.25);
    }
    if (stars.current) {
      stars.current.rotation.y += dt * 0.018 + speed * 0.004;
      stars.current.rotation.x = p.y * 0.05;
      stars.current.rotation.z = p.x * 0.05;
      (stars.current.material as THREE.PointsMaterial).opacity = 0.6 * o.intro;
    }

    // Camera: pushes in on fast scrolls (a speed ramp), settles back after,
    // and drifts slightly toward the pointer for parallax.
    const cam = state.camera;
    const camZ = o.z - speed * 1.6;
    cam.position.z += (camZ - cam.position.z) * ease(3);
    cam.position.x += (p.x * 0.7 - cam.position.x) * ease(2.4);
    cam.position.y += (-p.y * 0.5 - cam.position.y) * ease(2.4);
    cam.lookAt(0, 0, 0);
  });

  return (
    <>
      <group ref={group}>
        <points geometry={blobGeo} frustumCulled={false}>
          <shaderMaterial
            ref={blobMat}
            vertexShader={VERT}
            fragmentShader={FRAG}
            uniforms={uniforms}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </points>
        <lineSegments ref={shell} geometry={shellGeo}>
          <lineBasicMaterial
            color={VIOLET}
            transparent
            opacity={0}
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
          opacity={0}
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
    fine: isFinePointer(),
  };
}

function Orb() {
  // Only ever mounted past the hydration gate, so window is guaranteed here
  // and both initialisers run exactly once, on the client.
  const [config] = useState(readConfig);
  const [sprite] = useState(makeSprite);

  // Motion is unconditional by design (see the note in app/globals.css), so
  // the loop always runs. It pauses only while the tab is hidden.
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const onVis = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  return (
    <Canvas
      dpr={[1, 2]}
      frameloop={visible ? "always" : "never"}
      camera={{ position: [0, 0, 11], fov: 55, near: 0.1, far: 100 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <Scene detail={config.detail} starCount={config.starCount} fine={config.fine} sprite={sprite} />
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
