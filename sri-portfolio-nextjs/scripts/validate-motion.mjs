/**
 * Motion validation: drives the portfolio (and trionn.com as the reference)
 * through real Chromium, measures each interaction, and saves screenshots.
 *
 *   node scripts/validate-motion.mjs
 *
 * Requires the dev server on http://localhost:3000 and `playwright` installed.
 */
import { chromium } from "playwright";
import { mkdirSync, writeFileSync } from "node:fs";

const MINE = process.env.SITE_URL ?? "http://localhost:3000/";
const REF = "https://trionn.com/";
const OUT = "validation";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

mkdirSync(OUT, { recursive: true });

// matrix(a,b,c,d,tx,ty) -> uniform scale + translate
function parseMatrix(str) {
  if (!str || str === "none") return { scale: 1, tx: 0, ty: 0 };
  const n = str.match(/matrix\(([^)]+)\)/);
  if (!n) return { scale: 1, tx: 0, ty: 0 };
  const p = n[1].split(",").map((v) => parseFloat(v));
  return { scale: Math.hypot(p[0], p[1]), tx: p[4], ty: p[5] };
}

const rows = [];
const log = (name, pass, detail) => {
  rows.push({ name, pass, detail });
  console.log(`${pass ? "PASS" : "FAIL"}  ${name.padEnd(34)} ${detail}`);
};

async function validateMine(browser) {
  console.log("\n=== PORTFOLIO (motion forced on) ===");
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "no-preference",
  });
  const page = await ctx.newPage();

  await page.goto(MINE, { waitUntil: "domcontentloaded" });

  // 1. Preloader present at load
  await page.screenshot({ path: `${OUT}/mine-01-preloader.png` });
  const preEl = page.getByTestId("preloader");
  const preSeen = await preEl
    .isVisible()
    .catch(() => false);
  log("Preloader intro", preSeen, preSeen ? "overlay rendered at load" : "not found");

  // 2. Preloader clears, then Lenis attaches
  await preEl.waitFor({ state: "detached", timeout: 8000 }).catch(() => {});
  await sleep(400);
  const htmlClass = await page.evaluate(() => document.documentElement.className);
  const lenis = /\blenis\b/.test(htmlClass);
  log("Lenis smooth scroll", lenis, lenis ? "<html class='lenis lenis-smooth'>" : `class='${htmlClass}'`);

  // 3. Hero SplitText (headline split into char nodes)
  const chars = await page
    .getByTestId("hero-headline")
    .evaluate((el) => el.querySelectorAll("div,span").length)
    .catch(() => 0);
  log("Hero SplitText reveal", chars > 10, `${chars} char/line nodes`);
  await page.screenshot({ path: `${OUT}/mine-02-hero.png` });

  // 4. Custom cursor appears + scales over interactive elements
  await page.mouse.move(250, 760);
  await sleep(300);
  const cursor = page.getByTestId("cursor");
  const sIdle = parseMatrix(await cursor.evaluate((e) => getComputedStyle(e).transform)).scale;
  const cta = page.locator("#top").getByRole("link", { name: "View work" });
  await cta.hover();
  await sleep(350);
  const sHover = parseMatrix(await cursor.evaluate((e) => getComputedStyle(e).transform)).scale;
  log("Cursor scales on hover", sHover > sIdle * 1.5, `idle ${sIdle.toFixed(2)}x -> hover ${sHover.toFixed(2)}x`);
  await page.screenshot({ path: `${OUT}/mine-03-cursor-hover.png` });

  // 5. Magnetic CTA pulls toward an off-center pointer
  const startBtn = page.locator("#top").getByRole("link", { name: "Start a project" });
  const box = await startBtn.boundingBox();
  let magTx = 0;
  if (box) {
    await page.mouse.move(box.x + box.width * 0.9, box.y + box.height / 2);
    await sleep(350);
    magTx = parseMatrix(
      await startBtn.evaluate((el) => getComputedStyle(el.closest("[data-cursor]")).transform),
    ).tx;
  }
  log("Magnetic CTA", Math.abs(magTx) > 0.5, `translateX ${magTx.toFixed(1)}px`);

  // 6. Marquee animates (transform changes over time)
  const track = page.getByTestId("marquee-track");
  const m1 = parseMatrix(await track.evaluate((e) => getComputedStyle(e).transform)).tx;
  await sleep(350);
  const m2 = parseMatrix(await track.evaluate((e) => getComputedStyle(e).transform)).tx;
  log("Marquee in motion", Math.abs(m2 - m1) > 1, `${m1.toFixed(0)}px -> ${m2.toFixed(0)}px`);

  // 7. Scroll-reveal: a below-fold element goes from opacity 0 to 1
  const cell = page.locator(".stack-cell").first();
  const op0 = await cell.evaluate((e) => +getComputedStyle(e).opacity).catch(() => 1);
  await page.getByRole("heading", { name: "The stack" }).scrollIntoViewIfNeeded();
  await sleep(900);
  const op1 = await cell.evaluate((e) => +getComputedStyle(e).opacity).catch(() => 1);
  log("Scroll-reveal stagger", op0 < 0.5 && op1 > 0.9, `opacity ${op0.toFixed(2)} -> ${op1.toFixed(2)}`);

  // 8. Counter resolved its value
  const counterText = (await page.getByTestId("counter").first().innerText()).trim();
  log("Animated counter", /^\d{2}/.test(counterText), `reads "${counterText}"`);

  await page.screenshot({ path: `${OUT}/mine-04-full.png`, fullPage: true });
  await ctx.close();
}

async function validateReference(browser) {
  console.log("\n=== REFERENCE trionn.com ===");
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "no-preference",
  });
  const page = await ctx.newPage();
  try {
    await page.goto(REF, { waitUntil: "domcontentloaded", timeout: 45000 });
    await page.screenshot({ path: `${OUT}/trionn-01-load.png` });
    await sleep(3500);

    const htmlClass = await page.evaluate(() => document.documentElement.className);
    log("trionn: Lenis", /\blenis\b/.test(htmlClass), `class='${htmlClass.slice(0, 60)}'`);

    const blendCursors = await page.evaluate(
      () =>
        [...document.querySelectorAll("*")].filter((el) => {
          const s = getComputedStyle(el);
          return s.mixBlendMode === "difference" && s.position === "fixed";
        }).length,
    );
    log("trionn: blend cursor", blendCursors > 0, `${blendCursors} fixed mix-blend-difference nodes`);

    await page.screenshot({ path: `${OUT}/trionn-02-hero.png` });
    await page.mouse.move(720, 450);
    await page.evaluate(() => window.scrollTo({ top: 1600, behavior: "smooth" }));
    await sleep(1500);
    await page.screenshot({ path: `${OUT}/trionn-03-scrolled.png` });
  } catch (e) {
    log("trionn: reachable", false, String(e).slice(0, 80));
  }
  await ctx.close();
}

const browser = await chromium.launch();
try {
  await validateMine(browser);
  await validateReference(browser);
} finally {
  await browser.close();
}

const passed = rows.filter((r) => r.pass).length;
const md = [
  "# Motion validation report",
  "",
  `Portfolio: ${MINE}  ·  Reference: ${REF}`,
  `Result: **${passed}/${rows.length} checks passed**`,
  "",
  "| Check | Result | Detail |",
  "| --- | --- | --- |",
  ...rows.map((r) => `| ${r.name} | ${r.pass ? "PASS" : "FAIL"} | ${r.detail} |`),
  "",
  "Screenshots saved alongside this report in `validation/`.",
  "",
].join("\n");
writeFileSync(`${OUT}/REPORT.md`, md);
console.log(`\n${passed}/${rows.length} checks passed. Report + screenshots in ./${OUT}/`);
process.exit(passed === rows.length ? 0 : 1);
