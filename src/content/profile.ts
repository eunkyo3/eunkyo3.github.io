import type { Profile } from "./types";

export const profile: Profile = {
  name: "Jung Eunkyo",
  nameLocal: "정은교",
  handle: "eunkyo",
  tagline: "화면에서 DB까지, 끝까지 책임지는 풀스택 개발자",
  role: "풀스택 개발자",
  company: "애니셀(anysell)",
  startedAt: "2024-03",
  about: [
    "배화여자대학교 P-TECH 과정에서 학업과 실무를 병행하며, 2024년 3월부터 애니셀에서 풀스택 개발자로 일하고 있습니다.",
    "요구사항을 동작하는 구조로 옮기는 일, 그중에서도 프로그램 로직을 설계하는 과정을 가장 즐깁니다.",
    "최근에는 AI 기술에 관심이 많아 새로 나온 기술을 자주 찾아보고, 직접 프로젝트에 적용해 봅니다.",
  ],
  competencies: [
    { layer: "UI", title: "데이터를 읽히는 화면으로", detail: "React · Next.js · TypeScript" },
    { layer: "API", title: "도메인 로직과 API 설계", detail: "FastAPI · NestJS · Spring Boot" },
    { layer: "DATA", title: "수집·적재 파이프라인과 배포", detail: "PostgreSQL · SQLite · Docker" },
  ],
  email: "dmsry060209@gmail.com",
  links: [{ label: "GitHub", href: "https://github.com/eunkyo3" }],
  siteUrl: "https://eunkyo3.github.io",
};
