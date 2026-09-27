import { profile } from "@/content/profile";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Tenure } from "@/components/ui/Tenure";

/** Middleware: the request picks up context headers before it reaches the service layer. */
export function About() {
  const headers: [string, React.ReactNode][] = [
    ["x-role", profile.role],
    ["x-company", profile.company],
    ["x-since", <Tenure key="t" since={profile.startedAt} builtAt={new Date().toISOString()} />],
    ["x-education", "배화여자대학교 P-TECH"],
  ];

  return (
    <section id="about" aria-labelledby="about-title" className="py-24 sm:py-32">
      <Reveal>
        <SectionHeading id="about-title" route="Middleware" node="auth · parse" title="일하는 방식" />
      </Reveal>
      <Reveal className="grid gap-12 lg:grid-cols-12 lg:gap-8">
        <dl className="font-mono text-[13px] lg:col-span-5 lg:text-sm">
          {headers.map(([key, value]) => (
            <div key={key} className="grid grid-cols-[7.5rem_1fr] gap-3 border-b border-line py-3 first:border-t">
              <dt className="text-muted">{key}:</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
        <div className="space-y-5 text-lg leading-relaxed sm:text-xl lg:col-span-7">
          {profile.about.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
