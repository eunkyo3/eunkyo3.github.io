import { profile } from "@/content/profile";
import { totalMs } from "@/lib/lifecycle";
import { ExternalLink } from "@/components/ui/ExternalLink";

function RequestLog() {
  const request = `GET /${profile.handle}`;
  const status = `200 OK · ${totalMs}ms`;
  const chars = { "--chars": request.length } as React.CSSProperties;

  return (
    <p className="mt-6 font-mono text-sm sm:text-base">
      <span className="sr-only">
        {request} {status}
      </span>
      <span aria-hidden>
        <span className="typed text-fg" style={chars}>
          {request}
        </span>{" "}
        <span className="typed-after inline-block" style={chars}>
          <span className="text-accent">200 OK</span>
          <span className="text-muted"> · {totalMs}ms</span>
        </span>
        <span className="caret ml-1 text-accent [animation-iteration-count:8]">▍</span>
      </span>
    </p>
  );
}

export function Hero() {
  const links = [{ label: "email", href: `mailto:${profile.email}` }, ...profile.links];

  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="flex min-h-[calc(100dvh-3.5rem)] flex-col justify-center py-16 lg:py-24"
    >
      <p className="rise font-mono text-xs tracking-[0.08em] text-accent uppercase">
        GET /<span className="text-muted"> · Client</span>
      </p>

      <div className="mt-8 grid gap-14 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-7">
          <h1
            id="hero-title"
            className="rise font-display text-[clamp(3.25rem,12vw,7.5rem)] leading-[0.92] font-bold tracking-[-0.045em]"
            style={{ "--delay": "60ms" } as React.CSSProperties}
          >
            {profile.name}
            {profile.nameLocal && (
              <span className="mt-4 block font-sans text-lg font-medium tracking-normal text-muted">
                {profile.nameLocal}
              </span>
            )}
          </h1>
          <RequestLog />

          <p
            className="rise mt-10 max-w-[20ch] text-[1.625rem] leading-snug font-semibold tracking-[-0.02em] sm:text-3xl"
            style={{ "--delay": "140ms" } as React.CSSProperties}
          >
            {profile.tagline}
          </p>

          <div className="rise mt-10 flex flex-wrap gap-3" style={{ "--delay": "200ms" } as React.CSSProperties}>
            <a
              href="#projects"
              className="inline-flex h-11 items-center gap-2 rounded-[3px] bg-accent px-5 font-medium text-accent-ink transition-opacity hover:opacity-90"
            >
              프로젝트 보기 <span aria-hidden>↓</span>
            </a>
            <a
              href="#contact"
              className="inline-flex h-11 items-center gap-2 rounded-[3px] border border-line-strong px-5 font-medium transition-colors hover:border-fg"
            >
              연락하기
            </a>
          </div>

          <ul className="rise mt-8 flex flex-wrap gap-x-6 gap-y-2" style={{ "--delay": "240ms" } as React.CSSProperties}>
            {links.map((link) => (
              <li key={link.label}>
                <ExternalLink href={link.href}>{link.label.toLowerCase()}</ExternalLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Offset down on desktop: the asymmetry is intentional. */}
        <div className="rise lg:col-span-5 lg:self-end" style={{ "--delay": "300ms" } as React.CSSProperties}>
          <h2 className="font-mono text-[11px] tracking-[0.08em] text-muted uppercase">Capabilities</h2>
          <ol className="mt-4 border-t border-line">
            {profile.competencies.map((c, i) => (
              <li key={c.layer} className="grid grid-cols-[4.5rem_1fr] gap-4 border-b border-line py-4">
                <span className="font-mono text-xs leading-7 text-muted">
                  0{i + 1} <span className="text-accent">{c.layer}</span>
                </span>
                <span>
                  <span className="block font-semibold">{c.title}</span>
                  <span className="block font-mono text-[13px] text-muted">{c.detail}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
