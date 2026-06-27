import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects, getProject } from "@/lib/projects";
import ParallaxImage from "@/components/ui/ParallaxImage";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  return { title: p.title, description: p.summary };
}

export default async function WorkPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();

  const idx = projects.findIndex((x) => x.slug === slug);
  const next = projects[(idx + 1) % projects.length];

  return (
    <article className="mx-auto max-w-[1400px] px-5 pb-24 pt-32 md:px-8 md:pb-36 md:pt-40">
      <Link
        href="/#work"
        className="font-mono text-xs uppercase tracking-[0.18em] text-muted transition-colors hover:text-fg"
      >
        &larr; Work
      </Link>

      <header className="mt-10 grid gap-8 border-b border-line pb-12 md:grid-cols-12 md:items-end">
        <div className="md:col-span-8">
          <span className="font-mono text-sm text-faint">{p.index}</span>
          <h1 className="display mt-3 text-[clamp(2.4rem,7vw,5.5rem)] font-semibold text-fg">
            {p.title}
          </h1>
        </div>
        <dl className="grid grid-cols-2 gap-6 md:col-span-4">
          <Meta label="Role" value={p.role} />
          <Meta label="Year" value={p.year} />
          <Meta label="Domain" value={p.domain} />
          <Meta label="Status" value={p.status} />
        </dl>
      </header>

      <ParallaxImage
        src={p.image}
        alt={`${p.title} preview`}
        priority
        className="mt-12 aspect-[16/10] w-full"
      />

      <div className="mt-16 grid gap-12 md:grid-cols-12">
        <div className="md:col-span-7">
          <p className="text-xl leading-relaxed text-fg md:text-2xl">
            {p.summary}
          </p>
          <p className="mt-6 max-w-prose text-base leading-relaxed text-muted md:text-lg">
            {p.description}
          </p>
        </div>

        <div className="flex flex-col gap-10 md:col-span-5 md:pl-6">
          <div>
            <span className="label">What it does</span>
            <ul className="mt-4 flex flex-col gap-3">
              {p.highlights.map((h) => (
                <li
                  key={h}
                  className="border-l border-accent/40 pl-4 text-sm leading-relaxed text-muted"
                >
                  {h}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <span className="label">Stack</span>
            <div className="mt-4 flex flex-wrap gap-2">
              {p.stack.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-line-strong px-3 py-1.5 font-mono text-xs text-muted"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Next project */}
      <Link
        href={`/work/${next.slug}`}
        className="group mt-24 flex items-center justify-between border-t border-line pt-8"
      >
        <div>
          <span className="font-mono text-xs uppercase tracking-[0.18em] text-faint">
            Next
          </span>
          <p className="display mt-2 text-3xl font-medium text-fg transition-colors group-hover:text-accent md:text-5xl">
            {next.title}
          </p>
        </div>
        <span
          aria-hidden
          className="text-2xl text-muted transition-all duration-300 group-hover:translate-x-1 group-hover:text-fg"
        >
          &rarr;
        </span>
      </Link>
    </article>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-mono text-[11px] uppercase tracking-[0.18em] text-faint">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-fg">{value}</dd>
    </div>
  );
}
