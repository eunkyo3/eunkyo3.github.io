import type { Project } from "./types";

// Order matters: the first `featured` project is rendered large at the top.
// Every number below is quoted from the project's own README / ADR / release notes.
export const projects: Project[] = [
  {
    slug: "nutrirank",
    title: "NutriRank",
    summary: "식약처 공개 데이터 7만 건으로 음료·간식의 건강 등급(A~E)과 카테고리 순위를 보여주는 서비스",
    period: "2026.07",
    role: "1인 개발 · 기획부터 배포까지",
    featured: true,
    problem:
      "영양성분표는 읽기 어렵고, 원천 데이터의 기준량 표기(100g/100ml)가 제조사마다 제각각이라 같은 주스인데도 등급이 정반대로 나왔습니다.",
    approach:
      "12단계 적재 파이프라인에서 점수·등급·순위를 미리 계산하고, 품질 게이트를 통과할 때만 원자적으로 교체했습니다. 제품유형 판정 기준을 표기가 아닌 카테고리로 바꿔(ADR-0007) 오판정을 구조적으로 없앴습니다.",
    metrics: [
      { label: "음료 제품유형 오판정", before: "2,376건", after: "0건" },
      { label: "적재·등급 산출 제품", after: "70,013건" },
      { label: "등급 로직 변경 시 재계산", before: "~11.5시간", after: "수 분" },
    ],
    layers: ["frontend", "backend", "database", "infra"],
    stack: ["Next.js 15", "TypeScript", "SQLite", "Drizzle ORM", "Recharts", "Vitest", "Playwright", "Docker"],
    why: "데이터가 월 단위로만 바뀌어, 조회 시 계산 대신 사전계산 + 읽기 전용 SQLite가 가장 단순하고 빠르다고 판단했습니다 (ADR-0004·0005).",
    links: { github: "https://github.com/eunkyo3/NutriRank" },
    caseStudy: {
      context:
        "소비자가 영양성분표를 해석하지 않고도 '어차피 과자를 고른다면 그중 무엇이 나은가'에 답할 수 있게 하는 것이 목표였습니다. 원천은 식약처 「전국통합식품영양성분정보(가공식품) 표준데이터」이고, 등급은 2023 Nutri-Score 알고리즘으로 산출한 2차 가공 결과입니다.",
      decisions: [
        {
          title: "등급은 절대 기준, 순위는 같은 점수 축에서",
          chosen: "절대 등급(A~E) + 카테고리 상대 순위",
          alternatives: ["등급과 순위에 서로 다른 지표 사용"],
          reason:
            "축이 둘이면 '등급이 낮은 제품이 순위는 높은' 모순이 생깁니다. 과자·음료는 D·E가 79.2%로 쏠리는데, 이를 결함이 아닌 전제로 두고 같은 E등급 안의 차이를 순위로 드러냈습니다 (ADR-0003·0006).",
        },
        {
          title: "제품유형은 카테고리가 정한다",
          chosen: "소비자 카테고리 기준 판정",
          alternatives: ["원천 기준량 표기(100g/100ml)에서 역산"],
          reason:
            "표기로 역산하자 주스 19.6%, 커피음료 17.1%가 고형식품으로 오판정되어 '같은 점수에 다른 등급'이 나왔습니다. 인과를 바로잡아 2,376건을 교정했습니다 (ADR-0007).",
        },
        {
          title: "배포는 Docker 단일 이미지 + 볼륨 SQLite",
          chosen: "Docker + better-sqlite3(WAL) + Drizzle",
          alternatives: ["Vercel + 읽기전용 SQLite 에셋", "Turso/libSQL", "Prisma"],
          reason:
            "데이터 갱신마다 재배포가 필요한 서버리스보다, 앱은 읽기·배치는 쓰기로 나눈 단일 이미지가 운영이 단순했습니다. 스냅샷 DB는 GitHub Releases로 배포해 API 키 없이도 재현됩니다.",
        },
      ],
      retrospective:
        "초기 구현이 기준량 표기로 제품유형을 판정해 인과를 뒤집었고, 이를 화면의 순위 모순으로 뒤늦게 발견했습니다. 도메인 정의(CONTEXT.md)를 코드보다 먼저 확정하고, 분포를 점검하는 검증을 파이프라인 초기에 두어야 한다는 것을 배웠습니다.",
    },
  },
  {
    slug: "royale-deck-advisor",
    title: "Royale Deck Advisor",
    summary: "플레이어 태그 하나로 Clash Royale 덱을 구조·레벨·메타 3층으로 채점하고 카드 교체를 추천하는 웹앱",
    period: "2026.09",
    role: "1인 개발 · 풀스택",
    problem:
      "공식 API는 현재 상태만 줄 뿐 메타 통계나 과거 기록을 제공하지 않아, 내 덱이 지금 메타에서 얼마나 좋은지 판단할 근거가 없었습니다.",
    approach:
      "워커가 2시간마다 랭커 배틀을 수집해 집계 스냅샷을 만들고, 요청 시점에는 순수 함수 점수 엔진이 메모리에서만 계산합니다. 덱 상성 예상 승률 모델은 7만여 전으로 백테스트해 기준선을 이긴 모형만 출시했습니다.",
    metrics: [
      { label: "덱 상성 예상 승률 · Brier skill (기준선 대비)", after: "+0.30~0.47" },
      { label: "수집·집계한 공개 배틀", after: "90,945판" },
    ],
    layers: ["frontend", "backend", "database", "infra"],
    stack: ["React", "Vite", "TanStack Query", "FastAPI", "SQLAlchemy", "Alembic", "APScheduler", "PostgreSQL 16", "Docker Compose"],
    why: "요청 경로에서 원본 로그를 스캔하지 않도록 배치 집계와 점수 엔진을 분리하고, rename swap으로 스냅샷을 원자적으로 교체했습니다.",
    links: { github: "https://github.com/eunkyo3/royale-deck-advisor" },
    media: { type: "image", src: "/media/royale-deck.webp", alt: "덱 점수 화면: 종합 점수 88.5와 구조·레벨·메타 층별 점수" },
    caseStudy: {
      context:
        "로그인 없이 태그만으로 쓰는 공개 웹앱입니다. API 키는 서버에만 두고 브라우저는 항상 FastAPI 프록시를 거치며, 서버는 랭커 공개 배틀 외의 개인 데이터를 저장하지 않습니다.",
      decisions: [
        {
          title: "스냅샷을 원자적으로 교체",
          chosen: "스테이징 테이블 + 단일 트랜잭션 rename swap",
          alternatives: ["운영 테이블에 직접 UPSERT"],
          reason: "집계 도중에도 조회 요청이 중간 상태를 보지 않도록 했습니다.",
        },
        {
          title: "예상 승률 모형 선택",
          chosen: "상호작용 모형(E3)",
          alternatives: ["덱 승률 차(E1)", "카드 품질 차(E2)"],
          reason:
            "7만여 전 백테스트에서 E1은 어느 분할에서도 상수 0.5를 이기지 못했습니다. 달력 분할은 수집량 급증으로 학습 표본이 0이 되어 데이터량·플레이어 기준 분할로 검증했고, E3가 세 분할 모두에서 95% 구간이 0 위였습니다.",
        },
        {
          title: "과거 기록을 직접 만든다",
          chosen: "조회 시점 스냅샷을 player_history에 적재",
          alternatives: ["추이 기능 포기"],
          reason: "공식 API가 과거 기록을 주지 않아, 방문할수록 선이 길어지는 방식으로 트로피 추이를 구성했습니다(365일 보관).",
        },
      ],
      retrospective:
        "모형을 먼저 만들고 검증 계획을 따랐는데, 계획한 날짜 분할이 이 데이터에서는 성립하지 않았습니다. 검증 설계 자체를 데이터 분포부터 확인하고 정해야 한다는 것을 배웠습니다.",
    },
  },
  {
    slug: "on-quest",
    title: "On-Quest",
    summary: "신입 사원 온보딩을 퀘스트로 관리하고, n8n을 거쳐 Slack으로 실시간 알림을 보내는 멀티 테넌트 MVP",
    period: "2026.05 – 2026.07",
    role: "1인 개발 · 풀스택",
    problem:
      "온보딩 과제의 배정·증빙·검토가 흩어져 있어 진행 상황이 보이지 않고, 사수가 일일이 확인해야 했습니다.",
    approach:
      "대기→착수→검토→완료/반려의 상태 머신과 3단계 역할(슈퍼관리자·관리자·사원)을 설계하고, 7종 이벤트를 HMAC 서명 웹훅으로 n8n에 넘겨 Slack 알림을 분리했습니다.",
    metrics: [
      { label: "권한 변경 반영 시점", before: "토큰 만료 후", after: "즉시" },
      { label: "Slack 알림 이벤트", after: "7종" },
    ],
    layers: ["frontend", "backend", "database", "infra"],
    stack: ["React", "Vite", "Zustand", "NestJS", "Prisma", "PostgreSQL 16", "n8n", "Nginx", "Docker Compose", "GitHub Actions"],
    why: "알림 채널 로직을 백엔드에서 떼어 n8n으로 옮겨 코드 수정 없이 흐름을 바꿀 수 있게 하고, 웹훅은 HMAC 서명으로 위변조를 막았습니다.",
    links: { github: "https://github.com/eunkyo3/on-quest" },
    caseStudy: {
      context: "회사코드(companyCode) 단위로 사용자와 퀘스트를 격리하는 멀티 테넌트 구조로, Docker Compose 한 번으로 프론트·API·DB·n8n이 함께 뜹니다.",
      decisions: [
        {
          title: "역할을 매 요청마다 DB에서 재검증",
          chosen: "JwtStrategy에서 현재 role 조회",
          alternatives: ["토큰에 담긴 role 신뢰"],
          reason: "승격·강등이 토큰 만료를 기다리지 않고 즉시 적용되고, 삭제된 계정의 토큰도 바로 무효화됩니다.",
        },
        {
          title: "슈퍼관리자 유일성을 DB가 보장",
          chosen: "부분 유니크 인덱스 users(companyCode) WHERE role='superadmin'",
          alternatives: ["애플리케이션 코드에서 검사"],
          reason: "같은 회사코드로 동시에 최초 가입할 때의 경합을 코드가 아닌 제약으로 막았습니다.",
        },
        {
          title: "증빙 공유 링크",
          chosen: "TTL 서명 URL + timingSafeEqual 비교",
          alternatives: ["인증된 다운로드 API만 제공"],
          reason: "Slack에서 바로 열 수 있어야 하면서도, 링크가 유출돼도 만료되도록 했습니다.",
        },
      ],
      retrospective:
        "토큰을 localStorage에 두는 구조라 XSS에 노출되는 점, 공유 URL 자체에는 레이트리밋이 없는 점이 남은 과제입니다. 다음 단계로 httpOnly 쿠키 이전과 공유 링크 throttle을 계획하고 있습니다.",
    },
  },
  {
    slug: "nanopi-yolov8",
    title: "RK3588 NPU · YOLOv8 성능 한계 측정",
    summary: "NanoPi R6C(RK3588) NPU에서 YOLOv8 INT8 추론의 성능 한계를 재현 가능한 수치로 확정한 벤치마크",
    period: "2026.08 – 2026.09",
    role: "1인 · 측정 설계와 도구 개발",
    problem:
      "엣지 장비에서 실시간 객체탐지가 가능한지 판단해야 했지만, 측정할 때마다 수치가 흔들려 결론을 낼 수 없었습니다.",
    approach:
      "PC 변환 파이프라인과 장비 측정 하네스를 분리하고, 캡처·전처리·추론·후처리를 구간별로 따로 쟀습니다. CPU/NPU 클럭을 고정하고 고정되지 않은 측정은 원천 차단했습니다.",
    metrics: [
      { label: "yolov8n @640 · 종단 처리량", after: "32.1 fps" },
      { label: "반복 측정 편차", after: "0.19~0.68%" },
    ],
    layers: ["infra"],
    stack: ["Python", "RKNN-Toolkit2", "ONNX", "ultralytics YOLOv8", "RK3588 NPU", "Ubuntu"],
    why: "NPU가 지원하지 않는 DFL 연산을 airockchip 개조 헤드로 그래프 밖에 빼내고, 후처리는 호스트(NumPy)가 맡게 했습니다.",
    links: { github: "https://github.com/eunkyo3/nano_pi_r6c_yolov8" },
    caseStudy: {
      context: "산출물은 데모가 아니라 성능 한계 리포트이고, 저장소의 코드는 제품 코드가 아니라 계측 도구입니다. 모델은 YOLOv8n/s, 입력 320·480·640 여섯 조합을 측정했습니다.",
      decisions: [
        {
          title: "클럭을 고정하지 않은 측정은 버린다",
          chosen: "governor 고정 + --require-locked",
          alternatives: ["기본 설정 그대로 반복 측정"],
          reason: "클럭 미고정 시 같은 추론이 31ms와 18ms로 갈렸고, 결과 파일에는 흔적이 남지 않았습니다.",
        },
        {
          title: "입력 해상도는 ONNX 단계에서 수정",
          chosen: "reshape_onnx.py로 입력 차원 직접 수정",
          alternatives: ["rknn.load_onnx의 input_size_list 옵션"],
          reason: "해당 옵션은 static shape ONNX에서 오류 없이 무시되어, 빌드가 통과해도 결과물은 640 모델이었습니다.",
        },
      ],
      retrospective:
        "n640 한 프레임 31.11ms 중 NPU는 18.07ms뿐이고 41.9%는 CPU(전처리·후처리)였습니다. 'NPU가 빠른가'보다 '병목이 어디인가'를 먼저 물어야 한다는 것이 가장 큰 수확이었습니다.",
    },
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
