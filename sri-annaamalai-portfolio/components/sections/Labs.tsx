import { labs } from "@/lib/site";
import SectionHeader from "@/components/ui/SectionHeader";

/**
 * Pre-SNS Square engineering, kept out of Selected Work so the shipped
 * products are not diluted. The year carries the composition here, which keeps
 * this visually distinct from the numbered index rows in the work section.
 */
export default function Labs() {
  return (
    <section id="labs" className="section-pad section-tint">
      <div className="shell">
        <SectionHeader
          index="06"
          label="Early work"
          title={[[{ t: "Before the" }], [{ t: "day job" }]]}
          lede="Computer vision, medical imaging and embedded IoT, built while studying engineering."
        />

        <div className="lab-list">
          {labs.map((lab) => (
            <article key={lab.title} data-fade className="lab-row">
              <div className={`lab-year ${lab.accent === "violet" ? "text-violet" : "text-coral"}`} aria-hidden>
                {lab.year}
              </div>

              <div className="lab-body">
                <h3 className="lab-title">
                  <span className="sr-only">{lab.year}: </span>
                  {lab.title}
                </h3>
                <p className="lab-text">{lab.body}</p>
                <ul className="flex flex-wrap" style={{ gap: 8, margin: "18px 0 0", padding: 0, listStyle: "none" }}>
                  {lab.stack.map((s) => (
                    <li key={s} className={`pill${lab.accent === "violet" ? " pill-violet" : ""}`}>
                      {s}
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
