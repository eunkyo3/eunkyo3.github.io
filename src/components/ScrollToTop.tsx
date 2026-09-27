"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * Next keeps the scroll position when the new page is still "visible" at the old
 * offset, which every long page here is, so a case study opened from mid-page
 * started mid-page. Every route is a full page, so start new ones at the top.
 * Back/forward keeps the browser's restored position, and #hash links keep
 * their own target.
 */
export function ScrollToTop() {
  const pathname = usePathname();
  const first = useRef(true);
  const fromHistory = useRef(false);

  useEffect(() => {
    const onPop = () => {
      fromHistory.current = true;
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (fromHistory.current) {
      fromHistory.current = false;
      return;
    }
    if (window.location.hash) return;
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}
