# Frontend Workspace

`src/frontend`는 PLANLOG 프론트엔드 확장 작업을 위한 보조 작업 구역이다.

- 현재 실행 엔트리는 `src/app`에 있다.
- 화면/도메인 분리가 커지면 `src/frontend` 아래에 feature 단위 모듈을 확장한다.
- 1차 스캐폴딩에서는 문서화된 구조 가이드를 두고, 실제 실행 코드는 App Router 기준으로 유지한다.

권장 확장 구조:

```text
src/frontend/
  course/
  place/
  record/
  my/
```

## Naming Convention

| 대상 | 규칙 |
| --- | --- |
| 폴더 | `kebab-case` |
| React 컴포넌트 | `PascalCase.tsx` |
| 일반 TS 파일 | `kebab-case.ts` |
| 커스텀 훅 | `use-*.ts` |
| 함수·변수 | `camelCase` |
| 타입·인터페이스 | `PascalCase` |
| 상수 | `UPPER_SNAKE_CASE` |
| 라우트 | `kebab-case` |
| Next 특수 파일 | `page.tsx`, `layout.tsx` 등 공식 이름 유지 |
| 테스트 | `*.test.ts(x)` |
| 스토리 | `*.stories.tsx` |
| CSS Module | `ComponentName.module.css` |
