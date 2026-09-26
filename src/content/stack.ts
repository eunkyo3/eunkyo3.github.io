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
      { name: "Thymeleaf · Vanilla JS", usedIn: "MGS 운영 대시보드, TA0q 업무 화면 51개와 자체 CSS 디자인 시스템" },
      { name: "mqtt.js", usedIn: "MGS 대시보드 — 브라우저에서 브로커 직접 구독 + REST catch-up" },
      { name: "Canvas · three.js", usedIn: "UWB 대시보드 — 실시간 2D·3D 위치 지도, 히트맵" },
      { name: "TanStack Query", usedIn: "Royale — 프록시 API 캐싱·재요청 관리" },
      { name: "Zustand", usedIn: "On-Quest — 인증·퀘스트·토스트 전역 상태" },
      { name: "Tailwind CSS", usedIn: "NutriRank, 이 사이트의 디자인 토큰" },
    ],
  },
  {
    id: "backend",
    table: "backend",
    items: [
      { name: "Spring Boot", usedIn: "MGS 수집 서버(4.0)·운영 대시보드, TA0q(2.7 · eGovFrame · Spring Security), MediScan 공공데이터 동기화 API" },
      { name: "MQTT", usedIn: "MGS — 내장 HiveMQ 브로커, Paho 발행, 게이트웨이 aiomqtt(TLS)" },
      { name: "Python", usedIn: "MGS 엣지 게이트웨이(asyncio), 데이터 파이프라인, 센서·NPU 측정 도구" },
      { name: "FastAPI", usedIn: "Royale — 공식 API 프록시, 점수 엔진, 추천 API" },
      { name: "NestJS", usedIn: "On-Quest — JWT 인증, 역할 가드, 마감 알림 Cron" },
      { name: "Node.js", usedIn: "UWB 대시보드 — http + ws 서버, 1초 배치 insert" },
      { name: "MyBatis", usedIn: "TA0q, MGS 운영 대시보드 쿼리 매핑" },
      { name: "Express · Socket.io", usedIn: "정처기 기출 앱 — 실시간 대전 방·타이머" },
      { name: "APScheduler", usedIn: "Royale — 2시간 주기 배틀 수집 워커" },
    ],
  },
  {
    id: "database",
    table: "database",
    items: [
      {
        name: "PostgreSQL",
        usedIn: "MGS 이벤트 저장·DB 집계, TA0q advisory lock·부분 유니크 인덱스, Royale 스냅샷 swap",
      },
      { name: "TimescaleDB", usedIn: "UWB — 하이퍼테이블, 1분 연속 집계로 장기 리플레이 99.7초 → 0.06초" },
      { name: "Flyway", usedIn: "TA0q V1~V15 멱등 마이그레이션, MGS 스키마 드리프트 복구" },
      { name: "Redis", usedIn: "TA0q 로그인 세션 마커 — 강제 로그아웃·권한 회수 즉시 반영" },
      { name: "SQLite", usedIn: "NutriRank 7만 건 사전계산 DB(WAL), FTS5 trigram 검색" },
      { name: "Drizzle · Prisma · SQLAlchemy", usedIn: "NutriRank, On-Quest, Royale 스키마·마이그레이션" },
      { name: "DuckDB", usedIn: "지하철 좌석 추천 — 혼잡도 ETL·집계" },
    ],
  },
  {
    id: "infra",
    table: "devops_infra",
    items: [
      { name: "Docker Compose", usedIn: "TA0q, UWB, Royale 5개 서비스, On-Quest" },
      { name: "Jenkins · SonarQube", usedIn: "TA0q 배포 전 자동 DB 백업 파이프라인, MGS 정적 분석 스테이지" },
      { name: "k6 · Prometheus · Grafana", usedIn: "MGS 부하테스트 — 500대 50시간, 클라이언트·서버 지표 상관 분석" },
      { name: "Nginx", usedIn: "TA0q TLS 종단, Royale·On-Quest SPA 서빙 + /api 리버스 프록시" },
      { name: "GitHub Actions", usedIn: "On-Quest CI(typecheck·test·build), 이 사이트 배포" },
      { name: "GitHub Releases", usedIn: "NutriRank·Royale 데이터 스냅샷 배포" },
      { name: "n8n", usedIn: "On-Quest Slack 알림, UWB Rocket.Chat 경보 중계" },
      { name: "pytest · JUnit5 · Vitest", usedIn: "게이트웨이 136건, TA0q 376건, NutriRank 단위 테스트" },
      { name: "ARM64 보드 · RK3588", usedIn: "NanoPi 엣지 게이트웨이(systemd), YOLOv8 NPU 추론 측정" },
    ],
  },
];
