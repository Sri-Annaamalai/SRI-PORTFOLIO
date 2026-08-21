import { RevealLines } from "@/components/ui/RevealText";

type Part = { t: string; c?: string };

/**
 * One header for every section: a hairline rail carrying the index and the
 * section name, then the heading and its lede stacked on the same left edge.
 *
 * Replaces the per-section `flex justify-between` header, where the lede sat
 * in the top-right corner aligned to nothing and the heading's optical left
 * edge drifted between sections.
 */
export default function SectionHeader({
  index,
  label,
  title,
  lede,
  tone = "display",
}: {
  index: string;
  label: string;
  title: ReadonlyArray<ReadonlyArray<Part>>;
  lede?: string;
  tone?: "display" | "statement";
}) {
  const isDisplay = tone === "display";

  return (
    <header className="sec-head">
      <div data-fade className="sec-rail">
        <span className="sec-rail-index">{index}</span>
        <span>{label}</span>
      </div>

      <h2
        className={`sec-title m-0 ${isDisplay ? "display" : ""}`}
        style={
          isDisplay
            ? { fontSize: "clamp(32px,5.4vw,78px)" }
            : {
                fontWeight: 500,
                fontSize: "clamp(25px,3.2vw,44px)",
                lineHeight: 1.28,
                letterSpacing: "-0.02em",
              }
        }
      >
        <RevealLines lines={title} className="block" />
      </h2>

      {lede ? (
        <p data-fade className="sec-lede">
          {lede}
        </p>
      ) : null}
    </header>
  );
}
