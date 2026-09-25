import { credentials } from "@/content/credentials";
import { experience } from "@/content/experience";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const LEVEL_STYLE: Record<string, string> = {
  INFO: "text-accent",
  AWARD: "text-warn",
  CERT: "text-accent",
  EDU: "text-fg",
};

const CREDENTIAL_PANELS = [
  { kind: "AWARD", file: "awards.log" },
  { kind: "CERT", file: "certs.log" },
  { kind: "EDU", file: "training.log" },
] as const;

interface LogRow {
  key: string;
  date: string;
  level: string;
  message: React.ReactNode;
  details?: string[];
  url?: string;
}

function LogPanel({ id, file, rows }: { id: string; file: string; rows: LogRow[] }) {
  const headingId = `${id}-file`;
  const row = "flex flex-wrap items-baseline gap-x-4 gap-y-1 px-4 py-3 sm:flex-nowrap sm:px-6";

  return (
    <div id={id} className="overflow-hidden rounded-md border border-line bg-surface">
      <h3 id={headingId} className="border-b border-line px-4 py-3 font-mono text-xs sm:px-6">
        <span className="text-muted">tail -f </span>
        <span className="text-accent">{file}</span>
      </h3>
      <ol aria-labelledby={headingId} className="font-mono text-[13px] leading-relaxed">
        {rows.map((r) => {
          const line = (
            <>
              <span className="shrink-0 text-muted">[{r.date}]</span>
              <span className={`w-[3.25rem] shrink-0 ${LEVEL_STYLE[r.level] ?? "text-muted"}`}>{r.level}</span>
              <span className="min-w-0 flex-1 max-sm:order-last max-sm:basis-full">{r.message}</span>
            </>
          );
          const expandable = (r.details?.length ?? 0) > 0 || !!r.url;

          return (
            <li key={r.key} className="border-b border-line last:border-b-0">
              {expandable ? (
                <details className="group">
                  <summary
                    className={`${row} cursor-pointer list-none transition-colors hover:bg-accent-soft [&::-webkit-details-marker]:hidden`}
                  >
                    {line}
                    <span aria-hidden className="ml-auto shrink-0 text-muted group-open:hidden">
                      [+]
                    </span>
                    <span aria-hidden className="ml-auto hidden shrink-0 text-muted group-open:inline">
                      [−]
                    </span>
                  </summary>
                  <ul className="space-y-1 px-4 pb-4 sm:px-6">
                    {r.details?.map((d, i) => (
                      <li key={d} className="flex gap-3 pl-[6.75rem] text-muted max-sm:pl-0">
                        <span aria-hidden className="shrink-0 whitespace-nowrap">{i === r.details!.length - 1 && !r.url ? "└─" : "├─"}</span>
                        <span className="font-sans text-[14px] text-fg">{d}</span>
                      </li>
                    ))}
                    {r.url && (
                      <li className="flex gap-3 pl-[6.75rem] text-muted max-sm:pl-0">
                        <span aria-hidden className="shrink-0 whitespace-nowrap">└─</span>
                        <ExternalLink href={r.url}>verify</ExternalLink>
                      </li>
                    )}
                  </ul>
                </details>
              ) : (
                <div className={row}>{line}</div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/** Logs: career and credentials as log files. Rows with details expand in place. */
export function Experience() {
  const careerRows: LogRow[] = experience.map((e) => ({
    key: `${e.date}-${e.message}`,
    date: e.date,
    level: e.level,
    message: e.message,
    details: e.highlights,
  }));

  const panels = CREDENTIAL_PANELS.map(({ kind, file }) => ({
    file,
    rows: credentials
      .filter((c) => c.kind === kind)
      .map<LogRow>((c) => ({
        key: `${c.date}-${c.title}`,
        date: c.date,
        level: c.kind,
        message: (
          <>
            {c.title}
            {c.issuer && <span className="text-muted"> · {c.issuer}</span>}
          </>
        ),
        details: [...(c.period ? [`기간 ${c.period}`] : []), ...(c.details ?? [])],
        url: c.url,
      })),
  })).filter((p) => p.rows.length > 0);

  return (
    <section id="experience" aria-labelledby="experience-title" className="py-24 sm:py-32">
      <Reveal>
        <SectionHeading
          id="experience-title"
          route="Logs"
          node="access.log"
          title={panels.length > 0 ? "경력 · 수상 · 자격 · 교육" : "경력"}
        />
      </Reveal>
      <div className="grid gap-6">
        <Reveal>
          <LogPanel id="career" file="career.log" rows={careerRows} />
        </Reveal>
        {panels.length > 0 && (
          <div id="credentials" className="grid gap-6">
            {panels.map((p) => (
              <Reveal key={p.file}>
                <LogPanel id={p.file.replace(".log", "")} file={p.file} rows={p.rows} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
