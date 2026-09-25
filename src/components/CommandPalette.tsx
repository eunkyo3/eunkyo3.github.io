"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { credentials } from "@/content/credentials";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";
import { toggleTheme } from "./ThemeToggle";
import { copyText } from "./ui/CopyEmail";

interface Command {
  id: string;
  label: string;
  hint: string;
  run: () => void;
}

export const OPEN_PALETTE_EVENT = "palette:open";

function isTyping(el: EventTarget | null) {
  return el instanceof HTMLElement && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName));
}

/** `/` opens a small command palette. A native <dialog> handles focus trapping and Esc. */
export function CommandPalette() {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [notice, setNotice] = useState("");
  const listId = useId();

  const commands = useMemo<Command[]>(() => {
    const go = (hash: string) => () => router.push(`/${hash}`);
    return [
      { id: "projects", label: "projects", hint: "프로젝트로 이동", run: go("#projects") },
      { id: "about", label: "about", hint: "소개로 이동", run: go("#about") },
      { id: "stack", label: "stack", hint: "기술 스택으로 이동", run: go("#stack") },
      { id: "experience", label: "experience", hint: "경력 로그로 이동", run: go("#experience") },
      ...(credentials.length > 0
        ? [{ id: "credentials", label: "credentials", hint: "수상·자격증·교육으로 이동", run: go("#credentials") }]
        : []),
      { id: "contact", label: "contact", hint: "연락처로 이동", run: go("#contact") },
      { id: "theme", label: "theme", hint: "라이트/다크 전환", run: toggleTheme },
      {
        id: "email",
        label: "email",
        hint: `${profile.email} 복사`,
        run: () => void copyText(profile.email).then((ok) => setNotice(ok ? "이메일을 복사했습니다" : "복사에 실패했습니다")),
      },
      ...profile.links.map((l) => ({
        id: `link-${l.label}`,
        label: l.label.toLowerCase(),
        hint: "새 창으로 열기",
        run: () => window.open(l.href, "_blank", "noopener,noreferrer"),
      })),
      ...projects.map((p) => ({
        id: `p-${p.slug}`,
        label: `open ${p.slug}`,
        hint: p.title,
        run: () => router.push(`/projects/${p.slug}/`),
      })),
      { id: "top", label: "top", hint: "맨 위로", run: go("#top") },
    ];
  }, [router]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((c) => c.label.includes(q) || c.hint.toLowerCase().includes(q));
  }, [commands, query]);

  const open = useCallback(() => {
    setQuery("");
    setActive(0);
    setNotice("");
    dialogRef.current?.showModal();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "/" && !e.metaKey && !e.ctrlKey && !e.altKey && !isTyping(e.target) && !dialogRef.current?.open) {
        e.preventDefault();
        open();
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_PALETTE_EVENT, open);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_PALETTE_EVENT, open);
    };
  }, [open]);

  function execute(cmd: Command | undefined) {
    if (!cmd) return;
    cmd.run();
    if (cmd.id !== "email") dialogRef.current?.close();
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (results.length ? (i + 1) % results.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (results.length ? (i - 1 + results.length) % results.length : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      execute(results[active]);
    }
  }

  const activeId = results[active] ? `${listId}-${results[active].id}` : undefined;

  return (
    <dialog
      ref={dialogRef}
      aria-label="명령 팔레트"
      onClick={(e) => e.target === dialogRef.current && dialogRef.current?.close()}
      className="m-auto mt-[15vh] w-[min(560px,calc(100vw-2rem))] rounded-md border border-line-strong bg-surface p-0 text-fg backdrop:bg-black/60"
    >
      <div className="flex items-center gap-3 border-b border-line px-4">
        <span aria-hidden className="font-mono text-accent">
          /
        </span>
        <input
          autoFocus
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
          }}
          onKeyDown={onKeyDown}
          role="combobox"
          aria-expanded="true"
          aria-controls={listId}
          aria-activedescendant={activeId}
          aria-label="명령 검색"
          placeholder="명령 입력 · projects, contact, theme …"
          className="h-12 w-full bg-transparent font-mono text-[14px] outline-none placeholder:text-muted"
        />
        <kbd className="shrink-0 rounded-[2px] border border-line px-1.5 font-mono text-[11px] text-muted">esc</kbd>
      </div>
      <ul id={listId} role="listbox" aria-label="명령" className="max-h-[50vh] overflow-y-auto py-2">
        {results.length === 0 && (
          <li role="presentation" className="px-4 py-3 font-mono text-[13px] text-muted">
            404 · 일치하는 명령이 없습니다
          </li>
        )}
        {results.map((cmd, i) => (
          <li
            key={cmd.id}
            id={`${listId}-${cmd.id}`}
            role="option"
            aria-selected={i === active}
            onMouseMove={() => setActive(i)}
            onClick={() => execute(cmd)}
            className={`flex cursor-pointer items-baseline justify-between gap-4 px-4 py-2 font-mono text-[13px] ${
              i === active ? "bg-accent-soft text-accent" : ""
            }`}
          >
            <span>{cmd.label}</span>
            <span className="truncate font-sans text-[13px] text-muted">{cmd.hint}</span>
          </li>
        ))}
      </ul>
      <p aria-live="polite" className="border-t border-line px-4 py-2 font-mono text-[11px] text-muted">
        {notice || (results.length === 0 ? "일치하는 명령이 없습니다" : "↑↓ 이동 · enter 실행")}
      </p>
    </dialog>
  );
}

export function PaletteButton() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_PALETTE_EVENT))}
      aria-label="명령 팔레트 열기 (단축키 /)"
      className="grid h-9 min-w-9 place-items-center rounded-[3px] border border-line px-2 font-mono text-[13px] text-muted transition-colors hover:border-line-strong hover:text-fg"
    >
      /
    </button>
  );
}
