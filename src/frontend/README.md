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
