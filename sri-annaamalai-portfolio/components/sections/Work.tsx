import Image from "next/image";
import { projects } from "@/lib/site";
import { RevealLines } from "@/components/ui/RevealText";

const overlayBg = (accent: string) =>
  accent === "violet"
    ? "linear-gradient(0deg, rgba(160,107,255,0.18), transparent)"
    : "linear-gradient(0deg, rgba(255,90,60,0.16), transparent)";

export default function Work() {
  return (
    <section
      id="work"
      className="section-pad relative"
      style={{ background: "rgba(10,10,12,0.82)", backdropFilter: "blur(3px)" }}
    >
      <div className="shell">
        <div className="flex flex-wrap items-end justify-between" style={{ gap: 24, marginBottom: 64 }}>
          <div>
            <div data-fade className="eyebrow text-coral" style={{ marginBottom: 24 }}>
              (03) — Selected Work
            </div>
            <h2 className="display m-0" style={{ fontSize: "clamp(34px,6vw,86px)" }}>
              <RevealLines lines={[[{ t: "Things I’ve" }], [{ t: "shipped" }]]} className="block" />
            </h2>
          </div>
          <p data-fade className="text-faint" style={{ maxWidth: 340, fontSize: 15, lineHeight: 1.6 }}>
            Enterprise products built end-to-end at SNS Square — full-stack engineering with AI woven through.
          </p>
        </div>

        <div className="flex flex-col" style={{ gap: "clamp(40px,7vw,110px)" }}>
          {projects.map((p, i) => (
            <article key={p.title} className="grid items-center" style={{ gridTemplateColumns: "1fr", gap: 36 }}>
              {p.media.kind === "image" && (
                <div data-fade data-media className="media-card">
                  <Image
                    src={p.media.src}
                    alt={p.media.alt}
                    fill
                    sizes="(max-width: 900px) 100vw, 1400px"
                    className="media-zoom"
                    style={{ objectFit: "cover", objectPosition: "top center" }}
                  />
                  <div className="media-overlay" style={{ background: overlayBg(p.overlay) }} />
                </div>
              )}

              <div data-fade>
                <div className="flex items-center" style={{ gap: 14, marginBottom: 16 }}>
                  <span className="mono text-faint" style={{ fontSize: 13 }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={`mono ${p.badgeAccent === "violet" ? "text-violet" : "text-coral"}`}
                    style={{
                      fontSize: 11,
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      border: `1px solid ${p.badgeAccent === "violet" ? "rgba(160,107,255,0.4)" : "rgba(255,90,60,0.35)"}`,
                      padding: "4px 10px",
                      borderRadius: 100,
                    }}
                  >
                    {p.badge}
                  </span>
                </div>
                <h3 style={{ margin: "0 0 14px", fontWeight: 600, fontSize: "clamp(26px,3.2vw,42px)", letterSpacing: "-0.02em" }}>
                  {p.title}
                </h3>
                <p className="text-muted" style={{ margin: "0 0 22px", fontSize: "clamp(15px,1.4vw,17px)", lineHeight: 1.7, maxWidth: 560 }}>
                  {p.description}
                </p>
                <div className="flex flex-wrap" style={{ gap: 9 }}>
                  {p.stack.map((s) => (
                    <span key={s.label} className={`pill${s.accent === "violet" ? " pill-violet" : ""}`}>
                      {s.label}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
