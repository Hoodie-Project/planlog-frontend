# Progress

## 현재 상태

- 2026-07-12 기준 초기 프로젝트 구조 생성 완료
- 문서 3종 작성 완료
- Next.js + TypeScript + Tailwind 기반 프론트엔드 스캐폴딩 생성 완료
- 주요 화면용 목업 데이터와 라우트 초안 생성 완료
- 코스 만들기 4단계 쿼리스트링 뼈대와 API fetch 레이어 생성 완료

## 이번 턴에서 한 작업

1. `src/api/courses/generate.ts` 코스 생성 fetch 함수 추가
2. `src/store/course-store.ts`를 `zustand persist + sessionStorage` 기반 다단계 초안 저장 구조로 확장
3. `/course/create?step=1..4` 쿼리스트링 기반 무드 셀렉터 뼈대 구현
4. API 응답 타입과 결과 페이지 연결용 뷰 모델 추가
5. 아키텍처/진행 문서에 상태 관리와 API 경계를 반영
6. 로그인 모달 Figma 구현 및 보호 라우트 진입 가드 추가
7. `zustand persist + localStorage` 기반 mock auth 스토어/유저 타입 추가

## 결정 사항

- 제품 범위는 강원도 하루 여행 코스 생성과 기록 흐름 중심으로 고정
- GNB에서 서비스 소개는 제외
- 여행 타입은 단일 선택
- 코스 결과의 공유 기능은 제외하고 기록 카드 상세에서만 유지
- 숙소는 추천 선택/직접 입력까지만 1차 범위에 포함
- 코스 생성 초안은 `localStorage`가 아니라 `sessionStorage`에 저장
- 전역 상태는 이미 설치된 `zustand`를 그대로 사용
- 실제 생성 호출은 4단계에서만 `POST /api/courses/generate`
- 로그인 판별은 임시로 mock `accessToken` 존재 여부를 기준으로 두고, 사용자 정보는 같은 auth store에서 함께 관리
- 로그인 상태는 새로고침 후에도 유지되어야 하므로 `sessionStorage`가 아니라 `localStorage`에 저장

## 막힘

- 실제 출발지 좌표 전체 매핑은 아직 없음
- 실제 OAuth, 지도 SDK, 위치 인증 서버 정책은 미확정
- 실제 저장/재추천/권한 가드 로직은 아직 미구현
- `/api/auth/me` 백엔드 provider enum과 Google 로그인 지원 범위는 추후 확정 필요

## 다음 행동

1. 4단계 UI를 피그마 기준으로 세부 구현
2. 출발지별 좌표 사전 확장 또는 역/터미널 조회 API 연동
3. `POST /api/courses/generate` 로딩/에러/재시도 UX 보강
4. 결과 페이지를 실제 응답 구조 기준으로 상세 매핑
5. 실제 OAuth 로그인과 `/api/auth/me` 연동으로 mock auth 제거

## TODO

### 2026-07-21 / 타입: TODO

- 코드 교체 시점 및 조건: 실 OAuth 연동 완료 시
- 개발 내용
  - `src/lib/mock-auth.ts`의 mock 로그인 상태와 mock 사용자 데이터 제거
  - `src/components/auth/auth-bootstrap.tsx`의 임시 로그인 부트스트랩 제거
  - `src/components/auth/login-modal.tsx`의 mock 로그인 처리 제거 후 실제 Google/Kakao 로그인 액션 연결
  - `src/store/auth-store.ts`의 `accessToken`, `user` 저장 구조를 실제 인증 응답 기준으로 재검토
  - `src/api/auth/me.ts`를 실제 인증 토큰 기반 사용자 조회 흐름에 연결
  - 백엔드 `AuthUserDto.provider` 스펙과 프론트 `AuthProvider` 타입 정합성 맞추기

## 환경 분리

### Dev

- 목업 데이터 중심
- 심사자 모드 기본 활성화 가능
- 로컬 `.env.local` 사용

### Production

- 실제 OAuth와 API 사용
- 서버 위치 검증 필수
- 심사자 데모는 별도 플래그로 제한
