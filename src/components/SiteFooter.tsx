import { profile } from "@/content/profile";

export function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-3 py-6 pr-24 pl-4 font-mono text-[12px] text-muted sm:pr-28 sm:pl-6">
        <p>
          © {new Date().getFullYear()} {profile.name}
        </p>
        {/* Keyboard-only hint. The right padding above keeps it clear of the back-to-top button. */}
        <p className="pointer-coarse:hidden">
          <kbd className="rounded-[2px] border border-line px-1.5">/</kbd> 를 눌러 명령 팔레트 열기
        </p>
      </div>
    </footer>
  );
}
