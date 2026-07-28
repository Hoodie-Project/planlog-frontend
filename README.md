# PLANLOG Frontend

PLANLOG는 감성과 출발 조건을 바탕으로 강원도 하루 여행 코스를 생성하고, 스탬프와 기록 카드로 여행을 남기는 반응형 웹 프론트엔드입니다.

## 실행

1. 의존성 설치

```bash
npm install
```

2. 환경 변수 설정

```bash
cp .env .env.local
```

필요한 값은 `.env.local`에서 수정합니다.

3. 개발 서버 실행

```bash
npm run dev
```

기본 주소는 `http://localhost:4000`입니다.

## 주요 스크립트

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## 사용 예시

- 랜딩: `/`
- 코스 만들기: `/course/create`
- 코스 결과: `/course/result`
- 저장한 코스: `/course/saved`
- 나의 기록: `/records`
- 마이페이지: `/my`

## 문서

- 제품 약속: [docs/prd.md](/Users/shinhayeong/planlog-frontend/docs/prd.md)
- 프론트엔드 구조: [docs/architecture.md](/Users/shinhayeong/planlog-frontend/docs/architecture.md)
- 작업 진행 상태: [docs/progress.md](/Users/shinhayeong/planlog-frontend/docs/progress.md)
