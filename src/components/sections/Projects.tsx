import { projects } from "@/content/projects";
import type { ProjectOrg } from "@/content/types";
import { FeaturedProjectCard, ProjectCard } from "@/components/projects/ProjectCard";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const GROUPS: { org: ProjectOrg; tag: string; title: string }[] = [
  { org: "company", tag: "company", title: "회사 · 애니셀" },
  { org: "personal", tag: "personal", title: "개인 프로젝트" },
];

export function Projects() {
  // Numbering runs across groups in data order, matching the case study pages.
  const groups = GROUPS.map((g) => ({ ...g, items: projects.filter((p) => p.org === g.org) })).filter(
    (g) => g.items.length > 0,
  );

  return (
    <section id="projects" aria-labelledby="projects-title" className="py-24 sm:py-32">
      <Reveal>
        <SectionHeading
          id="projects-title"
          route="Service Layer"
          node="handler()"
          title="프로젝트"
          description="문제에서 시작해 수치로 끝나는 작업들. 카드를 누르면 설계 결정과 문제 해결 과정을 담은 케이스 스터디로 이동합니다."
        />
      </Reveal>

      <div className="grid gap-16">
        {groups.map((group) => {
          const featured = group.items.find((p) => p.featured);
          const headingId = `projects-${group.org}`;
          return (
            <section key={group.org} aria-labelledby={headingId}>
              <h3
                id={headingId}
                className="mb-6 flex items-baseline gap-3 border-b border-line pb-3 font-mono text-xs tracking-[0.08em] uppercase"
              >
                <span className="text-accent">{group.tag}</span>
                <span className="normal-case tracking-normal text-fg">{group.title}</span>
                <span className="ml-auto text-muted">{group.items.length}</span>
              </h3>
              <div className="grid gap-6">
                {group.items.map((project, i) => {
                  const index = projects.indexOf(project);
                  return (
                    <Reveal key={project.slug} delay={project === featured ? 0 : i * 0.06}>
                      {project === featured ? (
                        <FeaturedProjectCard project={project} index={index} />
                      ) : (
                        <ProjectCard project={project} index={index} />
                      )}
                    </Reveal>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </section>
  );
}
