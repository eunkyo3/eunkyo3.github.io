import { profile } from "@/content/profile";
import { totalMs } from "@/lib/lifecycle";
import { CopyEmail } from "@/components/ui/CopyEmail";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { Reveal } from "@/components/ui/Reveal";

/** Response: the request comes back. The journey ends with a way to reply. */
export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="flex min-h-[80dvh] flex-col justify-center py-24 sm:py-32">
      <Reveal>
        <p className="font-mono text-xs tracking-[0.08em] text-accent uppercase">
          Response<span className="text-muted"> · 200 OK</span>
        </p>
        <h2
          id="contact-title"
          className="mt-6 max-w-[14ch] font-display text-[clamp(2.5rem,8vw,5.5rem)] leading-[1.05] font-bold tracking-[-0.035em]"
        >
          함께 만들 것이 있다면, 편하게 연락 주세요.
        </h2>
        <p className="mt-6 max-w-xl text-muted">채용, 협업, 사이드 프로젝트 제안 모두 반갑습니다.</p>

        <div className="mt-10">
          <CopyEmail email={profile.email} />
        </div>
        <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
          {profile.links.map((link) => (
            <li key={link.label}>
              <ExternalLink href={link.href}>{link.label.toLowerCase()}</ExternalLink>
            </li>
          ))}
        </ul>

        <p className="mt-20 border-t border-line pt-6 font-mono text-[12px] text-muted">
          HTTP/1.1 <span className="text-accent">200 OK</span> · content-type: text/human · {totalMs}ms
        </p>
      </Reveal>
    </section>
  );
}
