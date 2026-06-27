import { marquee } from "@/lib/site";

function Sequence({ hidden }: { hidden?: boolean }) {
  return (
    <span style={{ display: "flex", alignItems: "center" }} aria-hidden={hidden}>
      {marquee.map((item, i) => (
        <span key={i} style={{ display: "inline-flex", alignItems: "center" }}>
          {item}
          <span
            style={{ color: i % 2 === 0 ? "var(--color-coral)" : "var(--color-violet)", margin: "0 28px" }}
          >
            ✦
          </span>
        </span>
      ))}
    </span>
  );
}

export default function Marquee() {
  return (
    <div
      style={{
        borderTop: "1px solid rgba(255,255,255,0.08)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        padding: "22px 0",
        overflow: "hidden",
        background: "rgba(10,10,12,0.5)",
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        style={{
          display: "flex",
          width: "max-content",
          animation: "marquee 28s linear infinite",
          fontFamily: "var(--font-mono), monospace",
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          fontSize: "clamp(14px,1.6vw,20px)",
          color: "var(--color-soft)",
        }}
      >
        <Sequence />
        <Sequence hidden />
      </div>
    </div>
  );
}
