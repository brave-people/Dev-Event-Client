# CLAUDE.md

이 파일은 Claude Code(또는 호환 에이전트)가 이 저장소에서 작업할 때 따라야 할 규칙을 기록합니다.

## 프로젝트 환경

- Framework: Next.js 13 (App Router)
- 언어: TypeScript
- 패키지 매니저: **pnpm**
- Node.js: `>=20.0.0`
- 스타일: Tailwind CSS, styled-components, SCSS
- Lint/Format: ESLint + Prettier 2.5.1 (`trailingComma: "es5"` 기본값 — **함수 인자 trailing comma 금지**)

## 필수 규칙

### 1. 작업 완료 전 빌드 검증 (필수)

코드를 수정한 뒤에는 **반드시 `pnpm run build` 가 성공하는지 확인**한 다음 작업 완료로 보고합니다.

- `pnpm lint` 또는 `tsc --noEmit` 통과만으로는 부족합니다.
- `next build` 는 다음을 한 번에 잡아냅니다:
  - prettier/eslint 규칙 위반 (예: trailing comma)
  - 타입 에러
  - 페이지 단위 import / 런타임 그래프 문제 (서버 컴포넌트 번들링 이슈 등)
- 빌드가 실패하면 원인을 고친 뒤 다시 빌드를 돌려 성공을 확인한 후에 보고합니다.

```bash
pnpm run build
```

오래 걸릴 수 있으므로 background 실행 + 완료 알림 수신 방식을 권장합니다.

### 2. Prettier 규칙

- `trailingComma: "es5"` — 함수 호출/선언 인자 마지막에 콤마를 붙이지 마세요.
- `singleQuote: true`, `semi: true`, `printWidth: 80`.

### 3. 패키지 매니저

- `npm`/`yarn` 사용 금지. 항상 `pnpm`.
- 설치 후에는 `pnpm-lock.yaml` 변경분도 함께 커밋합니다.
