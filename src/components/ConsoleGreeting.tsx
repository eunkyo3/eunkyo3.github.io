"use client";

import { useEffect } from "react";
import { profile } from "@/content/profile";
import { totalMs } from "@/lib/lifecycle";

const ART = String.raw`
   ____ _____ _____    __
  / ___| ____|_   _|  / /   ${profile.name}
 | |  _|  _|   | |   / /    ${profile.role}
 | |_| | |___  | |  / /
  \____|_____| |_| /_/      200 OK · ${totalMs}ms
`;

let greeted = false;

/** Easter egg for whoever opens DevTools. */
export function ConsoleGreeting() {
  useEffect(() => {
    if (greeted) return;
    greeted = true;
    console.log(`%c${ART}`, "color:#7fd99a;font-family:monospace");
    console.log(
      `%c콘솔까지 열어보셨네요 👋\n채용·협업 문의는 ${profile.email} 로 편하게 연락 주세요.\n페이지에서 / 키를 누르면 명령 팔레트가 열립니다.`,
      "font-size:13px;line-height:1.6",
    );
  }, []);
  return null;
}
