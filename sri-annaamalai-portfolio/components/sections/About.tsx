import Image from "next/image";
import { about, site } from "@/lib/site";
import { RevealLines } from "@/components/ui/RevealText";

export default function About() {
  return (
    <section
      id="about"
      className="section-pad relative"
      style={{ background: "rgba(10,10,12,0.72)", backdropFilter: "blur(3px)" }}
    >
      <div className="shell">
        <div data-fade className="eyebrow text-coral" style={{ marginBottom: 48 }}>
          (01) — About
        </div>

        <div className="grid items-start" style={{ gridTemplateColumns: "1fr", gap: "clamp(40px,6vw,90px)" }}>
          <div style={{ maxWidth: 760 }}>
            <h2 className="m-0" style={{ fontWeight: 500, fontSize: "clamp(26px,3.4vw,46px)", lineHeight: 1.28, letterSpacing: "-0.02em" }}>
              <RevealLines lines={about.statement} className="block" />
            </h2>
            <p data-fade className="text-muted" style={{ margin: "34px 0 0", fontSize: "clamp(15px,1.4vw,18px)", lineHeight: 1.7, maxWidth: 620 }}>
              {about.paragraph}
            </p>
            <div data-fade className="flex flex-wrap" style={{ gap: 14, marginTop: 36 }}>
              {about.tags.map((tag) => (
                <span
                  key={tag}
                  className="mono text-soft"
                  style={{ padding: "9px 16px", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 100, fontSize: 12, letterSpacing: "0.06em" }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div data-fade className="flex flex-col" style={{ gap: 28 }}>
            <div style={{ position: "relative", width: "100%", aspectRatio: "4 / 5", maxWidth: 360, border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, overflow: "hidden" }}>
              <Image
                src="/assets/image.png"
                alt={site.name}
                fill
                sizes="(max-width: 900px) 100vw, 360px"
                style={{ objectFit: "cover", objectPosition: "top center" }}
              />
            </div>
            <div className="flex flex-wrap" style={{ gap: 30 }}>
              {about.stats.map((s) => (
                <div key={s.label}>
                  <div
                    style={{ fontWeight: 700, fontSize: "clamp(34px,4vw,52px)", lineHeight: 1 }}
                    className={s.accent === "violet" ? "text-violet" : "text-coral"}
                  >
                    <span data-count={s.value} data-suffix={s.suffix}>
                      0
                    </span>
                  </div>
                  <div className="mono text-faint" style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", marginTop: 8 }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
