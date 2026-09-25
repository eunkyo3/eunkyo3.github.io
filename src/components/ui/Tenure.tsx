"use client";

import { useSyncExternalStore } from "react";

function format(since: string, now: Date) {
  const [y, m] = since.split("-").map(Number);
  const months = (now.getFullYear() - y) * 12 + (now.getMonth() + 1 - m);
  const years = Math.floor(months / 12);
  const rest = months % 12;
  return `${since} ~ 현재 (${years > 0 ? `${years}년 ` : ""}${rest}개월)`;
}

const noSubscribe = () => () => {};

/**
 * The site is a static export: the build-time value is only the first paint,
 * then the browser re-computes so tenure never goes stale between deploys.
 */
export function Tenure({ since, builtAt }: { since: string; builtAt: string }) {
  const label = useSyncExternalStore(
    noSubscribe,
    () => format(since, new Date()),
    () => format(since, new Date(builtAt)),
  );
  return <span>{label}</span>;
}
