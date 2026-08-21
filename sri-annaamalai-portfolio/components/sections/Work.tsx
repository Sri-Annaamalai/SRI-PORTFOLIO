import Image from "next/image";
import { projects, type Project } from "@/lib/site";
import SectionHeader from "@/components/ui/SectionHeader";

const num = (i: number) => String(i + 1).padStart(2, "0");

const overlayBg = (accent: string) =>
  accent === "violet"
    ? "linear-gradient(0deg, rgba(160,107,255,0.20), transparent 65%)"
    : "linear-gradient(0deg, rgba(255,90,60,0.18), transparent 65%)";

function StackTags({ stack }: { stack: Project["stack"] }) {
  return (
    <ul className="flex flex-wrap" style={{ gap: 8, margin: 0, padding: 0, listStyle: "none" }}>
      {stack.map((s) => (
        <li key={s.label} className={`pill${s.accent === "violet" ? " pill-violet" : ""}`}>
          {s.label}
        </li>
      ))}
    </ul>
  );
}

function Media({ project }: { project: Project }) {
  if (!project.image) return null;
  return (
    <div data-fade data-media className="media-card work-media">
      <Image
        src={project.image.src}
        alt={project.image.alt}
        fill
        sizes="(max-width: 900px) 100vw, 700px"
        className="media-zoom"
        style={{ objectFit: "cover", objectPosition: "top center" }}
      />
      <div className="media-overlay" style={{ background: overlayBg(project.accent) }} aria-hidden />
    </div>
  );
}

function Label({ project, i }: { project: Project; i: number }) {
  return (
    <div className="work-label">
      <span className="text-coral">{num(i)}</span>
      <span>{project.domain}</span>
      {project.status ? (
        <span className={project.accent === "violet" ? "text-violet" : "text-coral"}>
          {project.status}
        </span>
      ) : null}
    </div>
  );
}

/**
 * The lead project. It has no screenshot, so it runs as a typographic feature
 * with its attributes laid out as a three-column data row rather than leaving
 * an empty frame where an image would go.
 */
function Feature({ project, i }: { project: Project; i: number }) {
  return (
    <article>
      <div data-fade>
        <Label project={project} i={i} />
        <h3
          className="display"
          style={{ margin: "18px 0 20px", fontSize: "clamp(30px,4.6vw,64px)", lineHeight: 1.02 }}
        >
          {project.title}
        </h3>
        <p className="work-body" style={{ fontSize: "clamp(16px,1.5vw,19px)", maxWidth: "62ch" }}>
          {project.description}
        </p>
      </div>

      <div data-fade className="work-meta-row">
        <div>
          <div className="meta-key">Domain</div>
          <div className="text-soft" style={{ fontSize: 15 }}>
            {project.domain}
          </div>
        </div>
        <div>
          <div className="meta-key">Built with</div>
          <StackTags stack={project.stack} />
        </div>
        <div>
          <div className="meta-key">Status</div>
          <div className={project.accent === "violet" ? "text-violet" : "text-coral"} style={{ fontSize: 15 }}>
            {project.status ?? "Shipped"}
          </div>
        </div>
      </div>
    </article>
  );
}

function Split({ project, i, flipped }: { project: Project; i: number; flipped: boolean }) {
  return (
    <article className={`work-split${flipped ? " is-flipped" : ""}`}>
      <Media project={project} />
      <div data-fade>
        <Label project={project} i={i} />
        <h3 className="work-title">{project.title}</h3>
        <p className="work-body">{project.description}</p>
        <div style={{ marginTop: 22 }}>
          <StackTags stack={project.stack} />
        </div>
      </div>
    </article>
  );
}

/** Text-only entries: the number carries the composition instead of media. */
function IndexRow({ project, i }: { project: Project; i: number }) {
  return (
    <article data-fade className="work-index-row">
      <div className="mono text-coral" style={{ fontSize: 13, fontVariantNumeric: "tabular-nums" }}>
        {num(i)}
      </div>
      <div>
        <h3 className="work-title" style={{ marginTop: 0 }}>
          {project.title}
        </h3>
        <div className="work-label" style={{ marginTop: 4 }}>
          <span>{project.domain}</span>
          {project.status ? (
            <span className={project.accent === "violet" ? "text-violet" : "text-coral"}>
              {project.status}
            </span>
          ) : null}
        </div>
      </div>
      <div>
        <p className="work-body">{project.description}</p>
        <div style={{ marginTop: 20 }}>
          <StackTags stack={project.stack} />
        </div>
      </div>
    </article>
  );
}

export default function Work() {
  let splitCount = 0;

  return (
    <section id="work" className="section-pad section-tint">
      <div className="shell">
        <SectionHeader
          index="03"
          label="Selected work"
          title={[[{ t: "Things I’ve" }], [{ t: "shipped" }]]}
          lede="Enterprise products built end to end at SNS Square, full-stack engineering with AI woven through."
        />

        {/* Three compositions rather than five identical rows. Only two
            projects have screenshots, so only those run as splits; the rest
            are laid out as text-forward entries instead of rendering a
            heading with a missing image beside it. */}
        <div className="work-list">
          {projects.map((p, i) => {
            if (p.layout === "feature") return <Feature key={p.title} project={p} i={i} />;
            if (p.layout === "split") {
              const flipped = splitCount++ % 2 === 1;
              return <Split key={p.title} project={p} i={i} flipped={flipped} />;
            }
            return <IndexRow key={p.title} project={p} i={i} />;
          })}
        </div>
      </div>
    </section>
  );
}
