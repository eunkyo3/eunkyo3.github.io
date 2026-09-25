"use client";

import { m } from "motion/react";
import { elapsedAt, hops } from "@/lib/lifecycle";
import { useActiveHop } from "./LifecycleProvider";

const ROW = 64; // px between nodes
const BRANCH_X = 22; // px the side-effect branch sits off the main line
const EASE = [0.22, 1, 0.36, 1] as const;

/** Desktop: vertical rail. The packet (accent square) travels node to node. */
export function RequestRail() {
  const active = useActiveHop();

  return (
    <nav aria-label="요청 경로 · 섹션 이동" className="sticky top-14 hidden h-[calc(100dvh-3.5rem)] items-center lg:flex">
      <div className="relative">
        <span aria-hidden className="absolute top-[5px] left-[5px] w-px bg-line" style={{ height: ROW * (hops.length - 1) }} />
        <m.span
          aria-hidden
          className="absolute top-[2px] left-[2px] z-10 size-[7px] bg-accent"
          initial={false}
          animate={{ y: active * ROW, x: hops[active].branch ? BRANCH_X : 0 }}
          transition={{ duration: 0.4, ease: EASE }}
        />
        <ol>
          {hops.map((hop, i) => {
            const isActive = i === active;
            const visited = i <= active;
            return (
              <li key={hop.id} className="relative" style={{ height: ROW }}>
                {hop.branch && (
                  <span aria-hidden className="absolute top-[5px] left-[6px] border-t border-dashed border-line-strong" style={{ width: BRANCH_X - 1 }} />
                )}
                <a
                  href={`#${hop.section}`}
                  aria-current={isActive ? "step" : undefined}
                  className="group flex items-start gap-3 font-mono text-[11px] leading-none"
                  style={{ paddingLeft: hop.branch ? BRANCH_X : 0 }}
                >
                  <span
                    aria-hidden
                    className={`relative size-[11px] shrink-0 border bg-bg transition-colors duration-300 ${
                      visited ? "border-accent" : "border-line-strong"
                    } ${hop.branch ? "border-dashed" : ""}`}
                  />
                  <span className="flex flex-col gap-1.5">
                    <span
                      className={`tracking-[0.08em] uppercase transition-colors duration-300 group-hover:text-fg ${
                        isActive ? "text-accent" : visited ? "text-fg" : "text-muted"
                      }`}
                    >
                      {hop.node}
                    </span>
                    <span className="text-muted">
                      {hop.detail}
                      {visited && i > 0 && <span className="ml-2 tabular-nums">+{hop.ms}ms</span>}
                    </span>
                  </span>
                </a>
              </li>
            );
          })}
        </ol>
        <p className="mt-2 font-mono text-[11px] text-muted tabular-nums" aria-live="off">
          t = {elapsedAt(active)}ms
        </p>
      </div>
    </nav>
  );
}

/** Mobile: the current hop label plus a 2px progress bar under the header. */
export function RequestProgress() {
  const active = useActiveHop();
  const hop = hops[active];

  return (
    <>
      <p className="font-mono text-[11px] tracking-[0.08em] uppercase lg:hidden" aria-hidden>
        <span className="text-muted">→ </span>
        <span className="text-accent">{hop.node}</span>
        <span className="ml-2 text-muted normal-case tracking-normal">{elapsedAt(active)}ms</span>
      </p>
      <span aria-hidden className="absolute inset-x-0 bottom-[-1px] h-[2px] lg:hidden">
        <m.span
          className="block h-full origin-left bg-accent"
          initial={false}
          animate={{ scaleX: (active + 1) / hops.length }}
          transition={{ duration: 0.4, ease: EASE }}
        />
      </span>
    </>
  );
}
