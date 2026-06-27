import { contact, site } from "@/lib/site";
import { RevealLines } from "@/components/ui/RevealText";
import Magnetic from "@/components/ui/Magnetic";

export default function Contact() {
  return (
    <section
      id="contact"
      className="relative text-center"
      style={{ padding: "clamp(100px,16vh,200px) clamp(20px,6vw,100px) 0" }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div data-fade className="eyebrow text-coral" style={{ marginBottom: 32 }}>
          (06) — Contact
        </div>
        <h2 className="display m-0" style={{ fontSize: "clamp(40px,9vw,150px)", lineHeight: 0.92, letterSpacing: "-0.04em" }}>
          <RevealLines lines={contact.headline} className="block" />
        </h2>
        <p data-fade className="text-muted" style={{ maxWidth: 560, margin: "36px auto 0", fontSize: "clamp(16px,1.5vw,19px)", lineHeight: 1.6 }}>
          {contact.blurb}
        </p>

        <div data-fade className="flex flex-wrap justify-center" style={{ gap: 16, marginTop: 44 }}>
          <Magnetic>
            <a href={`mailto:${site.email}`} className="btn-primary" style={{ padding: "18px 34px", fontSize: 16 }}>
              Email me
            </a>
          </Magnetic>
          <Magnetic>
            <a href={site.resume} download className="btn-ghost" style={{ padding: "18px 34px", fontSize: 16 }}>
              Download Résumé <span className="mono">↓</span>
            </a>
          </Magnetic>
        </div>

        <div
          data-fade
          className="flex flex-wrap justify-center mono"
          style={{ gap: 28, marginTop: 48, fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase" }}
        >
          {contact.socials.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="social-link">
              {s.label}
            </a>
          ))}
        </div>
      </div>

      <footer
        className="flex flex-wrap items-center justify-between mono"
        style={{
          marginTop: "clamp(90px,14vh,160px)",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          padding: "32px 0",
          gap: 20,
          fontSize: 12,
          letterSpacing: "0.08em",
          color: "var(--color-dim)",
          textTransform: "uppercase",
        }}
      >
        <span className="flex items-center" style={{ gap: 10 }}>
          <span
            style={{ display: "inline-flex", width: 22, height: 22, alignItems: "center", justifyContent: "center", background: "var(--color-coral)", color: "var(--color-bg)", borderRadius: 6, fontWeight: 700, fontSize: 12 }}
          >
            {site.initial}
          </span>
          {site.name}
        </span>
        <span>{contact.footerNote}</span>
      </footer>
    </section>
  );
}
