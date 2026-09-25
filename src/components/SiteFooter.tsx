import { profile } from "@/content/profile";

export function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-3 px-4 py-6 font-mono text-[12px] text-muted sm:px-6">
        <p>
          © {new Date().getFullYear()} {profile.name}
        </p>
        <p>
          <kbd className="rounded-[2px] border border-line px-1.5">/</kbd> 를 눌러 명령 팔레트 열기
        </p>
      </div>
    </footer>
  );
}
