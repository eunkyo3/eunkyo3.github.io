import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { RequestedPath } from "@/components/ui/RequestedPath";

export const metadata: Metadata = { title: "404 Not Found" };

const routes = [
  { href: "/", label: "홈으로" },
  { href: "/#projects", label: "프로젝트 목록" },
];

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="mx-auto max-w-[1080px] px-4 pt-24 pb-32 sm:px-6 sm:pt-32">
        <p className="font-mono text-xs tracking-[0.08em] text-warn uppercase">
          Response<span className="text-muted"> · 404</span>
        </p>
        <h1 className="mt-4 font-display text-[clamp(3rem,10vw,6rem)] leading-[1] font-bold tracking-[-0.04em]">
          404 Not Found
        </h1>
        <p className="mt-8 font-mono text-[15px]">
          GET <RequestedPath /> <span className="text-warn">404 Not Found</span>
        </p>
        <p className="mt-6 max-w-xl text-lg text-muted">
          요청한 경로를 찾지 못했습니다. 주소가 바뀌었거나 잘못 입력된 것 같습니다.
        </p>

        <ul className="mt-12 grid max-w-md gap-2 font-mono text-[14px]">
          {routes.map((r) => (
            <li key={r.href}>
              <Link
                href={r.href}
                className="group flex items-center gap-4 rounded-[3px] border border-line px-4 py-3 transition-colors hover:border-line-strong"
              >
                <span className="text-accent">→</span>
                <span>GET {r.href}</span>
                <span className="ml-auto text-muted transition-colors group-hover:text-fg">{r.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}
