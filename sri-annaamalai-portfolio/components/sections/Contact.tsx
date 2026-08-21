import { contact, site } from "@/lib/site";
import { RevealLines } from "@/components/ui/RevealText";
import Magnetic from "@/components/ui/Magnetic";

export default function Contact() {
  return (
    <section
      id="contact"
      className="section-tint"
      style={{ padding: "clamp(90px,14vh,170px) clamp(20px,6vw,100px) 0" }}
    >
      <div className="shell">
        {/* Left-aligned on the same rail as every other section, so the page
            does not switch alignment for its closing statement. */}
        <header className="sec-head">
          <div data-fade className="sec-rail">
            <span className="sec-rail-index">08</span>
            <span>Contact</span>
          </div>
          <h2
            className="sec-title display m-0"
            style={{ fontSize: "clamp(38px,8vw,132px)", lineHeight: 0.94, letterSpacing: "-0.04em" }}
          >
            <RevealLines lines={contact.headline} className="block" />
          </h2>
          <p data-fade className="sec-lede" style={{ color: "var(--color-muted)", fontSize: "clamp(16px,1.5vw,19px)" }}>
            {contact.blurb}
          </p>
        </header>

        <div data-fade className="flex flex-wrap" style={{ gap: 14 }}>
          <Magnetic>
            <a href={`mailto:${site.email}`} className="btn-primary" style={{ padding: "18px 32px", fontSize: 16 }}>
              Email me
            </a>
          </Magnetic>
          <Magnetic>
            <a href={site.resume} download className="btn-ghost" style={{ padding: "18px 32px", fontSize: 16 }}>
              Download résumé <span className="mono" aria-hidden>↓</span>
            </a>
          </Magnetic>
        </div>

        {/* The addresses themselves, laid out as an aligned reference row.
            Replaces the loose centred row of bare "GitHub / LinkedIn / X"
            labels, which gave no way to read or copy an actual handle. */}
        <div data-fade className="channel-grid" style={{ marginTop: "clamp(40px,5vw,64px)" }}>
          {contact.channels.map((c) => {
            const external = c.href.startsWith("http");
            return (
              <a
                key={c.label}
                href={c.href}
                className="channel"
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                <span className="channel-key">{c.label}</span>
                <span className="channel-value">{c.value}</span>
              </a>
            );
          })}
        </div>

        <footer className="site-footer">
          <span className="flex items-center" style={{ gap: 10 }}>
            <span className="nav-badge" style={{ width: 22, height: 22, fontSize: 12 }} aria-hidden>
              {site.initial}
            </span>
            {site.name}
          </span>
          <span>{contact.footerNote}</span>
        </footer>
      </div>
    </section>
  );
}
