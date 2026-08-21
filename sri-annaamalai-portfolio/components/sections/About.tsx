import { about } from "@/lib/site";
import SectionHeader from "@/components/ui/SectionHeader";

export default function About() {
  return (
    <section id="about" className="section-pad section-tint">
      <div className="shell">
        <SectionHeader index="01" label="About" title={about.statement} tone="statement" />

        {/* Two real columns from 960px up. Prose on the left, the metrics rail
            on the right. Previously the aside also carried a portrait; with
            that gone the stats stack vertically so the column still reads as a
            deliberate rail rather than a leftover gap. */}
        <div className="grid-editorial">
          <div>
            <p
              data-fade
              className="text-muted"
              style={{ margin: 0, fontSize: "clamp(15px,1.4vw,18px)", lineHeight: 1.75, maxWidth: "60ch" }}
            >
              {about.paragraph}
            </p>

            <ul
              data-fade
              className="flex flex-wrap"
              style={{ gap: 12, margin: "clamp(30px,4vw,44px) 0 0", padding: 0, listStyle: "none" }}
            >
              {about.tags.map((tag) => (
                <li key={tag} className="pill">
                  {tag}
                </li>
              ))}
            </ul>
          </div>

          <aside data-fade className="about-aside">
            <div className="stat-rail">
              {about.stats.map((s) => (
                <div key={s.label} className="stat-cell">
                  <div className={`stat-value ${s.accent === "violet" ? "text-violet" : "text-coral"}`}>
                    <span data-count={s.value} data-suffix={s.suffix}>
                      0
                    </span>
                  </div>
                  <div className="stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
