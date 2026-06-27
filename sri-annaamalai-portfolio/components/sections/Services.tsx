import { services } from "@/lib/site";
import { RevealLines } from "@/components/ui/RevealText";

export default function Services() {
  return (
    <section
      id="services"
      className="section-pad relative"
      style={{ background: "rgba(10,10,12,0.82)", backdropFilter: "blur(3px)" }}
    >
      <div className="shell">
        <div data-fade className="eyebrow text-coral" style={{ marginBottom: 24 }}>
          (05) — What I do
        </div>
        <h2 className="display" style={{ margin: "0 0 56px", fontSize: "clamp(34px,6vw,86px)" }}>
          <RevealLines lines={[[{ t: "How I can " }, { t: "help", c: "coral" }]]} className="block" />
        </h2>

        <div
          className="grid"
          style={{
            gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
            gap: 1,
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 20,
            overflow: "hidden",
          }}
        >
          {services.map((s, i) => (
            <div key={s.title} data-card className="cell" style={{ padding: "clamp(28px,3vw,44px)" }}>
              <div className={`mono ${s.accent === "violet" ? "text-violet" : "text-coral"}`} style={{ fontSize: 12, marginBottom: 24 }}>
                {String(i + 1).padStart(2, "0")}
              </div>
              <h3 style={{ margin: "0 0 12px", fontWeight: 600, fontSize: 21 }}>{s.title}</h3>
              <p className="text-faint" style={{ margin: 0, fontSize: 14.5, lineHeight: 1.65 }}>
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
