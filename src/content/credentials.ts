import type { Credential } from "./types";

// Awards, certifications and training programs, newest first within each kind.
// Each kind renders as its own log panel; an empty kind is simply not shown.
export const credentials: Credential[] = [
  // ─── AWARD ───────────────────────────────────────────────
  {
    date: "2026-01",
    kind: "AWARD",
    title: "사이드임팩트 AI 트랙 — 우수 선정팀",
    issuer: "브라이언 임팩트",
    details: ["SignGPT 기능 개선: UI 개편, 호버 시 수어 출력, 일반인·농인 대화 기능, 미국 수어 지원 추가"],
  },
  {
    date: "2024-12",
    kind: "AWARD",
    title: "디지털새싹 인공지능 메이커톤 — 어벤져스상(최우수상)",
    issuer: "화성시인재육성재단 / 동탄중앙이음터",
    details: ["기존 SignGPT를 Intel OpenVINO로 성능 및 UI 개선"],
  },
  {
    date: "2024-11",
    kind: "AWARD",
    title: "화이트해커 경진대회 — 우수상",
    issuer: "현대오토에버 / 함께일하는재단",
    details: ["CTF 문제 해결로 우수상 수상"],
  },
  {
    date: "2024-08",
    kind: "AWARD",
    title: "AI Youth Challenge — 교육부 장관상",
    issuer: "포스코DX",
    period: "2024.07 ~ 2024.08",
    details: ["기술로 농인의 정보 접근성을 높이고 소통의 장벽을 낮추는 SignGPT 팀 프로젝트"],
    url: "https://www.signgpt.org/",
  },

  // ─── CERT ────────────────────────────────────────────────
  { date: "2024-12", kind: "CERT", title: "SW개발_L3_22V2", issuer: "한국산업인력공단" },
  { date: "2024-07", kind: "CERT", title: "웹디자인개발기능사", issuer: "한국산업인력공단" },
  { date: "2024-06", kind: "CERT", title: "SQL 개발자(SQLD)", issuer: "한국데이터산업진흥원" },
  { date: "2024-03", kind: "CERT", title: "정보처리산업기사", issuer: "한국산업인력공단" },
  { date: "2022-12", kind: "CERT", title: "정보처리기능사", issuer: "한국산업인력공단" },

  // ─── EDU ─────────────────────────────────────────────────
  {
    date: "2024-10",
    kind: "EDU",
    title: "2024 화이트해커 양성교육",
    issuer: "현대오토에버 / 함께일하는재단",
    period: "2024.07 ~ 2024.10",
    details: [
      "애플리케이션 해킹 — 비즈니스 로직 취약점 분석, 공격/방어 원리",
      "네트워크 보안 — Wireshark PCAP 심층 분석, 네트워크 기반 공격 시나리오 실증",
      "웹 취약점 — OWASP Top 10 기반 모의해킹(SQL Injection, XSS 등)과 시큐어 코딩 대책",
      "시스템 해킹·리버싱 — Buffer Overflow 등 메모리 취약점 원리, 디버거로 바이너리 분석",
      "암호학 — 대칭키/비대칭키, 해시 함수 등 암호 알고리즘과 데이터 보호 기법",
    ],
  },
  {
    date: "2024-08",
    kind: "EDU",
    title: "AI 슈퍼컴퓨터 청소년 캠프",
    issuer: "UNIST / KISTI",
    period: "2024.07 ~ 2024.08",
    details: [
      "HPC 환경에서 AI 모델 학습·병렬 처리, 슈퍼컴퓨터 활용",
      "TensorFlow·Keras 이미지 분류와 레이트레이싱 실습으로 대규모 딥러닝 워크로드 경험",
    ],
  },
  {
    date: "2023-10",
    kind: "EDU",
    title: "2023 화이트해커 양성교육",
    issuer: "현대오토에버 / 함께일하는재단",
    period: "2023.07 ~ 2023.10",
    details: [
      "웹 해킹·CTF 실습, Wireshark 네트워크 공격 패킷 분석",
      "파이썬 기반 보안 업무 자동화, ChatGPT를 활용한 정보보안 학습",
      "Docker·Kubernetes, 안드로이드 모바일 해킹, 버그헌팅·시나리오 모의해킹",
    ],
  },
  {
    date: "2022-12",
    kind: "EDU",
    title: "사이버가디언즈",
    issuer: "한국정보기술연구원",
    period: "2022.09 ~ 2022.12",
    details: ["C 언어 기초, 네트워크 구조와 패킷 동작 원리, Git 협업·버전 관리로 보안 분야 기초 확립"],
  },
];
