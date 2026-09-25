import { stack } from "@/content/stack";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

/** Database: the stack as four small tables — no bars, no stars, just where each was used. */
export function Stack() {
  return (
    <section id="stack" aria-labelledby="stack-title" className="py-24 sm:py-32">
      <Reveal>
        <SectionHeading
          id="stack-title"
          route="Database"
          node="SELECT *"
          title="기술 스택"
          description="숙련도 막대 대신, 실제로 어디에 썼는지를 적었습니다."
        />
      </Reveal>
      <div className="grid gap-6 md:grid-cols-2">
        {stack.map((group, i) => (
          <Reveal key={group.id} delay={i * 0.05}>
            <table className="w-full border-collapse overflow-hidden rounded-md border border-line bg-surface text-left">
              <caption className="border-b border-line px-5 py-3 text-left font-mono text-xs">
                <span className="text-muted">TABLE </span>
                <span className="text-accent">{group.table}</span>
                <span className="text-muted"> ({group.items.length} rows)</span>
              </caption>
              <thead className="sr-only">
                <tr>
                  <th scope="col">기술</th>
                  <th scope="col">사용처</th>
                </tr>
              </thead>
              <tbody>
                {group.items.map((item) => (
                  <tr key={item.name} className="border-b border-line last:border-b-0 align-top">
                    <th scope="row" className="w-[38%] px-5 py-3 font-mono text-[13px] font-medium">
                      {item.name}
                    </th>
                    <td className="py-3 pr-5 text-[14px] leading-relaxed text-muted">{item.usedIn}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
