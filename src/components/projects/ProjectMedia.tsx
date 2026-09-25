"use client";

import Image from "next/image";
import { useReducedMotion } from "motion/react";
import type { Project } from "@/content/types";

export function ProjectMedia({ media, title }: { media: Project["media"]; title: string }) {
  const reduce = useReducedMotion();
  const frame = "relative aspect-video overflow-hidden rounded-[3px] border border-line bg-bg";

  if (!media) {
    return (
      <div className={`${frame} grid place-items-center border-dashed`}>
        <span className="font-mono text-xs text-muted">[{title} · 데모 영상/GIF]</span>
      </div>
    );
  }

  if (media.type === "video") {
    return (
      <div className={frame}>
        <video
          className="size-full object-cover"
          src={media.src}
          poster={media.poster}
          aria-label={media.alt}
          muted
          loop
          playsInline
          autoPlay={!reduce}
          controls={!!reduce}
          preload="metadata"
        />
      </div>
    );
  }

  return (
    <div className={frame}>
      <Image src={media.src} alt={media.alt} fill sizes="(min-width: 1024px) 480px, 100vw" className="object-cover" />
    </div>
  );
}
