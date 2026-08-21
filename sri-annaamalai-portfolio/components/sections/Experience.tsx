import { experience } from "@/lib/site";
import SectionHeader from "@/components/ui/SectionHeader";

/**
 * Two roles now, not one. The resume shows a promotion from Junior Software
 * Associate (Coimbatore) to Software Associate (Bengaluru), so this reads as a
 * timeline: period and place on a left rail, the work itself on the right.
 */
export default function Experience() {
  return (
    <section id="experience" className="section-pad section-tint">
      <div className="shell">
        <SectionHeader
          index="04"
          label="Experience"
          title={[[{ t: "Two years at" }], [{ t: "SNS Square" }]]}
          lede="Promoted from full-stack recruitment tooling into agentic AI architecture, at the same company."
        />

        <div className="role-list">
          {experience.roles.map((role) => (
            <article key={role.title} className="role-row">
              <div className="role-rail">
                <div
                  data-fade
                  className={`role-period ${role.current ? "text-coral" : "text-dim"}`}
                >
                  {role.period}
                </div>
                <div data-fade className="role-place">
                  {role.location}
                </div>
              </div>

              <div>
                <h3 data-fade className="role-title">
                  {role.title}
                </h3>
                <div data-fade className="role-company">
                  {role.company}
                </div>

                <ul className="role-points">
                  {role.points.map((p, i) => (
                    <li key={p.label} data-card className="role-point">
                      <span
                        className={`role-point-index ${p.accent === "violet" ? "text-violet" : "text-coral"}`}
                        aria-hidden
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span>{p.label}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
