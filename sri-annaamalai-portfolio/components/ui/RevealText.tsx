import type { ReactNode } from "react";

const colorClass: Record<string, string> = {
  coral: "text-coral",
  violet: "text-violet",
  faint: "text-faint",
};

type Part = { t: string; c?: string };

/**
 * Renders heading lines as clip-masked rows. Each inner span carries the
 * reveal attribute (`data-line` by default) that the global Reveals controller
 * animates; CSS hides them pre-reveal so there is no flash.
 */
export function RevealLines({
  lines,
  attr = "data-line",
  className,
}: {
  lines: ReadonlyArray<ReadonlyArray<Part>>;
  attr?: string;
  className?: string;
}): ReactNode {
  return (
    <>
      {lines.map((parts, i) => {
        const attrProps = { [attr]: "" } as Record<string, string>;
        return (
          <span key={i} className="line-mask">
            <span {...attrProps} className={className}>
              {parts.map((p, j) =>
                p.c ? (
                  <span key={j} className={colorClass[p.c]}>
                    {p.t}
                  </span>
                ) : (
                  <span key={j}>{p.t}</span>
                ),
              )}
            </span>
          </span>
        );
      })}
    </>
  );
}
