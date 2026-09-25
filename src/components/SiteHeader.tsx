import Link from "next/link";
import { profile } from "@/content/profile";
import { RequestProgress } from "./lifecycle/RequestRail";
import { PaletteButton } from "./CommandPalette";
import { ThemeToggle } from "./ThemeToggle";

export function SiteHeader({ showProgress = false }: { showProgress?: boolean }) {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/95">
      <div className="relative mx-auto flex h-14 max-w-[1280px] items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="font-mono text-[13px] text-muted transition-colors hover:text-fg">
          ~/<span className="text-fg">{profile.handle}</span>
        </Link>
        <div className="flex items-center gap-3">
          {showProgress && <RequestProgress />}
          <PaletteButton />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
