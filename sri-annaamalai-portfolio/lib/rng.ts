/**
 * mulberry32, a small seeded PRNG.
 *
 * The orb's star field and scatter are built inside render, so they have to be
 * reproducible: a fresh `Math.random()` draw would scatter them anew whenever
 * React happens to re-run the memo. A seed keeps the same uniform distribution
 * while making each field a fixed property of the seed.
 */
export function makeRng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
