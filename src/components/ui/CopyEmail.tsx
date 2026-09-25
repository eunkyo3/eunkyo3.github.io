"use client";

import { useState } from "react";

export async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export function CopyEmail({ email }: { email: string }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");

  async function onCopy() {
    setState((await copyText(email)) ? "copied" : "failed");
    setTimeout(() => setState("idle"), 2000);
  }

  return (
    <div className="flex flex-wrap items-stretch gap-3">
      <a
        href={`mailto:${email}`}
        className="inline-flex h-12 min-w-0 items-center rounded-[3px] border border-line-strong px-5 font-mono text-[15px] break-all transition-colors hover:border-fg sm:text-base"
      >
        {email}
      </a>
      <button
        type="button"
        onClick={onCopy}
        className="inline-flex h-12 items-center gap-2 rounded-[3px] bg-accent px-5 font-medium text-accent-ink transition-opacity hover:opacity-90"
      >
        {state === "copied" ? "복사됨 ✓" : state === "failed" ? "복사 실패" : "이메일 복사"}
      </button>
      <span aria-live="polite" className="sr-only">
        {state === "copied" ? "이메일 주소를 복사했습니다" : state === "failed" ? "복사에 실패했습니다" : ""}
      </span>
    </div>
  );
}
