"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { hops } from "@/lib/lifecycle";

const ActiveHopContext = createContext(0);

export function useActiveHop() {
  return useContext(ActiveHopContext);
}

/**
 * Tracks which section sits in the middle band of the viewport.
 * Observation only — it never touches scroll position.
 */
export function LifecycleProvider({ children }: { children: React.ReactNode }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const present = hops
      .map((hop, index) => ({ index, el: document.getElementById(hop.section) }))
      .filter((s): s is { index: number; el: HTMLElement } => s.el !== null);
    if (present.length === 0) return;

    const indexOf = new Map(present.map((s) => [s.el, s.index]));
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(indexOf.get(entry.target as HTMLElement) ?? 0);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    present.forEach((s) => observer.observe(s.el));

    // A short final section may never reach the middle band.
    const last = present[present.length - 1];
    const onScroll = () => {
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      if (atBottom) setActive(last.index);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return <ActiveHopContext.Provider value={active}>{children}</ActiveHopContext.Provider>;
}
