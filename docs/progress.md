# Progress

## 현재 상태

- 2026-07-12 기준 초기 프로젝트 구조 생성 완료
- 문서 3종 작성 완료
- Next.js + TypeScript + Tailwind 기반 프론트엔드 스캐폴딩 생성 완료
- 주요 화면용 목업 데이터와 라우트 초안 생성 완료

## 이번 턴에서 한 작업

1. 기획서 내용을 `docs/prd.md`로 구조화
2. 기술 스택과 상태 관리 책임을 `docs/architecture.md`에 정리
3. 진행 상태와 다음 행동을 `docs/progress.md`에 기록
4. `README.md`, `deploy.sh`, `.env`, `.gitignore`, `AGENTS.md` 생성
5. `src/` 하위 Next.js App Router 기반 UI 스캐폴딩 생성

## 결정 사항

- 제품 범위는 강원도 하루 여행 코스 생성과 기록 흐름 중심으로 고정
- GNB에서 서비스 소개는 제외
- 여행 타입은 단일 선택
- 코스 결과의 공유 기능은 제외하고 기록 카드 상세에서만 유지
- 숙소는 추천 선택/직접 입력까지만 1차 범위에 포함

## 막힘

- 실제 API 명세와 디자인 원본(Figma token, spacing, assets)은 아직 없음
- 실제 OAuth, 지도 SDK, 위치 인증 서버 정책은 미확정
- 패키지 설치와 빌드 검증은 의존성 미설치 상태라 아직 수행 전

## 다음 행동

1. `npm install` 후 개발 서버와 타입/린트 검증
2. 실 API 계약 수립 후 Query 계층 연결
3. 지도 SDK와 OAuth 공급자 연동
4. 모바일 Active Trip, Stamp Complete 세부 인터랙션 보강
5. shadcn/ui 실제 설치 및 토큰 정리

## 환경 분리

### Dev

- 목업 데이터 중심
- 심사자 모드 기본 활성화 가능
- 로컬 `.env.local` 사용

### Production

- 실제 OAuth와 API 사용
- 서버 위치 검증 필수
- 심사자 데모는 별도 플래그로 제한

