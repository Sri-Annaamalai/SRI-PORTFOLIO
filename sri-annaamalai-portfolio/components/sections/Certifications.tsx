import { certifications } from "@/lib/site";
import SectionHeader from "@/components/ui/SectionHeader";

const total = certifications.reduce((n, g) => n + g.items.length, 0);

/**
 * Seventeen certifications grouped into six issuer blocks. A flat
 * seventeen-row list with a hairline under every row is the lazy shape for
 * this; grouping puts the issuer names, which are the credible part, on the
 * reading edge and keeps the section to six chunks.
 */
export default function Certifications() {
  return (
    <section id="certifications" className="section-pad section-tint">
      <div className="shell">
        <SectionHeader
          index="05"
          label="Certifications"
          title={[[{ t: "Credentials" }]]}
          lede={`${total} certifications across GenAI, data engineering, cloud and design practice.`}
        />

        <div className="cert-list">
          {certifications.map((group) => (
            <div key={group.issuer} className="cert-group">
              <div className="cert-issuer">
                <h3
                  data-fade
                  className={group.accent === "violet" ? "text-violet" : "text-fg"}
                  style={{ margin: 0, fontWeight: 600, fontSize: "clamp(18px,1.8vw,23px)" }}
                >
                  {group.issuer}
                </h3>
                <div data-fade className="cert-count">
                  {group.items.length} {group.items.length === 1 ? "credential" : "credentials"}
                </div>
              </div>

              <ul className="cert-items">
                {group.items.map((c) => (
                  <li key={c.name} data-card className="cert-item">
                    <span className="cert-name">{c.name}</span>
                    <span className="cert-date">{c.date}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
