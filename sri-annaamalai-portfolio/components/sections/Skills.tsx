import { skills } from "@/lib/site";
import SectionHeader from "@/components/ui/SectionHeader";

export default function Skills() {
  return (
    <section id="skills" className="section-pad section-tint">
      <div className="shell">
        <SectionHeader
          index="02"
          label="Stack"
          title={[[{ t: "Tools of" }], [{ t: "the trade" }]]}
          lede="The stack I reach for to take products from prototype to production."
        />

        {/* Exactly 6 cells across 1 / 2 / 3 columns. The old
            `auto-fit,minmax(300px,1fr)` resolved to 4 columns at this width
            and left a two-card orphan row. */}
        <div className="grid-matrix">
          {skills.map((group, i) => {
            const isAI = group.accent === "violet";
            return (
              <div key={group.title} data-card className={`matrix-cell${isAI ? " is-ai" : ""}`}>
                <div className="matrix-head">
                  <h3 style={{ margin: 0, fontWeight: 600, fontSize: 19 }}>{group.title}</h3>
                  <span className={`mono matrix-index ${isAI ? "text-violet" : "text-coral"}`} style={{ fontSize: 12 }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <ul className="flex flex-wrap" style={{ gap: 8, margin: 0, padding: 0, listStyle: "none" }}>
                  {group.items.map((item) => (
                    <li key={item} className={`chip${isAI ? " chip-violet" : ""}`}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
