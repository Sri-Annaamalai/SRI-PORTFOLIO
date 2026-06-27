import { experience } from "@/lib/site";
import { RevealLines } from "@/components/ui/RevealText";

export default function Experience() {
  return (
    <section
      id="experience"
      className="section-pad relative"
      style={{ background: "rgba(10,10,12,0.78)", backdropFilter: "blur(3px)" }}
    >
      <div className="shell">
        <div data-fade className="eyebrow text-coral" style={{ marginBottom: 56 }}>
          (04) — Experience
        </div>

        <div className="grid" style={{ gridTemplateColumns: "1fr", gap: 48 }}>
          <div>
            <div className="flex items-center" style={{ gap: 12, marginBottom: 18 }}>
              <span
                aria-hidden
                style={{ width: 9, height: 9, borderRadius: "50%", background: "var(--color-coral)", animation: "pulse-dot 2s ease-in-out infinite" }}
              />
              <span className="mono text-coral" style={{ fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase" }}>
                Now
              </span>
            </div>
            <h3
              className="m-0"
              style={{ fontFamily: "var(--font-display), system-ui, sans-serif", fontWeight: 700, fontSize: "clamp(34px,5vw,68px)", lineHeight: 0.98, letterSpacing: "-0.03em" }}
            >
              <RevealLines lines={[[{ t: experience.company }]]} className="block" />
            </h3>
            <p data-fade style={{ margin: "18px 0 0", fontSize: "clamp(17px,1.6vw,22px)", fontWeight: 500 }}>
              {experience.role}
            </p>
            <p data-fade className="text-faint" style={{ margin: "14px 0 0", fontSize: 15, lineHeight: 1.7, maxWidth: 440 }}>
              {experience.summary}
            </p>
          </div>

          <div data-fade>
            <div className="mono text-faint" style={{ fontSize: 12, letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 24 }}>
              Responsibilities
            </div>
            <div
              className="grid"
              style={{
                gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
                gap: 1,
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 16,
                overflow: "hidden",
              }}
            >
              {experience.responsibilities.map((r, i) => (
                <div key={r.label} data-card className="flex items-start" style={{ padding: 22, background: "var(--color-panel)", gap: 14 }}>
                  <span className={`mono ${r.accent === "violet" ? "text-violet" : "text-coral"}`} style={{ fontSize: 12 }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-soft" style={{ fontSize: 15, lineHeight: 1.5 }}>
                    {r.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
