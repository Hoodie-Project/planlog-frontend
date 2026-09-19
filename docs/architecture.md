# Architecture

## 1. 프론트엔드 아키텍처

- 프레임워크: Next.js App Router
- 언어: TypeScript
- 스타일: Tailwind CSS
- UI 컴포넌트: shadcn/ui 스타일의 로컬 컴포넌트
- 모바일 전역 메뉴: `MobileBottomNavigation` 공통 컴포넌트로 코스 만들기·추천 코스·나의 기록 메뉴의 활성 상태와 여백을 통일
- 서버 상태: TanStack Query
- 클라이언트 상태: Zustand
- 폼: React Hook Form + Zod

## 2. 입력 → 처리 → 출력

### 입력

- 사용자 선택: 감성, 여행 타입, 날짜/시간, 출발 방식, 출발 지점
- 사용자 액션: 코스 저장, 숙소 선택, 스탬프 획득, 기록 저장
- 시스템 입력: 로그인 상태, 위치 권한, 심사자 모드, API 응답

### 처리

1. `React Hook Form + Zod`
   - 무드 셀렉터 입력 검증
   - 숙소 직접 입력 검증
2. `Zustand`
   - 코스 생성 입력값
   - `step=1..4` 쿼리스트링 기반 무드 셀렉터 진행 상태와 초안 유지
   - `sessionStorage` persist로 새로고침/탭 내 이동 복구
   - 로그인 사용자 정보와 액세스 토큰
   - `localStorage` persist 기반 로그인 상태 유지
   - 기록 화면 피그마 검증용 `hasRecords` 미리보기 플래그
   - 심사자 모드
   - 선택된 숙소와 현재 코스
   - `SavedCourseStatus(WAITING | IN_PROGRESS | COMPLETED)`와 코스 저장·시작·완료/리뷰 전환
3. `TanStack Query`
   - 추천 코스 조회
   - 축제/숙소/장소 상세 조회
   - 저장한 코스 및 기록 목록 조회
4. `Next Route Handler`
   - 인증·코스·저장 코스·북마크·스탬프 요청 프록시
   - 브라우저는 same-origin `/api/*`만 호출해 로컬 개발 환경 CORS를 우회
   - 인증 경로(`/api/auth/*`, `/auth/*`) 차이는 auth proxy가 흡수
5. 공통 API Client
   - `src/api/client.ts`에서 Authorization 헤더, query string, 오류 응답을 일관되게 처리
   - 백엔드가 비JSON 오류 본문을 보내도 `ApiError.payload`로 안전하게 전달
6. View Model 계층
   - 서버 응답을 화면 카드, 타임라인, 요약 칩용 데이터로 변환

### 출력

- 랜딩, 코스 결과, 코스 상세, 장소 상세, 저장한 코스, 나의 기록, 마이페이지
- 모바일 전용 Active Trip과 Stamp Complete
- 로그인 모달, 장소 변경 확인 모달, 숙소 선택 확인 모달
- 보호 라우트 진입 시 로그인 모달 가드

## 3. 폴더 구조

```text
docs/
  prd.md
  architecture.md
  progress.md
src/
  api/
    auth/
    courses/
  app/
    api/
      auth/
  components/
    auth/
    ui/
  features/
    course/
    landing/
    records/
  lib/
  store/
```

## 4. 라우팅 구조

```text
/                      랜딩
/course/create?step=1  무드 셀렉터 1단계
/course/create?step=2  무드 셀렉터 2단계
/course/create?step=3  무드 셀렉터 3단계
/course/create?step=4  무드 셀렉터 4단계 및 생성 호출
/course/result         추천 코스 지도 결과 (코스 생성 API 응답을 우선 표시)
/course/result/stays   추천 숙소 지도
/course/saved          저장한 코스
/records               나의 기록
/records/stamps        완료한 스탬프
/records/[id]          기록 카드 상세
/my                    마이페이지
```

## 5. API 경계

초기 스캐폴딩은 목업 데이터 기반으로 시작하되, API 함수는 `src/api/<resource>/<action>.ts` 경계로 분리한다.

브라우저 요청은 백엔드 도메인으로 직접 보내지 않고 Next Route Handler를 거친다. 프론트는 same-origin `/api/*`만 호출하고, Next 서버가 운영 API의 `/api/*` 경로로 프록시한다. 동적 리소스 식별자는 프록시 전달 전 URL 인코딩한다.

- `POST /api/auth/guest` -> Next proxy -> backend auth endpoint
- `POST /api/auth/kakao` -> Next proxy -> backend auth endpoint
- `GET /api/auth/me`
- `POST /api/courses/generate`
- `GET|POST /api/saved-courses`
- `GET|DELETE /api/saved-courses/:id`
- `GET|POST /api/stamps`
- `GET /api/stamps/progress`
- `GET|POST /api/bookmarks`
- `DELETE /api/bookmarks/:id`
- `GET /api/bookmarks/upcoming`

추천 코스 일정 목록은 시작·종료 지점을 강조하는 체크 배지와 장소별 이동 시간을 표시하며, `숙소 추가하기`는 `/course/result/stays`로 이동한다.

## 6. 데이터 모델 초안

### CoursePreferences

- mood
- tripStyle
- arrivalDate
- arrivalTime
- transportMode
- originLabel

### CreateCourseRequest

- zone
- transport
- style
- spotCount
- nights
- travelDate
- startMapX
- startMapY
- seed
- debug

### GeneratedCourse

- title
- summaryTags
- timeline[]
- stats
- recommendationReasons[]
- accommodations[]

### StampState

- `NEED_PERMISSION`
- `OUT_OF_RANGE`
- `AVAILABLE`
- `COMPLETED`
- `REVIEWER_DEMO`

### CompletedStamp

- `theme`, `place`, `completedAt`, `emotion`, `review`
- 완료 스탬프 목록은 테마·완료일 정렬을 클라이언트에서 적용하고, 리뷰 모달은 `read`/`write` 모드로 재사용

### SavedCourse

- `id`, `title`, `date`, `spotCount`, `zone`
- `status`: `WAITING`(저장) → `IN_PROGRESS`(코스 시작) → `COMPLETED`(코스 완료 및 리뷰 저장). 단일 enum으로 한 코스에 한 상태만 유지
- `review`

## 7. 장애와 예외 처리

- 로그인 필요 액션: 모달로 가드
- 인증 요청은 Next proxy route를 우선 경유해 로컬 개발 시 CORS를 차단한다.
- 위치 권한 없음: 권한 요청 상태 노출
- API 실패: 재시도 버튼과 대체 안내 문구 제공
- 데이터 없음: 심사 모드용 기본 목업 코스 노출 가능

## 8. HITL

- 심사자 모드는 사람 검토를 위한 데모 경로다.
- 운영 전 위치 인증과 저장 발급은 서버 검증이 필요하다.
- 추천 이유 문구는 운영 시 데이터 규칙 검토가 필요하다.

## 9. 보안 경계

- OAuth 클라이언트 ID와 API Base URL은 `.env`를 통해 주입한다.
- 카카오 로그인은 JavaScript SDK가 발급한 카카오 액세스 토큰을 `POST /api/auth/kakao`로 전달한다. `Kakao.init()`에는 REST API 키가 아닌 JavaScript 키를 사용한다.
- 위치 검증은 최종적으로 서버에서 재확인한다.
- 저장/기록 API는 인증 세션 기반으로 보호한다.
- Git에는 `.env`를 포함하지 않는다.
