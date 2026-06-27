import { skills } from "@/lib/site";
import { RevealLines } from "@/components/ui/RevealText";

export default function Skills() {
  return (
    <section
      id="skills"
      className="section-pad relative"
      style={{ background: "rgba(10,10,12,0.78)", backdropFilter: "blur(3px)" }}
    >
      <div className="shell">
        <div className="flex flex-wrap items-end justify-between" style={{ gap: 24, marginBottom: 56 }}>
          <div>
            <div data-fade className="eyebrow text-coral" style={{ marginBottom: 24 }}>
              (02) — Stack
            </div>
            <h2 className="display m-0" style={{ fontSize: "clamp(34px,6vw,86px)" }}>
              <RevealLines lines={[[{ t: "Tools of" }], [{ t: "the trade" }]]} className="block" />
            </h2>
          </div>
          <p data-fade className="text-faint" style={{ maxWidth: 340, fontSize: 15, lineHeight: 1.6 }}>
            The stack I reach for to take products from prototype to production.
          </p>
        </div>

        <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 18 }}>
          {skills.map((group, i) => {
            const isAI = group.accent === "violet";
            return (
              <div key={group.title} data-card className={`skill-card${isAI ? " is-ai" : ""}`}>
                <div className="flex items-baseline justify-between" style={{ marginBottom: 22 }}>
                  <span style={{ fontWeight: 600, fontSize: 19 }}>{group.title}</span>
                  <span className={`mono ${isAI ? "text-violet" : "text-coral"}`} style={{ fontSize: 12 }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="flex flex-wrap" style={{ gap: 9 }}>
                  {group.items.map((item) => (
                    <span key={item} className={`chip${isAI ? " chip-violet" : ""}`}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
