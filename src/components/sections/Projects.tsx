import { projects } from "@/content/projects";
import { FeaturedProjectCard, ProjectCard } from "@/components/projects/ProjectCard";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Projects() {
  const featured = projects.find((p) => p.featured) ?? projects[0];
  const rest = projects.filter((p) => p !== featured);

  return (
    <section id="projects" aria-labelledby="projects-title" className="py-24 sm:py-32">
      <Reveal>
        <SectionHeading
          id="projects-title"
          route="Service Layer"
          node="handler()"
          title="프로젝트"
          description="문제에서 시작해 수치로 끝나는 작업들. 카드를 누르면 설계 결정까지 담은 케이스 스터디로 이동합니다."
        />
      </Reveal>

      <div className="grid gap-6">
        <Reveal>
          <FeaturedProjectCard project={featured} index={0} />
        </Reveal>
        <div className="grid gap-6">
          {rest.map((project, i) => (
            <Reveal key={project.slug} delay={i * 0.06}>
              <ProjectCard project={project} index={i + 1} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
