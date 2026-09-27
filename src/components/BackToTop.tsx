"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * Appears once the visitor is a screen deep. On the home page at `lg` and up the
 * request rail already jumps to the top, so the button stays out of the way there.
 */
export function BackToTop() {
  const isHome = usePathname() === "/";
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setVisible(window.scrollY > window.innerHeight);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  const toTop = () => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    // Keyboard users land at the top too, not back on this button.
    const main = document.getElementById("main");
    if (main) {
      if (!main.hasAttribute("tabindex")) main.setAttribute("tabindex", "-1");
      main.focus({ preventScroll: true });
    }
  };

  return (
    <button
      type="button"
      onClick={toTop}
      aria-label="맨 위로"
      className={`fixed right-4 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-30 flex h-10 items-center gap-1.5 rounded-[3px] border border-line bg-surface/95 px-3 font-mono text-xs text-muted shadow-sm transition-[opacity,color,border-color] duration-200 hover:border-line-strong hover:text-fg sm:right-6 sm:bottom-6 ${
        visible ? "opacity-100" : "pointer-events-none invisible opacity-0"
      } ${isHome ? "lg:hidden" : ""}`}
    >
      <span aria-hidden className="text-accent">
        ↑
      </span>
      top
    </button>
  );
}
