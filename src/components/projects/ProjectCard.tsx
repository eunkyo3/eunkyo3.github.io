import Link from "next/link";
import type { Project } from "@/content/types";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { ArchStrip } from "./ArchStrip";
import { MetricValue } from "./MetricValue";
import { ProjectMedia } from "./ProjectMedia";

// The title link stretches over the whole card; inner links sit above it (z-10).
const card =
  "group relative flex w-full flex-col rounded-md border border-line bg-surface transition-[border-color,transform] duration-200 ease-out hover:-translate-y-0.5 hover:border-line-strong has-[[data-card-link]:focus-visible]:outline-2 has-[[data-card-link]:focus-visible]:outline-offset-4 has-[[data-card-link]:focus-visible]:outline-accent";
const stretched = "outline-none after:absolute after:inset-0 after:content-['']";

function MetaBar({ project, index }: { project: Project; index: number }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 border-b border-line px-5 py-3 font-mono text-xs text-muted sm:px-8">
      <span>
        <span className="text-accent">{String(index + 1).padStart(2, "0")}</span>
        <span className="mx-2">/</span>
        {project.period}
        <span className="mx-2">/</span>
        {project.role}
        {project.status && (
          <span className="ml-3 rounded-[2px] border border-warn px-1.5 py-0.5 text-[11px] leading-none text-warn">
            {project.status}
          </span>
        )}
      </span>
      <span aria-hidden className="transition-colors group-hover:text-accent">
        case study →
      </span>
    </div>
  );
}

function Step({ n, label, children }: { n: string; label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="font-mono text-[11px] tracking-[0.08em] text-muted uppercase">
        <span className="text-accent">{n}</span> {label}
      </p>
      <div className="mt-2 text-[15px] leading-relaxed">{children}</div>
    </div>
  );
}

function Footer({ project, wide = false }: { project: Project; wide?: boolean }) {
  return (
    <div
      className={`mt-auto grid gap-5 border-t border-line px-5 py-6 sm:px-8 ${
        wide ? "lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)_auto] lg:items-start lg:gap-10" : ""
      }`}
    >
      <ArchStrip owned={project.layers} />
      <p className="text-[15px] leading-relaxed">
        <span className="mr-2 font-mono text-xs text-accent">why:</span>
        {project.why}
      </p>
      <div className="relative z-10 flex gap-5">
        {project.links.live && <ExternalLink href={project.links.live}>live</ExternalLink>}
        {project.links.github && <ExternalLink href={project.links.github}>github</ExternalLink>}
        {!project.links.live && !project.links.github && (
          <span className="font-mono text-xs text-muted">private repo</span>
        )}
      </div>
    </div>
  );
}

function SecondaryMetrics({ metrics, size }: { metrics: Project["metrics"]; size: "lg" | "md" }) {
  return (
    <ul className="space-y-6">
      {metrics.map((m) => (
        <li key={m.label}>
          <MetricValue metric={m} size={size} />
        </li>
      ))}
    </ul>
  );
}

function Title({ project, large }: { project: Project; large?: boolean }) {
  return (
    <h4
      id={`p-${project.slug}`}
      className={
        large
          ? "font-display text-3xl font-bold tracking-[-0.03em] sm:text-[2.75rem] sm:leading-[1.05]"
          : "font-display text-2xl font-bold tracking-[-0.025em] sm:text-3xl"
      }
    >
      <Link href={`/projects/${project.slug}`} data-card-link className={stretched}>
        {project.title}
      </Link>
    </h4>
  );
}

/**
 * The lead project. With media, the right column shows it; without, the
 * remaining result numbers take that column so nothing is a placeholder.
 */
export function FeaturedProjectCard({ project, index }: { project: Project; index: number }) {
  const [primary, ...secondary] = project.metrics;
  const hasMedia = !!project.media;

  return (
    <article className={card} aria-labelledby={`p-${project.slug}`}>
      <MetaBar project={project} index={index} />

      <div className="grid gap-10 px-5 py-8 sm:px-8 sm:py-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-7">
          <Title project={project} large />
          <p className="mt-3 text-muted">{project.summary}</p>
          {primary && (
            <div className="mt-10">
              <MetricValue metric={primary} size="xl" />
            </div>
          )}
        </div>
        <div className="lg:col-span-5 lg:self-end">
          {hasMedia ? (
            <ProjectMedia media={project.media} title={project.title} />
          ) : (
            secondary.length > 0 && <SecondaryMetrics metrics={secondary} size="lg" />
          )}
        </div>
      </div>

      <div className={`grid gap-8 px-5 pb-8 sm:px-8 ${hasMedia && secondary.length > 0 ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
        <Step n="01" label="Problem">
          {project.problem}
        </Step>
        <Step n="02" label="Approach">
          {project.approach}
        </Step>
        {hasMedia && secondary.length > 0 && (
          <Step n="03" label="Result">
            <SecondaryMetrics metrics={secondary} size="md" />
          </Step>
        )}
      </div>

      {project.components && <ComponentStrip components={project.components} />}

      <Footer project={project} wide />
    </article>
  );
}

/** Parts of a multi-repo system, one line each; the case study carries the full story. */
function ComponentStrip({ components }: { components: NonNullable<Project["components"]> }) {
  return (
    <div className="border-t border-line px-5 py-6 sm:px-8">
      <p className="font-mono text-[11px] tracking-[0.08em] text-muted uppercase">
        <span className="text-accent">03</span> Components · {components.length}
      </p>
      <ul className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {components.map((c) => (
          <li key={c.name} className="min-w-0">
            <p className="font-mono text-[13px] text-fg">{c.name}</p>
            <p className="mt-1 text-[13px] text-muted">{c.kind}</p>
            <p className="mt-2 text-[14px] leading-relaxed">{c.summary}</p>
            <p className="mt-2 font-mono text-[11px] text-accent">{c.share}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Full-width row: title and headline number on the left, media (when there is any) on the right. */
export function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [primary] = project.metrics;
  const hasMedia = !!project.media;

  return (
    <article className={card} aria-labelledby={`p-${project.slug}`}>
      <MetaBar project={project} index={index} />

      <div className="grid gap-8 px-5 py-8 sm:px-8 lg:grid-cols-12 lg:gap-12">
        <div className={hasMedia ? "lg:col-span-7" : "lg:col-span-12"}>
          <Title project={project} />
          <p className="mt-2 text-muted">{project.summary}</p>
          {primary && (
            <div className="mt-8">
              <MetricValue metric={primary} size="lg" />
            </div>
          )}
        </div>
        {hasMedia && (
          <div className="lg:col-span-5">
            <ProjectMedia media={project.media} title={project.title} />
          </div>
        )}
      </div>

      {/* Full width below the media too, so the text never squeezes into a narrow column beside it. */}
      <div className="grid gap-6 px-5 pb-8 sm:px-8 md:grid-cols-2">
        <Step n="01" label="Problem">
          {project.problem}
        </Step>
        <Step n="02" label="Approach">
          {project.approach}
        </Step>
      </div>

      <Footer project={project} wide />
    </article>
  );
}
