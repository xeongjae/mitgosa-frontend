# mitgosa-frontend — 에이전트 가이드

## 프로젝트 한 줄

**믿고사**: 상품 URL을 입력하면 AI가 리뷰를 분석하는 웹앱. 프론트는 Next.js(App Router)이며, 분석 API는 Next Route Handler가 백엔드로 프록시한다.

## 스택·버전

| 항목 | 값 |
|------|-----|
| Next.js | 15.5.15 |
| React / React DOM | 19.2.4 |
| TypeScript | strict (`tsconfig.json`) |
| 스타일 | Sass, 컴포넌트별 `*.module.scss` |
| 폰트 | `next/font/local` (Pretendard), `next/font/google` (Inter) |
| 린트 | ESLint 9 + `eslint-config-next` (core-web-vitals, typescript) |

### Next.js 15 관련

학습 데이터와 API·관례가 다를 수 있다. 구현 전 `node_modules/next/dist/docs/`의 해당 가이드를 확인하고 deprecation을 따른다.

---

## 디렉터리 맵

```
src/
  app/
    layout.tsx          # 루트 레이아웃, Header/Footer, 전역 SCSS·폰트
    page.tsx            # 홈 (서버 컴포넌트)
    page.module.scss
    globals.scss
    result/
      page.tsx          # 분석 결과 (클라이언트, sessionStorage 의존)
      result.module.scss
    api/analyze/route.ts  # POST → 백엔드 `/api/analyze` 프록시
  components/
    common/             # Header, Footer
    home/               # HeroSection, HowToUse, Showcase
    result/             # AnalysisResult, ResultSearchBar
  images/static/        # 정적 이미지 import 경로 (@/images/static/…)
  styles/
    _breakpoints.scss   # 공통 브레이크포인트 등 (필요 시 import)
```

**경로 별칭**: `@/*` → `./src/*` (`tsconfig.json`의 `paths`).

---

## 코딩 관례

1. **기본은 서버 컴포넌트**. `useState`, `useEffect`, 이벤트 핸들러, `sessionStorage` 등이 필요하면 파일 최상단에 `"use client"`.
2. **컴포넌트 배치**: 기능별 폴더에 `ComponentName.tsx` + `ComponentName.module.scss`를 나란히 둔다.
3. **임포트**: 공용 UI·페이지에서 컴포넌트는 `@/components/...` 절대 경로.
4. **이미지**: 정적 에셋은 `@/images/static/...`에서 import 후 `next/image` 등에 전달 (현재 홈·쇼케이스 등에서 사용).
5. **타입**: 결과 화면과 공유할 응답 형태는 `AnalysisResultData` 등 (`AnalysisResult.tsx`의 export 타입)을 기준으로 맞춘다.

---

## 핵심 데이터 흐름

1. **분석 요청**: 클라이언트가 `POST /api/analyze`, JSON body `{ url: string }` (예: `HeroSection.tsx`).
2. **프록시**: `src/app/api/analyze/route.ts`가 `process.env.BASE_URL`(없으면 `http://localhost:8000`)의 `POST /api/analyze`로 동일 body를 전달하고, 백엔드 status·JSON을 그대로 반환한다.
3. **결과 화면**: 성공 시 응답 JSON을 `sessionStorage.setItem("analysisData", …)` 후 `router.push("/result")`.
4. **`/result`**: `sessionStorage.getItem("analysisData")`로 초기 state를 채우고, 없으면 `router.replace("/")`. 백엔드 응답 스키마는 `AnalysisResultData`(`success`, `error`, `data`, `product` 등)와 일치해야 한다.

에이전트가 API 계약을 바꿀 때는 **Route Handler**, **HeroSection 제출 로직**, **`AnalysisResult` 타입**을 함께 점검한다.

---

## 환경 변수

| 변수 | 용도 |
|------|------|
| `BASE_URL` | 백엔드 베이스 URL (미설정 시 로컬 `http://localhost:8000`) |

로컬 개발 시 백엔드를 띄우지 않으면 프록시가 502를 반환할 수 있다.

---

## 자주 쓰는 명령

프로젝트 루트는 **`mitgosa-frontend/`** (여기서 `package.json`이 있다).

```bash
npm run dev    # 개발 서버
npm run build  # 프로덕션 빌드
npm run lint   # ESLint
```

---

## 작업 시 권장 사항

- 변경 범위는 요청된 기능에 한정하고, 기존 네이밍·폴더 구조·SCSS 모듈 패턴을 유지한다.
- 새 페이지·API는 App Router 규칙(`app/…/page.tsx`, `app/…/route.ts`)을 따른다.
- UI 카피·메타데이터는 한국어(`layout.tsx`의 `metadata`, 에러 메시지 등)에 맞춘다.
