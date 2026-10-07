"use client";

import { useEffect, useRef } from "react";
import { isFinePointer } from "@/lib/gsap";
import { getLenis } from "@/lib/lenis";
import { orbState } from "@/lib/motion";
import { makeRng } from "@/lib/rng";

/**
 * The particle globe for visitors whose browser cannot create a WebGL context.
 *
 * It is the same set, drawn with the 2D canvas API: a sphere of glow points
 * laid out on a Fibonacci spiral, breathing with the same layered sine noise,
 * and driven by the same shared `orbState` the WebGL scene reads, so the
 * chapter camera moves, the assemble-on-load and the scroll warp all still
 * play. The cursor lens is reproduced too.
 *
 * It is deliberately cheap, because the people who land here are the ones
 * without a working GPU: a modest point count, a capped pixel ratio, and a
 * frame-time governor that thins the points if the machine cannot keep up.
 */

const R = 3.2;
const FOV = (55 * Math.PI) / 180;
const TAN_HALF = Math.tan(FOV / 2);
const SIZE = 0.055;
const SPRITE_STEPS = 12;
const GOLDEN = Math.PI * (3 - Math.sqrt(5));

const CORAL = [255, 90, 60] as const;
const VIOLET = [160, 107, 255] as const;

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const smoothstep = (t: number) => t * t * (3 - 2 * t);

/** One glow sprite per step along the violet to coral gradient. */
function makeSprites(): HTMLCanvasElement[] {
  return Array.from({ length: SPRITE_STEPS }, (_, k) => {
    const t = k / (SPRITE_STEPS - 1);
    const r = Math.round(VIOLET[0] + (CORAL[0] - VIOLET[0]) * t);
    const g = Math.round(VIOLET[1] + (CORAL[1] - VIOLET[1]) * t);
    const b = Math.round(VIOLET[2] + (CORAL[2] - VIOLET[2]) * t);
    const c = document.createElement("canvas");
    c.width = c.height = 32;
    const x = c.getContext("2d")!;
    const grad = x.createRadialGradient(16, 16, 0, 16, 16, 16);
    // White-hot core, tinted halo: what the additive overlap of the real
    // globe's points produces.
    grad.addColorStop(0, "rgba(255,255,255,1)");
    grad.addColorStop(0.2, `rgba(${r},${g},${b},0.95)`);
    grad.addColorStop(0.55, `rgba(${r},${g},${b},0.35)`);
    grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
    x.fillStyle = grad;
    x.fillRect(0, 0, 32, 32);
    return c;
  });
}

export default function OrbFallback() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const small = window.innerWidth < 768;
    const fine = isFinePointer();
    const count = small ? 560 : 1100;
    const starCount = small ? 90 : 220;
    const sprites = makeSprites();

    // Fibonacci sphere: even coverage, and a visible spiral in the dot rows.
    const dirs = new Float32Array(count * 3);
    const scatter = new Float32Array(count * 3);
    const rand = makeRng(0xa55e3b);
    for (let i = 0; i < count; i++) {
      const y = 1 - (2 * (i + 0.5)) / count;
      const ring = Math.sqrt(1 - y * y);
      const phi = i * GOLDEN;
      dirs[i * 3] = Math.cos(phi) * ring;
      dirs[i * 3 + 1] = y;
      dirs[i * 3 + 2] = Math.sin(phi) * ring;
      const th = rand() * Math.PI * 2;
      const ph = Math.acos(2 * rand() - 1);
      const dist = 5 + rand() * 17;
      scatter[i * 3] = dist * Math.sin(ph) * Math.cos(th);
      scatter[i * 3 + 1] = dist * Math.sin(ph) * Math.sin(th);
      scatter[i * 3 + 2] = dist * Math.cos(ph);
    }
    const starRand = makeRng(0x5eed1e);
    const stars = Array.from({ length: starCount }, () => ({
      x: starRand(),
      y: starRand(),
      a: 0.3 + starRand() * 0.5,
      s: 0.8 + starRand() * 1.2,
    }));

    let w = 0;
    let h = 0;
    let dpr = 1;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, small ? 1.5 : 1.25);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    const pointer = { tx: 0, ty: 0, x: 0, y: 0, moved: false };
    const onMove = (e: MouseEvent) => {
      pointer.tx = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.ty = (e.clientY / window.innerHeight) * 2 - 1;
      pointer.moved = true;
    };
    if (fine) window.addEventListener("mousemove", onMove);

    // Smoothed copy of the shared pose, so chapter cuts glide instead of snap.
    const pose = { x: 0, z: 11, scale: 1, opacity: 0, bias: 0 };
    const cam = { x: 0, y: 0, z: 11 };
    let spin = 0;
    let vel = 0;
    let lens = 0;
    let stride = 1;
    let slow = 0;
    let frameAvg = 16;
    let last = performance.now();
    let raf = 0;
    let running = true;

    const frame = (now: number) => {
      if (!running) return;
      raf = requestAnimationFrame(frame);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const t0 = performance.now();
      const ease = (rate: number) => 1 - Math.exp(-rate * dt);
      const o = orbState;

      const speedRaw = getLenis()?.velocity ?? 0;
      vel += (clamp(speedRaw / 45, -1, 1) - vel) * ease(6);
      const speed = Math.abs(vel);

      pointer.x += (pointer.tx - pointer.x) * ease(5);
      pointer.y += (pointer.ty - pointer.y) * ease(5);
      lens += ((pointer.moved ? 1 : 0) - lens) * ease(3);

      pose.x += (o.x - pose.x) * ease(3.5);
      pose.scale += (o.scale - pose.scale) * ease(3.5);
      pose.z += (o.z - pose.z) * ease(3);
      pose.bias += (o.bias - pose.bias) * ease(3);
      pose.opacity += (o.opacity * o.intro - pose.opacity) * ease(4);
      cam.z += (pose.z - speed * 1.6 - cam.z) * ease(3);
      cam.x += (pointer.x * 0.7 - cam.x) * ease(2.4);
      cam.y += (-pointer.y * 0.5 - cam.y) * ease(2.4);
      spin += dt * 0.1 * o.spin * (1 + speed * 5);

      const time = now / 1000;
      const tt = time * 0.6;
      const focal = h / 2 / TAN_HALF;
      const visibleW = 2 * cam.z * TAN_HALF * (w / h);
      const gx = visibleW > 12 ? visibleW * pose.x : 0;
      const sy0 = h / 2;
      const sx0 = w / 2;
      const rotY = spin + pointer.x * 0.5;
      const rotX = pointer.y * 0.32;
      const cY = Math.cos(rotY);
      const sY = Math.sin(rotY);
      const cX = Math.cos(rotX);
      const sX = Math.sin(rotX);
      const mx = (pointer.x * 0.5 + 0.5) * w;
      const my = (pointer.y * 0.5 + 0.5) * h;
      const lensR = 0.23 * h;
      const k = 1 - o.assemble;
      const kk = k * k * k;
      const alphaBase = clamp(pose.opacity, 0, 1);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";

      // Stars: a static far field with a hint of pointer parallax.
      ctx.fillStyle = "#cdbcff";
      for (const s of stars) {
        ctx.globalAlpha = s.a * 0.6 * o.intro;
        ctx.fillRect(s.x * w - pointer.x * 5, s.y * h - pointer.y * 4, s.s, s.s);
      }

      // Faint shell ring, standing in for the wireframe icosahedron.
      const depth0 = Math.max(cam.z, 1);
      ctx.globalAlpha = 0.14 * o.intro * Math.min(1, o.opacity + 0.25);
      ctx.strokeStyle = "rgb(160,107,255)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(sx0 + (gx - cam.x) * (focal / depth0), sy0 + cam.y * (focal / depth0), 4.15 * pose.scale * (focal / depth0), 0, Math.PI * 2);
      ctx.stroke();

      // The globe.
      for (let i = 0; i < count; i += stride) {
        const dx = dirs[i * 3];
        const dy = dirs[i * 3 + 1];
        const dz = dirs[i * 3 + 2];
        const nse =
          0.5 * Math.sin(dx * 2.0 + tt * 1.3) +
          0.5 * Math.sin(dy * 2.6 - tt * 1.05) +
          0.4 * Math.sin(dz * 2.2 + tt * 0.9) +
          0.3 * Math.sin((dx + dy + dz) * 3.0 - tt * 1.6);
        const rad = R * (1 + 0.16 * nse);
        const px = dx * rad + scatter[i * 3] * kk;
        const py = dy * rad + scatter[i * 3 + 1] * kk;
        const pz = dz * rad + scatter[i * 3 + 2] * kk;

        // Y then X rotation, then the group's scale and offset.
        const x1 = px * cY + pz * sY;
        const z1 = -px * sY + pz * cY;
        const y2 = py * cX - z1 * sX;
        const z2 = py * sX + z1 * cX;
        const X = x1 * pose.scale + gx;
        const Y = y2 * pose.scale;
        const Z = z2 * pose.scale;

        const depth = cam.z - Z;
        if (depth < 0.6) continue;
        const f = focal / depth;
        let sx = sx0 + (X - cam.x) * f;
        let sy = sy0 - (Y - cam.y) * f;
        let size = SIZE * f;

        // Cursor lens: push outward and swell, as the shader does.
        const ddx = sx - mx;
        const ddy = sy - my;
        const dist = Math.hypot(ddx, ddy);
        if (lens > 0.01 && dist < lensR) {
          const lf = smoothstep(1 - dist / lensR) * lens;
          const nx = dist > 0.5 ? ddx / dist : 0;
          const ny = dist > 0.5 ? ddy / dist : 0;
          sx += nx * lf * 0.05 * h;
          sy += ny * lf * 0.05 * h;
          size *= 1 + lf * 1.6;
        }
        // Scroll warp: fast scrolling stretches the globe vertically.
        sy += (sy - sy0) * vel * 0.05;

        const tc = clamp((dy + 1) / 2 + pose.bias, 0, 1);
        const shade = 0.55 + 0.45 * clamp((Z / (R * 1.2) + 1) / 2, 0, 1);
        ctx.globalAlpha = alphaBase * shade;
        const s = Math.max(size * 2.4, 2);
        ctx.drawImage(sprites[Math.round(tc * (SPRITE_STEPS - 1))], sx - s / 2, sy - s / 2, s, s);
      }

      // Governor: if frames keep taking too long, thin the points once or twice.
      frameAvg += (performance.now() - t0 - frameAvg) * 0.1;
      if (frameAvg > 11 && stride < 3) {
        slow += dt;
        if (slow > 1.5) {
          stride += 1;
          slow = 0;
        }
      } else {
        slow = 0;
      }
    };
    raf = requestAnimationFrame(frame);

    const onVis = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!running) {
        running = true;
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return <canvas ref={ref} className="absolute inset-0 h-full w-full" data-orb-fallback />;
}
