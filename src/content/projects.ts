import type { Project } from "./types";

// Order matters: company work first, then personal; the first `featured` project of a group is rendered large.
// Personal numbers are quoted from each repo's README / ADR / release notes. Company numbers come from the
// owner's write-up of commit history and reports; anything it marked unverified is left out. Customers are
// anonymised and company repos are private, so those projects carry no links.
export const projects: Project[] = [
  {
    slug: "mgs",
    title: "MGS · 게이트 보안 시스템",
    org: "company",
    summary: "출입 게이트 장비의 이벤트를 엣지 게이트웨이가 받아 수집 서버에 저장하고, 운영 대시보드로 실시간 중계하는 온프레미스 시스템",
    period: "2025.12 – 2026.08",
    role: "4인 팀 사원 · 게이트웨이·서버·대시보드, 부하테스트 단독",
    client: "국내 대기업 A사(반도체) · B사(자동차) 납품 예정 · 2026년 4분기",
    featured: true,
    problem:
      "게이트 장비의 MCU는 UART로만 통신하고, 시스템은 설치·운영 인력이 적은 고객 현장에 온프레미스로 들어갑니다. 장비 이벤트는 유실 없이 저장하면서도, 네트워크가 끊기거나 대시보드가 느려질 때 서로의 경로를 막지 않아야 했습니다.",
    approach:
      "장비 → 엣지 게이트웨이 → 수집 서버 → 운영 대시보드 전 구간을 만들고 납품 전 부하테스트로 검증했습니다. 게이트웨이는 장비에서 읽는 일과 서버로 보내는 일을 분리해 네트워크가 끊겨도 수신이 멈추지 않게 했고, 서버는 저장은 한 건도 잃지 않게, 실시간 알림은 밀리면 건너뛰고 나중에 따라잡게 해 두 경로가 서로를 막지 않도록 설계했습니다.",
    metrics: [
      { label: "장비 500대 · 50시간 연속 부하, 약 2,700만 건 중 전송 실패", after: "0건" },
      { label: "게이트웨이 오프라인 버퍼", before: "약 8분치", after: "약 2.7시간치" },
    ],
    layers: ["frontend", "backend", "database", "infra"],
    stack: [
      "Java 17",
      "Spring Boot 4 · 2.7",
      "HiveMQ CE (내장)",
      "PostgreSQL",
      "Python asyncio",
      "MQTT · TLS / WSS",
      "mqtt.js",
      "k6",
      "Prometheus · Grafana",
      "Jenkins · SonarQube",
    ],
    why: "설치 요소를 줄이려고 MQTT 브로커를 서버에 내장해 프로세스 하나로 납품합니다. 그 대가인 무중단 업그레이드 불가와 단일 JVM 한계는 CHANGELOG에 적고, 한계치는 부하테스트로 측정했습니다.",
    links: {},
    components: [
      {
        name: "gatelink",
        kind: "엣지 게이트웨이 · Python asyncio · ARM64",
        share: "런타임 설계·구현 · 코드의 약 97%",
        summary: "게이트 MCU가 UART로 보내는 입실·퇴실·알람 이벤트를 MQTT 또는 REST로 서버에 중계하고, 서버 명령에 응답합니다.",
        points: [
          "UART 수신과 네트워크 전송의 수명을 분리하고, 전송 세션은 TaskGroup으로 묶어 오류 시 지수 백오프(2→30초)로 재시작",
          "큐 포화 시 UART 읽기가 멈추던 문제를 논블로킹 drop-oldest 큐와 put_front로 해결",
          "UART 스니퍼를 직접 만들어 설치 앱의 과잉 인코딩과 응답 잘림을 찾고, 앱 수정 없이 호환",
          "현장 WiFi 설정(nmcli)은 리스트 인자로만 호출하고 비밀번호는 stdin으로 전달 · 테스트 136개",
        ],
      },
      {
        name: "brokerserver",
        kind: "수집 서버 · Spring Boot 4 + 내장 HiveMQ",
        share: "초기 골격 설계 · 코어 코드의 약 81%",
        summary: "장비 텔레메트리와 이벤트를 MQTT·REST로 받아 PostgreSQL에 저장하고, 대시보드에 조회 API와 실시간 푸시를 제공합니다.",
        points: [
          "커밋 후 ui/events/{deviceCode}로 실시간 발행하고, 빠진 이벤트는 afterId 커서 catch-up API로 보정",
          "저장은 CallerRuns로 유실을 막고, 실시간 발행은 전용 풀 + DiscardPolicy로 격리",
          "통계를 인메모리 전량 집계에서 COUNT FILTER·date_trunc DB 집계로 바꿔 OOM 위험 제거",
          "문서와 달리 꺼져 있던 장비 MQTT 인증을 prod 기본 활성화 + 빈 비밀번호 fail-fast로 바로잡음",
        ],
      },
      {
        name: "dashboard",
        kind: "운영 대시보드 · Spring Boot 2.7 + eGovFrame",
        share: "프론트·백엔드 양쪽 · Java 코드의 약 32%",
        summary: "관제 운영자가 게이트 상태와 이벤트를 실시간으로 보고, 기간별 통계와 CSV 로그를 내보내는 웹입니다.",
        points: [
          "실시간 구조를 서버 SSE 중계에서 브라우저 MQTT 직접 구독 + REST catch-up으로 전환, 레거시 통신 코드 약 3,400줄 제거",
          "세션 만료 뒤 카운터가 0부터 다시 세어지던 문제를 API 401 분기·공통 fetch 래퍼·만료 경고로 해결",
          "로그인 간헐 403을 nginx referer 로그로 CSRF 토큰 만료로 특정하고 쿠키 저장소로 전환",
          "릴리스 전 하드닝: XFF 위조를 통한 IP 화이트리스트 우회, 재연결 시 구독 소실, 라이선스 fail-open 수정 후 GA 승격",
        ],
      },
      {
        name: "load-testing",
        kind: "부하테스트 환경 · k6 + Prometheus + Grafana",
        share: "단독 구축 · 100%",
        summary: "장비 → 서버 → DB → 대시보드 경로의 병목을 재현 가능하게 측정하는 환경입니다.",
        points: [
          "클라이언트 증상(InfluxDB)과 서버 원인(Prometheus)을 Grafana 한 시간축에서 상관 분석",
          "500대 50시간 약 2,700만 건 전송 실패 0건, 대시보드 E2E 발행 12,000건 = 수신 12,000건",
          "점진적으로 늘린 1,000대는 connect p95 213ms로 정상, 반복 동시 재접속 구간은 2.9~13.5초로 무너지는 병목 식별",
          "자체 감사로 측정 결함 16건을 고쳐 가짜 PASS와 가짜 손실을 제거",
        ],
      },
    ],
    caseStudy: {
      context:
        "MGS는 고객 현장에 온프레미스로 설치되는 게이트 보안 시스템입니다. 4개 저장소가 하나의 흐름을 이루고, 팀장 1명과 사원 3명이 나눠 맡았습니다. 저는 게이트웨이·수집 서버·대시보드의 핵심 기능을 개발하고 부하테스트 환경을 혼자 만들었습니다. 라이선스 원본, TLS, 설치 패키지, CI/CD 체계는 팀원이 담당했습니다. 아직 운영 트래픽이 없어, 이 페이지의 성능 수치는 모두 부하테스트 결과입니다.",
      decisions: [
        {
          title: "MQTT 브로커를 애플리케이션에 내장",
          chosen: "HiveMQ CE를 Spring 빈으로 내장",
          alternatives: ["외부 브로커(Mosquitto/EMQX) 별도 설치", "MQTT 없이 REST만 사용"],
          reason:
            "설치·운영 인력이 적은 현장이라 구성 요소를 줄여야 했습니다. 프로세스 하나로 납품하고, 인증·인가 extension과 publish 인터셉터를 같은 코드베이스에서 다룹니다. 평문 1883 포트는 loopback에만 엽니다.",
        },
        {
          title: "저장과 실시간 발행에 서로 다른 백프레셔",
          chosen: "저장은 CallerRuns, 실시간 발행은 전용 풀 + DiscardPolicy",
          alternatives: ["단일 비동기 풀", "두 풀 모두 CallerRuns", "Kafka 또는 Outbox 패턴"],
          reason:
            "저장 경로는 포화되면 호출 스레드가 직접 처리해 속도를 늦추고 유실을 막습니다. 실시간 발행은 best-effort로 두고 클라이언트가 catch-up API로 보정합니다. 외부 큐는 납품 구성이 복잡해져 다음 과제로 남겼습니다.",
        },
        {
          title: "대시보드 실시간 전달 경로",
          chosen: "브라우저가 브로커를 직접 구독 + REST catch-up",
          alternatives: ["서버 SSE 팬아웃 유지", "STOMP relay"],
          reason:
            "장비 수가 많고 데이터가 빠르게 흐르는 IoT 대시보드라, 네트워크 오버헤드가 적은 경량 프로토콜과 QoS 기반 전달 신뢰성이 필요했습니다. 앞으로 장비 쪽으로 작업을 내려보내는 양방향 통신에도 대비할 수 있습니다. 브라우저는 UI 전용 토픽(ui/events/*)만 구독하도록 인가되고, 대시보드 서버의 SSE 중계 코드는 사라졌습니다. 대신 HTTP 세션과 MQTT 채널의 수명이 갈라졌고, 이것이 아래 세션 만료 버그로 이어졌습니다.",
        },
        {
          title: "게이트웨이 오프라인 버퍼",
          chosen: "인메모리 drop-oldest 큐 (10,000건)",
          alternatives: ["디스크 영속 큐(SQLite 등)"],
          reason:
            "1건 약 349B × 10,000건 ≈ 3.3MB로, 초당 1건 기준 약 2.7시간을 버팁니다. eMMC 쓰기 수명 부담이 없고, 전원 차단 시 소실되는 한계는 릴리스 노트에 적었습니다.",
        },
      ],
      incidents: [
        {
          title: "DB 커넥션 풀 고갈로 전체 API 500",
          symptom: "스테이징 서버에 부하테스트를 반복하던 중, DB를 쓰는 모든 API가 500을 반환하는 것을 발견했습니다.",
          cause:
            "커밋 직후 AFTER_COMMIT 리스너 안의 동기 MQTT publish가 half-open 연결에서 타임아웃 없이 기다렸고, 그동안 스레드에 묶인 JDBC 커넥션이 반환되지 않았습니다. 이 콜백 구조는 제가 만든 것이었습니다.",
          fix: "실시간 리스너를 전용 비동기 풀로 분리해 커밋 스레드가 곧바로 커넥션을 반환하게 하고, publish 타임아웃 5초와 Hikari leak-detection 30초를 넣었습니다.",
          result: "수정 후 부하테스트를 다시 돌렸을 때 풀 고갈 없이 커넥션이 정상적으로 반환됐습니다.",
        },
        {
          title: "큐가 차면 UART 수신이 멈춤",
          symptom:
            "서버 연결이 끊긴 채 큐(512건)가 차면 UART 읽기가 멈춰 35초 뒤 링크가 끊긴 것으로 오판했고, 재전송 순서가 뒤바뀌거나 취소 시 이벤트가 사라졌습니다.",
          cause:
            "블로킹 put, 실패 항목을 큐 뒤에 다시 넣는 처리, 그리고 asyncio의 CancelledError가 Exception이 아니어서 except에 잡히지 않은 것이 겹쳤습니다.",
          fix: "논블로킹 drop-oldest 큐로 바꾸고, 실패·취소된 항목은 put_front로 맨 앞에 되돌린 뒤 취소를 다시 raise합니다. 상한은 512건에서 10,000건으로 늘렸습니다.",
          result: "큐가 가득 차도 UART 수신과 링크 판정이 유지됩니다.",
        },
        {
          title: "세션 만료 후 카운터가 0부터 다시 집계",
          symptom: "세션이 만료되면 입장·퇴장·알람 카운터가 0부터 다시 세어져 잘못된 숫자가 표시됐습니다.",
          cause:
            "HTTP 데이터 로드는 302 → 로그인 HTML(200)로 조용히 실패했지만, 브라우저 MQTT는 세션과 무관하게 이벤트를 계속 받아 초기값 없이 증분만 더해졌습니다.",
          fix: "API 요청에는 302 대신 401을 주고, 401을 받으면 로그인으로 보내는 공통 fetch 래퍼로 데이터 로드 9곳을 교체했습니다. 초기 로드가 실패하면 구독을 시작하지 않고, 만료 5분 전에 경고합니다.",
          result: "만료 시 잘못된 카운터 대신 로그인 화면으로 이동합니다.",
        },
        {
          title: "측정 도구가 만든 가짜 PASS와 가짜 손실",
          symptom:
            "메시지의 50%가 유실돼도 상관 지표가 PASS였고, 반대로 서버가 정상인데도 E2E 손실이 약 500건으로 잡혔습니다.",
          cause:
            "상관 지표가 수신된 메시지에서만 샘플링됐고, 구독자는 공칭 시간에 먼저 종료해 gracefulStop으로 늦게 끝나는 부하의 꼬리 메시지를 놓쳤습니다.",
          fix: "기대 수신 대비 missing 기반 게이트와 발행·수신 총량 하드 대조로 바꾸고, 부하 종료 뒤 30초 drain 후 구독자를 정산합니다.",
          result: "대시보드 E2E에서 발행 12,000건 = 수신 12,000건으로 맞았습니다.",
        },
      ],
      retrospective:
        "Testcontainers가 없어 통합 테스트가 CI에서 돌지 않았고, 커넥션 풀 장애처럼 스레드와 커넥션이 얽힌 문제를 테스트로 먼저 잡지 못했습니다. 실시간 발행이 AFTER_COMMIT에 의존해 프로세스가 죽으면 누락되는 점, QoS1 재전송 중복을 아직 제거하지 못하는 점(게이트웨이는 boot_id·seq를 이미 붙입니다)이 다음 과제입니다. 대시보드 개편은 대형 커밋 하나로 올려 리뷰가 어려웠고, 지금은 설계 문서를 작업 단위로 쪼개 작은 커밋으로 진행합니다.",
    },
  },
  {
    slug: "ta0q",
    title: "TA0q · 설비 유지보수 관리",
    org: "company",
    summary: "엑셀 93개 시트로 관리하던 설비 점검 이력·설정값·거래처를 모바일 대응 웹 서비스로 옮긴 사내 시스템",
    period: "2025.01 – 현재",
    status: "운영 중",
    role: "2인 공통 베이스 이후 단독 개발 · 커밋 79% · v1.0~v1.4.1 릴리스",
    problem:
      "유지보수 기록을 엑셀 관리대장 93개 시트로 관리해 동시 편집, 이력 추적, 권한 통제가 어려웠고, 현장에서 휴대폰으로 바로 입력할 수 없었습니다.",
    approach:
      "요구사항 정리부터 DB 설계, 백엔드, 모바일 대응 화면, CI/CD, 운영 이관까지 대부분을 맡았습니다. 엑셀은 검토 가능한 SQL을 생성해 한 번의 트랜잭션으로 옮겼고, 역할 3단계 + 그룹 세부 권한, 3단계 삭제 생애주기, 감사 로그로 운영 기반을 만들었습니다.",
    metrics: [
      { label: "엑셀 관리대장에서 웹으로 이관", after: "93개 시트" },
      { label: "단위 테스트 (전부 직접 작성)", after: "376개" },
      { label: "업무 화면 51개 색 대비", before: "2.47:1", after: "7.56:1" },
    ],
    layers: ["frontend", "backend", "database", "infra"],
    stack: [
      "Java 17",
      "Spring Boot 2.7",
      "eGovFrame 4.2",
      "Spring Security",
      "MyBatis",
      "PostgreSQL 15",
      "Flyway",
      "Redis 7",
      "Thymeleaf",
      "Docker Compose",
      "Jenkins",
      "Nginx",
    ],
    why: "현장 네트워크가 불안정하면 CDN 실패가 곧 화면 고장이라, 모든 라이브러리를 로컬에 번들했습니다. 세션은 톰캣 세션 + Redis 로그인 마커로 두어 마커 삭제만으로 강제 로그아웃과 권한 회수를 즉시 반영합니다.",
    links: {},
    caseStudy: {
      context:
        "고객 현장에 설치된 보안 게이트 장비의 점검 이력, 설정값, 거래처·사업장·담당자, 도면 파일을 관리하는 사내 웹 서비스입니다. 2025년 초 팀원 1명과 공통 베이스(회원·권한·관리자)를 만들었고, 이후 도메인 기능 개발과 v1.0~v1.4.1 고도화·릴리스는 혼자 맡았습니다. 지금은 엑셀 관리대장을 대신해 현장 유지보수 인원 전원이 사용하고 있습니다. DB 마이그레이션 V1~V15와 배포 전 자동 DB 백업이 들어간 Jenkins 파이프라인도 직접 작성했습니다.",
      decisions: [
        {
          title: "엑셀 이관은 DB에 직접 쓰지 않는다",
          chosen: "SQL 파일만 생성하고, 검토 뒤 psql -1 한 번으로 적용",
          alternatives: ["앱에 엑셀 업로드 기능", "스크립트가 DB에 직접 insert"],
          reason:
            "시트마다 형식이 제각각이라(병합 셀, 시트별 예외) 적용 전에 사람이 diff를 볼 수 있어야 했습니다. source_key 부분 UNIQUE로 멱등성을 확보하고, 파서 테스트 70건으로 시트별 예외를 고정했습니다.",
        },
        {
          title: "세션은 톰캣 + Redis 로그인 마커",
          chosen: "톰캣 메모리 세션 + Redis session 마커",
          alternatives: ["Spring Session Redis"],
          reason:
            "활성 세션 조회, 강제 로그아웃, 권한 변경의 즉시 반영이 필요했고 eGov 기반 코드와도 맞아야 했습니다. 대가로 재시작 시 재로그인이 필요하고 만료 시계가 둘로 나뉘었는데, 이것이 아래 30분 로그아웃 문제의 원인이 됐습니다.",
        },
        {
          title: "최초 관리자는 DB가 1명을 보장",
          chosen: "부분 UNIQUE 인덱스 + pg_advisory_xact_lock",
          alternatives: ["애플리케이션 코드 검사만"],
          reason:
            "'관리자가 0명일 때만' 만드는 조건부 삽입이라 행 제약만으로는 표현이 어려워, 트랜잭션 범위 락으로 check-then-insert를 직렬화했습니다.",
        },
      ],
      incidents: [
        {
          title: "설치 후에도 익명으로 관리자 계정 생성 가능",
          symptom: "최초 설치용 POST /first_run이 설치가 끝난 뒤에도 열려 있었습니다.",
          cause:
            "Spring Security는 먼저 매칭된 규칙을 적용하는데, permitAll 목록의 /first_run이 뒤에 선언된 가드 규칙보다 먼저 매칭됐고 POST 핸들러에는 별도 가드가 없었습니다.",
          fix: "가드 규칙을 앞으로 옮기고 trailing slash 우회를 막았으며, 컨트롤러 가드와 advisory lock 기반 관리자 생성까지 3계층으로 막았습니다.",
          result: "신규 테스트 7건을 포함해 33/33 통과, 격리 Docker 스택에서 302 차단을 확인했습니다.",
        },
        {
          title: "세션을 12시간으로 늘렸는데 30분 만에 로그아웃",
          symptom: "현장 요구로 세션을 12시간으로 늘렸지만, 사용자는 여전히 30분 만에 로그아웃됐습니다.",
          cause:
            "Redis 마커 TTL을 직접 관찰하니 로그인 직후 43,199초가 페이지 이동 후 1,795초로 떨어졌습니다. 서블릿 세션, 로그인 시 마커 TTL, 요청마다 연장하는 인터셉터가 각자 만료 시계를 갖고 있었고 가장 짧은 값이 이겼습니다.",
          fix: "세 곳이 단일 설정값을 읽게 하고, 세션이 길어져 권한 회수가 늦어지는 부작용은 그룹 세션 무효화로 보완했습니다.",
          result: "TTL이 43,199초로 슬라이딩 유지되는 것을 확인했습니다.",
        },
        {
          title: "마이그레이션이 운영 DB에서만 실패",
          symptom: "로컬에서 통과한 마이그레이션 두 건이 운영 DB에서만 실패하거나 데이터를 한쪽만 채웠습니다.",
          cause:
            "관리자 그룹을 이름으로 찾았는데 운영에서는 이름이 바뀌어 있었고, 이전 마이그레이션이 테이블을 비운 채 다시 만들어 FK가 한쪽에만 남아 있었습니다.",
          fix: "그룹은 역할 값으로 찾도록 바꾸고 운영 26건을 백필했습니다. 이후 운영 DB 사본을 격리 compose에 복원해 마이그레이션을 먼저 검증하는 절차를 만들었습니다.",
        },
      ],
      retrospective:
        "통합 테스트와 커버리지 측정이 없고, Docker 빌드가 테스트를 건너뜁니다. 마이그레이션이 운영 데이터 차이로 두 번 실패한 뒤에야 운영 사본 검증 절차를 만들었는데, 처음부터 CI에 넣었어야 했습니다. 다시 한다면 Testcontainers로 마이그레이션과 권한 흐름을 통합 테스트하고, 세션 만료를 처음부터 하나의 시계로 설계하겠습니다.",
    },
  },
  {
    slug: "uwb-rtls",
    title: "UWB 실내 위치측위 대시보드",
    org: "company",
    summary: "UWB 태그의 실시간 위치를 2D·3D 지도에 표시하고, 보안구역 침입 경보·이동 리플레이·히트맵을 제공하는 웹앱",
    period: "2026.08 – 현재",
    role: "1인 개발 · 선행개발",
    status: "고객 PoC 진행 중",
    problem:
      "사내 UWB 테스트베드(약 27m × 13.5m, 앵커 8개)의 게이트웨이가 고장 난 상태였고, SQLite로 시작한 저장소는 11시간 만에 62.8만 행이 쌓여 히트맵 한 번에 13.2초가 걸렸습니다.",
    approach:
      "게이트웨이를 고쳐 Node 서버가 MQTT로 위치를 받고 WebSocket으로 뿌리게 했습니다. 저장소를 TimescaleDB로 옮겨 1분 × 0.25m 격자 연속 집계 하나를 히트맵·통계·장기 리플레이가 공유하게 하고, 침입 판정은 브라우저가 없어도 기록되도록 서버로 옮겼습니다.",
    metrics: [
      { label: "장기 리플레이 조회", before: "99.7초", after: "0.06초" },
      { label: "범위 조회 API", before: "2.6초", after: "0.08초" },
    ],
    layers: ["frontend", "backend", "database", "infra"],
    stack: ["Node.js 24", "ws", "mqtt.js", "TimescaleDB", "PostgreSQL 16", "Canvas", "three.js", "n8n", "Rocket.Chat", "Docker Compose"],
    why: "기존 SQL을 그대로 쓰면서 하이퍼테이블, 연속 집계, 압축·보존 정책을 기본으로 얻을 수 있어 TimescaleDB를 택했습니다. 데이터는 멱등 스크립트로 이관했습니다.",
    links: {},
    caseStudy: {
      context:
        "사내 선행개발로 시작해 현재 고객 PoC를 진행 중이며, 사내 운영 서버에 테스트로 배포돼 있습니다. 개발은 사내 UWB 테스트베드(앵커 8개, 태그 2개)에서 했습니다. 게이트웨이 수리부터 실시간 지도, 평면도 정렬, 보안구역, 리플레이, 3D 뷰, 장치 원격 설정, 메신저 알림까지 혼자 만들었습니다.",
      decisions: [
        {
          title: "연속 집계 하나를 세 용도가 공유",
          chosen: "1분 × 0.25m 격자 연속 집계(loc_1min)",
          alternatives: [],
          reason:
            "히트맵, 통계, 장기 리플레이가 같은 집계를 읽습니다. 리플레이 구간이 3시간을 넘으면 원본 대신 1분 평균으로 응답합니다(mode: raw | minute).",
        },
        {
          title: "침입 판정은 서버에서",
          chosen: "서버 측 구역 판정",
          alternatives: ["브라우저 측 판정"],
          reason:
            "브라우저가 열려 있지 않아도 이벤트가 기록됩니다. 좌표가 NaN으로 비는 공백이 최대 45초라, 무신호 판정은 유효 좌표가 아니라 MQTT 메시지 수신 여부를 기준으로 삼아 오탐을 막았습니다.",
        },
        {
          title: "알림은 n8n으로 중계",
          chosen: "n8n 웹훅 → Rocket.Chat",
          alternatives: [],
          reason:
            "알림 규칙을 코드 수정 없이 바꿀 수 있습니다. 60초 중복 억제, 8초 타임아웃, 재시도(1초·3초)를 두고, 429를 뺀 4xx에는 재시도하지 않습니다.",
        },
      ],
      incidents: [
        {
          title: "장기 리플레이에 99.7초",
          symptom: "장기 구간 이동 기록을 리플레이하면 응답까지 99.7초가 걸렸습니다.",
          cause: "실행 계획을 보니 원본 약 64만 행을 스캔했고, work_mem 부족으로 temp spill이 2,842블록 발생하고 있었습니다.",
          fix: "장기 구간은 연속 집계의 1분 가중평균으로 응답하고, work_mem을 15.8MB에서 64MB로 올렸습니다. 프론트는 DOM 재생성을 300ms 단위로 묶고, 히트맵은 오프스크린에 한 번 그려 재사용합니다.",
          result: "장기 리플레이 99.7초 → 0.06초, 범위 조회 2.6초 → 0.08초.",
        },
        {
          title: "집계에서 최근 1분 데이터 누락",
          symptom: "집계 결과에서 가장 최근 약 1분이 빠졌고, 행 수를 대조하니 514행이 누락돼 있었습니다.",
          cause:
            "refresh_continuous_aggregate(NULL, NULL)이 아직 진행 중인 분까지 구체화해 워터마크가 미래로 밀렸고, 이후 들어온 데이터가 집계에 반영되지 않았습니다.",
          fix: "리프레시 끝을 now() − 1분으로 제한하고, materialized_only=false로 실시간 구간을 합치고, 정책의 end_offset을 1분으로 맞췄습니다.",
        },
        {
          title: "\"NaN\" 좌표 하나로 렌더링 전체 정지",
          symptom: "지도 렌더링이 통째로 멈췄습니다.",
          cause: "게이트웨이가 좌표로 \"NaN\" 문자열을 보내 toFixed()에서 예외가 났습니다.",
          fix: "수신 단계에서 폐기하고, 이미 저장된 오염 행 142건을 정리했습니다.",
        },
      ],
      retrospective:
        "전수 점검 67항목으로 결함 16건을 찾아 고치고 API 회귀 46항목을 통과시켰지만, 자동 테스트가 없고 검증 스크립트를 저장소에 남기지 않아 다시 돌려 볼 수 없습니다. 첫 커밋에 v1~v21이 한꺼번에 들어가 이력을 추적하기 어렵습니다. 다시 한다면 검증 스크립트를 저장소에 포함하고 기능 단위로 커밋하겠습니다.",
    },
  },
  {
    slug: "tof-cam-detector",
    title: "ToF 은닉 카메라 탐지 R&D",
    org: "company",
    summary: "보안 게이트를 통과하는 사람이 가진 초소형 카메라를, ToF 센서의 빛이 렌즈에서 역반사되는 현상(글린트)으로 탐지하는 R&D",
    period: "2026.09 – 현재",
    role: "1인 R&D · 실험 설계와 측정",
    status: "진행 중",
    problem:
      "문서가 없는 320×240 센서에서 렌즈는 1~9px에 불과해 논문의 기존 모델을 그대로 쓸 수 없었고, 센서가 사양대로 동작하는지(fps, 밝기)부터 확인해야 했습니다.",
    approach:
      "센서 통신 방식을 내장 웹 뷰어 코드에서 역분석해 캡처·기록·재생 파이프라인을 만들고, 가설마다 대조 실험으로 센서 특성을 확정했습니다. 검출은 규칙 기반 필터 체인으로 시작하고, 센서가 오기 전에 합성 장면 생성기로 테스트부터 갖췄습니다.",
    metrics: [
      { label: "반사물을 둘 때 기준 영역 밝기 변화 (자동 → 고정 게인)", before: "−76.6%", after: "+10.0%" },
    ],
    layers: ["infra"],
    stack: ["Python", "NumPy", "OpenCV", "h5py", "pytest", "MaixSense A075V (ToF)", "NanoPi R6C"],
    why: "렌즈가 1~9px뿐인 해상도에서는 참고 논문 모델(LAPD, Hide-and-Sweep)의 전제가 맞지 않아, 근거 주석을 단 임계값을 한 곳에 모은 규칙 기반으로 시작했습니다. ML은 오탐률을 판정한 뒤 조건부로 도입합니다.",
    links: {},
    caseStudy: {
      context:
        "기존 게이트 보안 제품을 확장하는 R&D로, 8주 계획의 초기 단계입니다. 실환경 탐지 정확도와 오탐률은 아직 측정 전이라, 이 페이지는 탐지 성능이 아니라 센서 특성화와 문제에 접근한 방식을 다룹니다.",
      decisions: [
        {
          title: "규칙 기반으로 시작, ML은 조건부",
          chosen: "필터 체인 규칙 기반 검출",
          alternatives: ["LAPD tflite 모델", "Hide-and-Sweep 모델"],
          reason:
            "LAPD 모델은 특정 제조사 센서의 confidence 채널을, Hide-and-Sweep은 4K 영상을 전제합니다. 오탐은 여러 각도 누적 점수로 걸러낼 계획입니다(한 각도에서만 반짝이는 나사머리 배제).",
        },
        {
          title: "실시간과 재생을 같은 인터페이스로",
          chosen: "공통 FrameSource + 합성 장면 생성기",
          alternatives: [],
          reason:
            "기록 재생만으로 로직을 결정론적으로 검증합니다. 세션 형식에 조명 상태 필드를 미리 넣어, 나중에 기존 측정 세션을 다시 찍지 않아도 되게 했습니다.",
        },
        {
          title: "단계마다 후퇴 경로를 정한 일정",
          chosen: "판정 게이트형 일정",
          alternatives: [],
          reason:
            "AGC, 글린트 거리, 조명 스윕, 서행 추적 단계마다 실패하면 다른 센서로 선회하거나 게이트 앞 1~2초 정지 운용으로 물러설 경로를 미리 정했습니다.",
        },
      ],
      incidents: [
        {
          title: "사양 30fps 센서가 12.5fps",
          symptom: "사양상 30fps인 센서가 12.5fps 안팎으로만 나왔습니다.",
          cause:
            "RGB 디코딩, 동시 요청 수, 무압축 포맷, 허브·직결, 트리거 모드를 하나씩 배제했습니다. frame_id가 정확히 1씩 늘어 장치가 요청마다 프레임을 만든다는 것을 확인했고, 장치 내부 직렬 처리(요청당 약 77ms)가 상한이었습니다.",
          fix: "서행 추적의 시간 예산과 조명 스윕의 프레임 배분을 다시 계산했습니다.",
        },
        {
          title: "센서가 IR 밝기를 스스로 조절",
          symptom:
            "흰 판 오른쪽 절반에만 반사 포일을 붙이자, 건드리지 않은 왼쪽 절반의 평균 밝기가 671.0에서 117.1로 83% 떨어졌습니다.",
          cause:
            "픽셀별 비율의 표준편차가 0.022로 화면 전체에 같은 비율이 적용된 전역 자동 게인이었고, depth 잡음도 4.1mm에서 19.9mm로 늘었습니다. 절대 IR 임계값 방식이 성립하지 않았습니다.",
          fix: "역분석 때 예비로 보고 0으로 보내던 설정 바이트 8-11이 노출 시간이라는 것을 제조사 드라이버 소스에서 확인했습니다.",
          result: "2×2 대조 실험에서 자동 모드 −76.6%, 고정 모드 +10.0%로 자동 게인을 끌 수 있음을 확인했습니다.",
        },
        {
          title: "참고 구현(LAPD)의 거리 필터가 작동하지 않음",
          symptom: "원본 알고리즘을 이식하는 중 거리 필터가 사실상 아무것도 거르지 않았습니다.",
          cause: "원본은 깊이를 필터 뒤에 구하고, 깊이가 0이면 통과시키고 있었습니다.",
          fix: "깊이를 필터 앞에서 구하고, 빈 깊이 대체값을 다단계 중앙값으로 바꿨습니다.",
          result: "합성 데이터에서 렌즈 recall 1.00, 오탐 2건(나사 반짝임).",
        },
      ],
      retrospective:
        "실측 탐지 성능이 아직 없습니다. 전원 구성을 허브 경유로 정했다가 USB가 20분 동안 34번 끊기는 것을 보고 직결로 번복했고, README 같은 문서 일부가 코드 변화를 따라가지 못했습니다. 가설·측정값·기각 이력은 커밋과 계획 문서에 남겨 이후 판단의 근거로 삼고 있습니다.",
    },
  },
  {
    slug: "nutrirank",
    title: "NutriRank",
    org: "personal",
    summary: "식약처 공개 데이터 7만 건으로 음료·간식의 건강 등급(A~E)과 카테고리 순위를 보여주는 서비스",
    period: "2026.07",
    role: "1인 개발 · 기획부터 배포까지",
    problem:
      "영양성분표는 읽기 어렵고, 원천 데이터의 기준량 표기(100g/100ml)가 제조사마다 제각각이라 같은 주스인데도 등급이 정반대로 나왔습니다.",
    approach:
      "12단계 적재 파이프라인에서 점수·등급·순위를 미리 계산하고, 품질 게이트를 통과할 때만 원자적으로 교체했습니다. 제품유형 판정 기준을 표기가 아닌 카테고리로 바꿔(ADR-0007) 오판정을 구조적으로 없앴습니다.",
    metrics: [
      { label: "음료 제품유형 오판정", before: "2,376건", after: "0건" },
      { label: "적재한 제품 (등급 산출 69,989건)", after: "70,013건" },
      { label: "등급 로직 변경 시 재계산", before: "~11.5시간", after: "수 분" },
    ],
    layers: ["frontend", "backend", "database", "infra"],
    stack: ["Next.js 15", "TypeScript", "SQLite", "Drizzle ORM", "Recharts", "Vitest", "Playwright", "Docker"],
    why: "데이터가 월 단위로만 바뀌어, 조회 시 계산 대신 사전계산 + 읽기 전용 SQLite가 가장 단순하고 빠르다고 판단했습니다 (ADR-0004·0005).",
    links: { github: "https://github.com/eunkyo3/NutriRank" },
    media: {
      type: "image",
      src: "/media/nutrirank-home.webp",
      alt: "NutriRank 첫 화면: 수록 제품 70,013개, 등급 산출 69,989개, 소비자 카테고리 9종과 A~E 전체 등급 분포 막대",
    },
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
    org: "personal",
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
        "로그인 없이 플레이어 태그만으로 쓰도록 설계한 웹앱으로, Docker Compose로 실행합니다. API 키는 서버에만 두고 브라우저는 항상 FastAPI 프록시를 거치며, 서버는 랭커 공개 배틀 외의 개인 데이터를 저장하지 않습니다.",
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
            "7만여 전 백테스트에서 E1은 어느 분할에서도 상수 0.5를 이기지 못했습니다. 달력 분할은 수집량 급증으로 학습 표본이 0이 되어 데이터량·플레이어 기준 분할로 검증했고, E3는 세 분할 모두에서 95% 신뢰구간이 0보다 컸습니다.",
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
    slug: "jeong-cheo-gi",
    title: "정처기 배틀",
    org: "personal",
    summary: "정보처리기사 실기 기출 420문항을 혼자 학습하거나 친구와 실시간으로 대전하는 웹앱",
    period: "2026.08 – 2026.09",
    role: "1인 개발 · 풀스택",
    problem:
      "실기는 용어·코드 결과·SQL을 직접 써서 답하므로, 표기와 공백 차이를 어디까지 같은 답으로 볼지 채점 기준을 정해야 했습니다. 대전에서는 채점 응답이 곧 정답 오라클이 되지 않도록 진행 중인 문항의 정답과 해설을 잠가야 했습니다.",
    approach:
      "내 PC의 Node 서버 하나에 친구들이 LAN·Tailscale로 접속하는 구조로, 대전 로직은 시간을 주입받는 순수 리듀서로 만들고 Socket.io 어댑터가 효과만 전달하게 했습니다. 타이머는 서버가 권위를 갖고, 정답은 클라이언트로 보내지 않습니다.",
    metrics: [
      { label: "기출 21회차 · 전 문항 해설", after: "420문항" },
      { label: "자동화 테스트 (전부 통과)", after: "607개" },
    ],
    layers: ["frontend", "backend", "database"],
    stack: ["Node.js 22+", "Express", "Socket.io", "SQLite (better-sqlite3)", "Vanilla JS", "node:test", "Docker Compose"],
    why: "대전 상태 전이를 Date.now()를 쓰지 않는 순수 함수로 두어, 타이머·재접속·동시 제출 같은 경합을 실제 시간을 기다리지 않고 테스트로 재현했습니다.",
    links: { github: "https://github.com/eunkyo3/jeong-cheo-gi" },
    media: {
      type: "image",
      src: "/media/jeongcheogi-battle.webp",
      alt: "대전 진행 화면: 남은 시간 19:58과 두 참가자의 진행 현황 5/10, 정답 여부는 공개하지 않는다는 안내",
    },
    caseStudy: {
      context:
        "2020-1회부터 2026-2회까지 21회차의 복원 기출을 코드 139 · SQL 36 · 이론 245문항으로 나누고, 코드 문항은 C · Java · Python별로 골라 풀 수 있게 했습니다. 지인끼리 쓰는 비공개 학습용이라 클라우드 대신 내 PC에서 띄우며, 문제 출처가 외부 블로그여서 공개 호스팅은 하지 않습니다.",
      decisions: [
        {
          title: "대전 로직은 순수 리듀서",
          chosen: "applyEvent(state, event) → {state, effects}",
          alternatives: [],
          reason:
            "시간은 이벤트로 주입하고 역행하지 않게 고정했습니다. 소켓 어댑터는 효과를 emit·DB·타이머로 1:1 전달만 하며, 상태×이벤트 60칸 격자를 문서로 관리합니다.",
        },
        {
          title: "비밀번호 해시",
          chosen: "node:crypto scrypt(비동기)",
          alternatives: ["동기 bcrypt"],
          reason: "동기 bcrypt는 한 번에 90ms 넘게 이벤트 루프를 멈춰 서버 전체를 세웠습니다. 기존 bcrypt 해시는 로그인에 성공할 때 scrypt로 다시 저장합니다.",
        },
        {
          title: "표기만 다른 답은 정답 처리하지 않는다",
          chosen: "'거의 정답' 안내만 표시",
          alternatives: ["정규화 후 조용히 정답 처리"],
          reason: "실제 시험은 표기까지 채점하므로, 조용히 맞다고 하면 시험장에서도 통한다고 오해하게 됩니다.",
        },
      ],
      incidents: [
        {
          title: "채점기 예외 하나로 대전 방이 멈춤",
          symptom: "특정 문항의 검증기가 예외를 던지면 방이 영구 정지하고, 그 대전의 전적이 사라졌습니다.",
          cause: "카탈로그에 없는 검증기 타입 같은 데이터 오류가 채점 함수 밖으로 던져졌고, 대전 리듀서 안에서 삼켜져 종료 전이가 일어나지 않았습니다.",
          fix: "채점 규칙은 그대로 두고, 던지던 자리만 해당 문항 오답으로 강등한 뒤 원인을 문항·검증기 타입별로 한 번씩 기록합니다.",
        },
        {
          title: "제한 없음 방이 끝나지 않거나 즉시 끝남",
          symptom: "시간 제한 없는 방에서 마감 비교가 항상 참이 되거나, 잘못된 입력이 조용히 무제한 방을 만들었습니다.",
          cause: "JavaScript에서 at >= null은 항상 참이고, Number(null)은 0이 되기 때문이었습니다.",
          fix: "null 검사를 먼저 하고 숫자가 아닌 입력은 NaN으로 떨어뜨렸으며, 잊힌 방이 자원을 계속 차지하지 않게 12시간 안전 상한을 두었습니다.",
        },
      ],
      retrospective:
        "HTTPS, 이메일 인증, 비밀번호 찾기가 없어 공개 인터넷에 노출할 수 없고, 서버 PC가 꺼지면 진행 중인 대전이 무효가 됩니다. 문항 데이터 감사에서는 힌트가 정답을 노출한 문항을 1차 표본 감사가 놓쳤고, 같은 패턴을 전 회차 기계 검사로 바꿔 두 건을 더 찾은 뒤에야 노출 0건을 확인했습니다.",
    },
  },
  {
    slug: "subway-seat-finder",
    title: "지하철 혼잡 예측 · 착석 추천",
    org: "personal",
    summary: "서울 지하철 실시간 열차 위치와 시간대 통계를 결합해 이번 열차의 혼잡을 예측하고, 탈지·보낼지·몇 정거장 뒤 앉을지를 추천하는 대시보드",
    period: "2026.07",
    role: "1인 개발 · 대학 빅데이터 기획 PBL",
    problem:
      "기존 앱은 열차가 몇 분 뒤 오는지만 보여줍니다. 통계만으로는 몇 분 차이인 이번 열차와 다음 열차가 같은 30분 구간에 들어가 둘의 혼잡을 구분할 수 없었습니다.",
    approach:
      "역·승하차·혼잡도 공공데이터를 DuckDB로 적재해 시간대 기준값을 만들고, 실시간에서만 얻을 수 있는 앞 열차와의 배차간격과 시발 여부로 보정했습니다. 착석 추천은 정거장마다 시간을 흘려 해당 시각 통계를 다시 읽습니다.",
    metrics: [
      { label: "배차간격 기준표 실측 보정 (수집 로그 18,421 표본)", after: "33개 셀" },
      { label: "자동화 테스트", after: "354개" },
    ],
    layers: ["frontend", "backend", "database", "infra"],
    stack: ["Python 3.12", "FastAPI", "DuckDB", "pandas", "httpx", "Leaflet", "pytest", "Docker Compose"],
    why: "근거 없는 계수는 데이터에 억지로 맞추지 않았습니다. 재차인원(열차 안 인원) 실측이 없어 맞출 수 없는 시발 보정과 배차 민감도는 미보정으로 명시하고, 추정치의 오차(MAE 19.2%p)도 README에 그대로 남겼습니다.",
    links: { github: "https://github.com/eunkyo3/subway-seat-finder" },
    caseStudy: {
      context:
        "서울 열린데이터광장의 역 마스터·승하차·실시간 위치·도착 API와 혼잡도 통계 파일을 씁니다. 혼잡도는 서울교통공사 운영 1~8호선만 예측하고, 통계가 없는 노선은 위치·도착만 표시하며 API가 예측 불가를 명시합니다. 재차인원 실측이 없어 결과는 명수가 아닌 혼잡도 %(추정)로만 표현합니다.",
      decisions: [
        {
          title: "혼잡도 소스는 역 단위로 고른다",
          chosen: "역마다 공식 통계 또는 추정치 중 하나",
          alternatives: ["공식 통계와 추정치를 평균"],
          reason:
            "섞으면 공식 값이 추정 오차만큼 오염되는데, 결과가 숫자 하나라 알아챌 수 없습니다. 강남 08시 기준으로 섞으면 97.3%, 공식만 쓰면 75.5%였습니다.",
        },
        {
          title: "판정이 불확실하면 '모름'으로 둔다",
          chosen: "시발 감지는 보정계수로만 사용",
          alternatives: ["시발 열차로 단정해 추천에 반영"],
          reason: "회차·입고 열차나 짧은 수집 이력도 중간역 시발처럼 보이기 때문에, 앞 열차를 못 본 경우는 계수 1.0으로 두었습니다.",
        },
      ],
      incidents: [
        {
          title: "로그가 한 줄도 쌓이지 않음",
          symptom: "시발 보정이 한 번도 발동하지 않았고, 열차 위치 로그 테이블이 0행이었습니다.",
          cause: "앱은 읽기 전용 연결이라 적재를 조용히 건너뛰었고, 전 역 도착 조회가 307 리다이렉트를 주는데 httpx는 기본으로 따라가지 않아 수집이 재생 모드로 떨어졌습니다.",
          fix: "조용한 실패마다 경고를 내고, --require-db 옵션과 follow_redirects를 추가했습니다.",
        },
        {
          title: "다섯 정거장 밖 열차가 '0분 후 도착'",
          symptom: "8호선 열차가 도착했다고 나오는데 오지 않았습니다.",
          cause: "도착 코드는 '당역 도착'인데 메시지는 '[5]번째 전역'이었습니다. 실측해 보니 카운트다운이 늘 0으로 오는 노선이 10개였습니다.",
          fix: "코드와 메시지가 어긋나면 메시지를 믿고 남은 시간은 미상, 남은 정거장 수만 표시합니다.",
          result: "실제 역명 648개로 돌려 오검출 0건을 확인했습니다.",
        },
        {
          title: "아침 혼잡도를 40~50% 과대평가",
          symptom: "배차가 성긴 5·6·7·9호선의 예측이 상시 높게 나왔습니다.",
          cause: "노선 구분 없는 기준 배차간격표가 사실상 2호선 시각표여서, 실측/기준 비율이 늘 1을 넘었습니다.",
          fix: "수집 로그 18,421 표본에서 모호한 0초와 반복 재관측을 걸러 노선×시간대 중앙값을 뽑고, 표본 30개 이상인 33개 셀을 반영했습니다.",
          result: "같은 수집 로그로 다시 재면 반영한 셀의 편차가 ±0.2% 안으로 들어옵니다. 다른 기간 데이터로 한 검증은 아직 없습니다.",
        },
      ],
      retrospective:
        "최종 예측값(기준 × 보정계수)은 열차별 실측 정답이 없어 검증하지 못했습니다. 검증한 것은 승하차 기반 추정치를 공식 통계와 대조한 오차(MAE 19.2%p, Spearman ρ 0.47)뿐이고, 배차간격도 평일 피크와 20시만 캘리브레이션됐습니다.",
    },
  },
  {
    slug: "on-quest",
    title: "On-Quest",
    org: "personal",
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
    title: "RK3588S NPU · YOLOv8 성능 한계 측정",
    org: "personal",
    summary: "NanoPi R6C(RK3588S) NPU에서 YOLOv8 INT8 추론의 성능 한계를 재현 가능한 수치로 확정한 벤치마크",
    period: "2026.08 – 2026.09",
    role: "1인 · 측정 설계와 도구 개발",
    problem:
      "엣지 장비에서 실시간 객체탐지가 가능한지 판단해야 했지만, 측정할 때마다 수치가 흔들려 결론을 낼 수 없었습니다.",
    approach:
      "PC 변환 파이프라인과 장비 측정 하네스를 분리하고, 캡처·전처리·추론·후처리를 구간별로 따로 쟀습니다. CPU/NPU 클럭을 고정하고 고정되지 않은 측정은 원천 차단했습니다.",
    metrics: [
      { label: "yolov8n @640 · 종단 처리량", after: "32.1 fps" },
      { label: "반복 측정 편차 (클럭 고정 · 3회)", after: "0.19~0.33%" },
    ],
    layers: ["infra"],
    stack: ["Python", "RKNN-Toolkit2", "ONNX", "ultralytics YOLOv8", "RK3588S NPU", "Ubuntu"],
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
