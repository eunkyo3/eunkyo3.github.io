import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, projects } from "@/content/projects";
import { ArchStrip } from "@/components/projects/ArchStrip";
import { MetricValue } from "@/components/projects/MetricValue";
import { ProjectMedia } from "@/components/projects/ProjectMedia";
import { SiteHeader } from "@/components/SiteHeader";
import { ExternalLink } from "@/components/ui/ExternalLink";

export const dynamicParams = false;

const ORG_LABEL = { company: "회사 · 애니셀", personal: "개인 프로젝트" } as const;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/projects/${slug}/` },
    openGraph: { title: project.title, description: project.summary, url: `/projects/${slug}/`, images: ["/og.png"] },
  };
}

function Block({ label, title, children }: { label: string; title: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-4 border-t border-line py-12 lg:grid-cols-12 lg:gap-8">
      <div className="lg:col-span-4">
        <p className="font-mono text-[11px] tracking-[0.08em] text-accent uppercase">{label}</p>
        <h2 className="mt-2 font-display text-2xl font-bold tracking-[-0.025em]">{title}</h2>
      </div>
      <div className="lg:col-span-8">{children}</div>
    </section>
  );
}

export default async function CaseStudyPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const index = projects.indexOf(project);
  const next = projects[(index + 1) % projects.length];
  const cs = project.caseStudy;

  const blocks: { label: string; title: string; body: React.ReactNode }[] = [];
  if (cs) blocks.push({ label: "Context", title: "배경", body: <p>{cs.context}</p> });
  blocks.push({ label: "Problem", title: "문제", body: <p>{project.problem}</p> });
  blocks.push({
    label: "Approach",
    title: "접근",
    body: (
      <>
        <p>{project.approach}</p>
        <div className="mt-8">
          <ArchStrip owned={project.layers} />
        </div>
      </>
    ),
  });
  if (project.components?.length) {
    blocks.push({
      label: "Components",
      title: "구성 요소",
      body: (
        <ul className="space-y-10">
          {project.components.map((c) => (
            <li key={c.name}>
              <h3 className="font-mono text-[15px] text-fg">{c.name}</h3>
              <p className="mt-1 font-mono text-[12px] text-muted">
                {c.kind} <span className="text-accent">· {c.share}</span>
              </p>
              <p className="mt-3">{c.summary}</p>
              <ul className="mt-3 space-y-1.5 text-[15px] text-muted">
                {c.points.map((pt) => (
                  <li key={pt} className="flex gap-3">
                    <span aria-hidden className="shrink-0 font-mono text-line-strong">
                      ─
                    </span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      ),
    });
  }
  if (cs && cs.decisions.length > 0) {
    blocks.push({
      label: "Decisions",
      title: "설계 결정",
      body: (
        <ul className="space-y-8">
          {cs.decisions.map((d) => (
            <li key={d.title}>
              <h3 className="font-semibold">{d.title}</h3>
              <p className="mt-2 font-mono text-[13px]">
                <span className="text-accent">chose</span> {d.chosen}
                {d.alternatives.length > 0 && (
                  <>
                    <span className="mx-2 text-muted">over</span>
                    <span className="text-muted">{d.alternatives.join(", ")}</span>
                  </>
                )}
              </p>
              <p className="mt-2 text-muted">{d.reason}</p>
            </li>
          ))}
        </ul>
      ),
    });
  }
  if (cs?.incidents?.length) {
    blocks.push({
      label: "Troubleshooting",
      title: "문제 해결",
      body: (
        <ul className="space-y-10">
          {cs.incidents.map((inc) => (
            <li key={inc.title}>
              <h3 className="font-semibold">{inc.title}</h3>
              <dl className="mt-3 grid gap-x-4 gap-y-2 text-[15px] sm:grid-cols-[4.5rem_minmax(0,1fr)]">
                {(
                  [
                    ["symptom", inc.symptom],
                    ["cause", inc.cause],
                    ["fix", inc.fix],
                    ["result", inc.result],
                  ] as const
                )
                  .filter(([, v]) => v)
                  .map(([k, v]) => (
                    <div key={k} className="contents">
                      <dt className={`pt-0.5 font-mono text-[12px] ${k === "result" ? "text-accent" : "text-muted"}`}>{k}</dt>
                      <dd className={k === "result" ? "" : "text-muted"}>{v}</dd>
                    </div>
                  ))}
              </dl>
            </li>
          ))}
        </ul>
      ),
    });
  }
  blocks.push({ label: "Why", title: "기술 선택 이유", body: <p>{project.why}</p> });
  if (cs) blocks.push({ label: "Retro", title: "회고", body: <p>{cs.retrospective}</p> });

  return (
    <>
      <SiteHeader />
      <main id="main" className="mx-auto max-w-[1080px] px-4 pb-24 sm:px-6">
        <nav aria-label="이동 경로" className="pt-10">
          <Link href="/#projects" className="font-mono text-[13px] text-muted transition-colors hover:text-fg">
            ← GET /#projects
          </Link>
        </nav>

        <header className="pt-10 pb-12">
          <p className="font-mono text-xs tracking-[0.08em] text-accent uppercase">
            Case study<span className="text-muted"> · {String(index + 1).padStart(2, "0")}</span>
          </p>
          <h1 className="mt-4 font-display text-[clamp(2.5rem,7vw,4.5rem)] leading-[1] font-bold tracking-[-0.04em]">
            {project.title}
          </h1>
          <p className="mt-5 max-w-2xl text-xl text-muted">{project.summary}</p>

          <dl className="mt-10 grid grid-cols-2 gap-6 font-mono text-[13px] sm:grid-cols-4">
            <div>
              <dt className="text-muted">org</dt>
              <dd className="mt-1">{ORG_LABEL[project.org]}</dd>
            </div>
            {project.status && (
              <div>
                <dt className="text-muted">status</dt>
                <dd className="mt-1 text-warn">{project.status}</dd>
              </div>
            )}
            {project.client && (
              <div className="col-span-2">
                <dt className="text-muted">client</dt>
                <dd className="mt-1">{project.client}</dd>
              </div>
            )}
            <div>
              <dt className="text-muted">period</dt>
              <dd className="mt-1">{project.period}</dd>
            </div>
            <div>
              <dt className="text-muted">role</dt>
              <dd className="mt-1">{project.role}</dd>
            </div>
            <div className="col-span-2">
              <dt className="text-muted">stack</dt>
              <dd className="mt-1">{project.stack.join(" · ")}</dd>
            </div>
          </dl>

          <div className="mt-8 flex gap-5">
            {project.links.live && <ExternalLink href={project.links.live}>live</ExternalLink>}
            {project.links.github && <ExternalLink href={project.links.github}>github</ExternalLink>}
            {!project.links.live && !project.links.github && (
              <span className="font-mono text-xs text-muted">private repo · 코드 비공개</span>
            )}
          </div>
        </header>

        {project.media && <ProjectMedia media={project.media} title={project.title} />}

        <div className="mt-12 grid gap-8 sm:grid-cols-2">
          {project.metrics.map((m) => (
            <MetricValue key={m.label} metric={m} size="lg" />
          ))}
        </div>

        <div className="mt-16">
          {blocks.map((b, i) => (
            <Block key={b.label} label={`${String(i).padStart(2, "0")} ${b.label}`} title={b.title}>
              {b.body}
            </Block>
          ))}
        </div>

        {next !== project && (
          <nav aria-label="다음 프로젝트" className="border-t border-line pt-10">
            <Link href={`/projects/${next.slug}`} className="group block">
              <span className="font-mono text-xs text-muted">next →</span>
              <span className="mt-2 block font-display text-3xl font-bold tracking-[-0.03em] transition-colors group-hover:text-accent">
                {next.title}
              </span>
            </Link>
          </nav>
        )}
      </main>
    </>
  );
}
