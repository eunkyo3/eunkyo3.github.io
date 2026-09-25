# eunkyo3.github.io

정은교(Jung Eunkyo)의 포트폴리오 — https://eunkyo3.github.io

페이지 전체를 HTTP 요청 하나의 여정(Client → Middleware → Service → Database → Logs → Response)으로 구성했습니다.

## 스택

Next.js (App Router, static export) · TypeScript · Tailwind CSS · Motion · GitHub Pages

## 내용 수정

콘텐츠는 컴포넌트와 분리되어 있어 `src/content/`의 데이터 파일만 고치면 됩니다.

| 파일 | 내용 |
|---|---|
| `profile.ts` | 이름, 소개, 핵심 역량, 연락처 |
| `projects.ts` | 프로젝트 카드와 케이스 스터디 |
| `stack.ts` | 기술 스택과 사용처 |
| `experience.ts` | 경력 로그 |
| `credentials.ts` | 수상 · 자격증 · 교육 |

`main`에 push하면 GitHub Actions가 빌드해 Pages로 배포합니다.

## 로컬 실행

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # out/ 에 정적 파일 생성
```

`dev`·`build` 전에 `scripts/subset-font.mjs`가 사이트에 쓰인 글자만 담은 Pretendard 서브셋을 자동 생성합니다.
