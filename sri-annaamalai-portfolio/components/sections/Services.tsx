import { services } from "@/lib/site";
import SectionHeader from "@/components/ui/SectionHeader";

export default function Services() {
  return (
    <section id="services" className="section-pad section-tint">
      <div className="shell">
        <SectionHeader
          index="07"
          label="What I do"
          title={[[{ t: "How I can " }, { t: "help", c: "coral" }]]}
        />

        {/* Same exact-count matrix as the stack section: 6 services, 3 columns,
            2 full rows, no orphan cell. */}
        <div className="grid-matrix">
          {services.map((s, i) => (
            <div
              key={s.title}
              data-card
              className={`matrix-cell${s.accent === "violet" ? " is-ai" : ""}`}
            >
              <div
                className={`mono matrix-index ${s.accent === "violet" ? "text-violet" : "text-coral"}`}
                style={{ fontSize: 12, marginBottom: 22 }}
              >
                {String(i + 1).padStart(2, "0")}
              </div>
              <h3 style={{ margin: "0 0 12px", fontWeight: 600, fontSize: 20, letterSpacing: "-0.01em" }}>
                {s.title}
              </h3>
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
