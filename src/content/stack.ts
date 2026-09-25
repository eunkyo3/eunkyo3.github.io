import type { StackGroup } from "./types";

// Only what shows up in shipped code. Each line says where it was used.
export const stack: StackGroup[] = [
  {
    id: "frontend",
    table: "frontend",
    items: [
      { name: "TypeScript", usedIn: "NutriRank(strict), On-Quest, 이 사이트 — 프론트·백엔드 공통" },
      { name: "React", usedIn: "Royale Deck Advisor 덱 채점 SPA, On-Quest 관리 화면" },
      { name: "Next.js", usedIn: "NutriRank App Router 풀스택, 이 포트폴리오(정적 export)" },
      { name: "TanStack Query", usedIn: "Royale — 프록시 API 캐싱·재요청 관리" },
      { name: "Zustand", usedIn: "On-Quest — 인증·퀘스트·토스트 전역 상태" },
      { name: "Tailwind CSS", usedIn: "NutriRank, 이 사이트의 디자인 토큰" },
      { name: "Recharts", usedIn: "NutriRank 카테고리 비교·당류 산점도" },
    ],
  },
  {
    id: "backend",
    table: "backend",
    items: [
      { name: "FastAPI", usedIn: "Royale — 공식 API 프록시, 점수 엔진, 추천 API" },
      { name: "NestJS", usedIn: "On-Quest — JWT 인증, 역할 가드, 마감 알림 Cron" },
      { name: "Spring Boot", usedIn: "MediScan — 공공데이터 동기화 REST API" },
      { name: "Express · Socket.io", usedIn: "정처기 기출 앱 — 실시간 대전 방·타이머" },
      { name: "APScheduler", usedIn: "Royale — 2시간 주기 배틀 수집 워커" },
      { name: "Python", usedIn: "데이터 파이프라인, RK3588 NPU 측정 하네스" },
    ],
  },
  {
    id: "database",
    table: "database",
    items: [
      { name: "PostgreSQL", usedIn: "Royale 월별 파티션·스냅샷 swap, On-Quest 증빙 BLOB·부분 유니크 인덱스" },
      { name: "SQLite", usedIn: "NutriRank 7만 건 사전계산 DB(WAL), FTS5 trigram 검색" },
      { name: "Drizzle ORM", usedIn: "NutriRank 스키마·마이그레이션" },
      { name: "Prisma", usedIn: "On-Quest 누적 마이그레이션" },
      { name: "SQLAlchemy · Alembic", usedIn: "Royale 스키마 리비전 관리" },
      { name: "DuckDB", usedIn: "지하철 좌석 추천 — 혼잡도 ETL·집계" },
    ],
  },
  {
    id: "infra",
    table: "devops_infra",
    items: [
      { name: "Docker Compose", usedIn: "Royale 5개 서비스(postgres·migrate·backend·worker·frontend), On-Quest" },
      { name: "Nginx", usedIn: "SPA 서빙 + /api 리버스 프록시" },
      { name: "GitHub Actions", usedIn: "On-Quest CI(typecheck·test·build), 이 사이트 배포" },
      { name: "GitHub Releases", usedIn: "NutriRank·Royale 데이터 스냅샷 배포" },
      { name: "n8n", usedIn: "On-Quest 웹훅 → Slack 알림 흐름" },
      { name: "pytest · Vitest · Playwright", usedIn: "단위·e2e 테스트 (Royale, NutriRank)" },
      { name: "RKNN · RK3588", usedIn: "YOLOv8 INT8 양자화와 NPU 추론 측정" },
    ],
  },
];
